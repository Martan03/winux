function splitInput(input) {
    const regex = /"((?:\\.|[^"\\])*)"|'([^']*)'|(\S+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(input))) {
        if (match[1]) {
            const res = match[1].replace(/\\\"/g, '"').replace(/\\\\/g, '\\');
            matches.push(res);
        } else if (match[3]) {
            const res = match[3].replace(/\\(.)/g, match => match[1]);
            matches.push(res);
        } else {
            matches.push(match[2]);
        }
    }

    const command = matches.shift();
    return [command, matches];
}

export function exec(input, env, wm, setView) {
    const prompt = `visitor@winux ${env.fs.getPath(env.current)}$ `;
    setView(prev => [...prev, prompt + input + '\n']);

    let redirect = '';
    const regex = />\s*\w+/g;
    const command = input.replace(regex, match => {
        redirect = match.trim().slice(1);
        return '';
    });

    if (redirect && redirect !== '') {
        let output = '';
        env.print = (val) => output += val;

        execute(command, env, wm);
        env.fs.saveToFile(env.current, redirect.trim(), output);
    } else {
        env.print = env.error;
        execute(command, env, wm);
    }
}

function execute(input, env, wm) {
    let [cmd, args] = splitInput(input);

    if (!cmd) {
        return;
    }

    switch (cmd) {
        case "cd":
            changeDir(env, args);
            break;
        case "echo":
            echo(env, args);
            break;
        case "help":
            help(env);
            break;
        default:
            let dir = env.bin;
            if (cmd.startsWith('./') ||
                cmd.startsWith('/') ||
                cmd.startsWith('~')) {
                dir = env.current;
            }
            const file = env.fs.get(dir, cmd);

            if (!file)
                error(env, `${cmd}: command not found`);
            else if (file.type === 'exe')
                executeProgram(file, cmd, args, env);
            else if (file.type === 'app')
                openApp(file, wm);
            else
                error(env, `${cmd}: file not executable`)
            break;
    }
}

function executeProgram(file, cmd, args, env) {
    try {
        const execProgram = new Function(
            'env', 'args',
            `${file.value}\nreturn main(env, args);`
        );
        return execProgram(env, args);
    } catch (err) {
        env.error(`Error executing program '${cmd}'\n`);
        return 1;
    }
}

function openApp(file, wm) {
    wm.add(file);
}

function error(env, err, ret = 1) {
    env.error(`bash: ${err}\n`);
    return ret;
}


//>=========================================================================<//
//                             Built in programs                             //
//>=========================================================================<//

/// cd - changes current working directory based on given path
function changeDir(env, args) {
    if (args.length > 1)
        return error(env, `cd: too many arguments`);

    const current = env.fs.getDir(env.current, args[0] ?? '');
    if (!current)
        return error(env, `cd: ${args[0]}: No such file or directory`);

    env.current = current;
    return 0;
}

/// echo - prints arguments on stdout
function echo(env, args) {
    env.print(args.join(' ') + '\n');
    return 0;
}

/// help - displays help
function help(env) {
    env.print(
`Welcome in winux by Martan03

Commands:
  cd [directory]
    changes current directory to the given directory
  echo [arguments...]
    prints the arguments
  help
    prints this help
`,
    );
    return 0;
}


//>=========================================================================<//
//                              $PATH programs                               //
//>=========================================================================<//

/// cat - displays content of the file
const cat = `function main(env, args) {
    if (args.length !== 1) {
        env.error('bash: cat: Invalid number of arguments\\n');
        return 1;
    }

    const file = env.fs.getFile(env.current, args[0]);
    if (!file) {
        env.error(\`bash: cat: file '\${args[0]}' doesn't exist\\n\`);
        return 1;
    }

    env.print(file.value);
    return 0;
}`;

/// chmod - changes file rights
const chmod = `function main(env, args) {
    const mode = args.shift();

    let type = 'exe';
    switch (mode) {
        case "+x":
            break;
        case "-x":
            type = 'txt';
            break;
        default:
            env.error(\`chmod: invalid mode: '\${mode}'\\n\`);
            return 1;
    }

    let ret = 0;
    for (const arg of args) {
        const file = env.fs.get(env.current, arg);
        if (!file) {
            env.error(
                "chmod: cannot access '" + arg +
                "':No such file or directory\\n"
            );
            ret = 1;
            continue;
        }
        file.type = type;
    }

    return ret;
}`

/// clear - clears screen
const clear = `function main(env, args) {
    env.clear();
    return 0;
}`;

/// ls - lists all files and directories from given directory
const list = `function main(env, args) {
    let ret = 0;
    if (args.length <= 0)
        args.push('');
    for (const arg of args) {
        const dir = env.fs.get(env.current, arg ?? '');
        if (!dir || !dir.children) {
            env.error(\`bash: ls: directory '\${arg}' not found\\n\`);
            ret = 1;
            continue;
        }

        let res = args.length > 1 ? \`\${arg}:\\n\` : '';
        for (let item in dir.children) {
            res += \`\${item} \`;
        }
        env.print(res + '\\n');
    }
    return ret;
}`;

/// mkdir - create directory
const mkdir = `function main(env, args) {
    if (args.length <= 0) {
        env.error("mkdir: missing operand\\n");
        return 1;
    }

    let ret = 0;
    for (const arg of args) {
        if (!env.fs.createDir(env.current, arg)) {
            env.error(\`mkdir: cannot create directory '\${arg}'\\n\`);
            ret = 1;
        }
    }

    return 0;
}`;

/// pwd - displays current working directory path
const pwd = `function main(env, args) {
    env.print(env.fs.getPath(env.current, true) + '\\n');
    return 0;
}`;

/// rm - removes given file or directory
const rm = `function error(env, path, err) {
    env.error(\`rm: cannot remove '\${path}': \${err}\\n\`);
}

function main(env, args) {
    let items = [];

    let ret = 0;
    let dir = false;
    for (const path of args) {
        if (path == '-r') {
            dir = true;
            continue;
        }
        const item = env.fs.get(env.current, path);
        if (item) {
            items.push({item, path});
        } else {
            error(env, path, 'No such file or directory');
        }
    }

    for (let item of items) {
        if (item.item.children && !dir) {
            error(env, item.path, 'Is a directory');
            continue;
        }

        env.fs.remove(item.item.parent, item.item.name);
    }

    return ret;
}`;

/// touch - creates file
const touch =`function main(env, args) {
    let ret = 0;
    for (const arg of args) {
        const index = arg.lastIndexOf('/');
        const parentPath = arg.slice(0, index);
        const file = arg.slice(index + 1);

        if (file == '.')
            continue;

        if (file == '..') {
            env.error(\`touch: setting times of '..': Permission denied\\n\`);
            ret = 1;
            continue;
        }

        let parent = env.current;
        if (index !== -1)
            parent = env.fs.get(env.current, parentPath);

        if (!parent) {
            env.error(
                \`touch: cannot touch '\${arg}': No such file or directory\\n\`
            );
            ret = 1;
            continue;
        }
        env.fs.createFile(parent, file);
    }

    return ret;
}`;

/// Gets all commands in file system format
export function getCommands(parent) {
    return {
        cat: {
            name: 'cat', type: 'exe', parent, value: cat,
        },
        chmod: {
            name: 'chmod', type: 'exe', parent, value: chmod,
        },
        clear: {
            name: 'clear', type: 'exe', parent, value: clear,
        },
        ls: {
            name: 'ls', type: 'exe', parent, value: list,
        },
        mkdir: {
            name: 'mkdir', type: 'exe', parent, value: mkdir,
        },
        pwd: {
            name: 'pwd', type: 'exe', parent, value: pwd,
        },
        rm: {
            name: 'rm', type: 'exe', parent, value: rm,
        },
        touch: {
            name: 'touch', type: 'exe', parent, value: touch,
        },
    }
}
