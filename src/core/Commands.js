import { splitInput } from "./Lexer";

export function execute(input, env, wm, setView) {
    const prompt = `${env.vars['USER']}@winux ${env.getPath()}$ `;
    setView(prev => [...prev, prompt + input + '\n']);

    const parts = input.split('|');

    let output = '';
    const print = (val) => output += val;

    let ret = 0;
    for (const part of parts) {
        env.stdin = output;
        output = '';
        const res = executePart(part, env, wm, print);
        if (res)
            ret = res;
    }
    env.print = env.error;
    env.print(output);
    env.stdin = '';
    env.vars['?'] = ret;
}

function executePart(input, env, wm, print) {
    const [cmd, args, redirect] = splitInput(env, input);

    let ret;
    if (redirect && redirect !== '') {
        let output = '';
        env.print = (val) => output += val;

        ret = executeCommand(cmd, args, env, wm);
        env.fs.saveToFile(env.current, redirect.trim(), output);
    } else {
        env.print = print;
        ret = executeCommand(cmd, args, env, wm);
    }

    return ret;
}

function executeCommand(cmd, args, env, wm) {
    if (!cmd) {
        return 0;
    }

    switch (cmd) {
        case "cd":
            return changeDir(env, args);
        case "echo":
            return echo(env, args);
        case "export":
            return exportVar(env, args);
        case "help":
            return help(env);
        default:
            let dir = env.get(env.vars['PATH']);
            if (cmd.startsWith('./') ||
                cmd.startsWith('/') ||
                cmd.startsWith('~')) {
                dir = env.current;
            }
            const file = env.fs.get(dir, cmd);

            if (!file)
                return error(env, `${cmd}: command not found`);
            else if (file.type === 'exe')
                return executeProgram(file, cmd, args, env);
            else if (file.type === 'app')
                return openApp(file, wm);
            else
                return error(env, `${cmd}: file not executable`)
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
        console.log(err);
        env.error(`Error executing program '${cmd}'\n`);
        return 1;
    }
}

function openApp(file, wm) {
    wm.add(file);
    return 0;
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

    const current = env.getDir(args[0] ?? env.vars['HOME']);
    if (!current)
        return error(env, `cd: ${args[0]}: No such file or directory`);

    env.current = current;
    env.vars['PWD'] = env.getPath(true);
    return 0;
}

/// echo - prints arguments on stdout
function echo(env, args) {
    env.print(args.join(' ') + '\n');
    return 0;
}

/// export - sets value of the variable
function exportVar(env, args) {
    if (args.length <= 0) {
        env.print(Object.keys(env.vars)
            .map(key => `declare -x ${key}="${env.vars[key]}"`)
            .join('\n') + '\n'
        );
        return 0;
    }

    let ret = 0;
    for (const arg of args) {
        const [name, val] = arg.split('=');
        if (name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            env.vars[name] = val ?? '';
        } else {
            ret = error(env, `export: '${arg}' not a valid identifier`);
        }
    }

    return ret;
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
  export [name[=value]...]
    sets variable 'name' to 'value'
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
    if (args.length === 0) {
        env.print(env.stdin);
        return 0;
    }
    else if (args.length !== 1) {
        env.error('bash: cat: Invalid number of arguments\\n');
        return 1;
    }

    const file = env.getFile(args[0]);
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
        const file = env.get(arg);
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

/// false - returns 1
const falseCommand = `function main(env, args) {
    return 1
}`;

/// ls - lists all files and directories from given directory
const list = `function main(env, args) {
    if (args.length <= 0)
        args.push('');

    let ret = 0;
    for (const arg of args) {
        const dir = env.getDir(arg);
        if (!dir) {
            env.error(\`bash: ls: directory '\${arg}' not found\\n\`);
            ret = 1;
            continue;
        }

        let res = args.length > 1 ? \`\${arg}:\\n\` : '';
        res += Object.keys(dir.children)
            .map(key => key.includes(' ') ? \`'\${key}'\` : key)
            .join(' ');
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
        if (!env.createDir(arg)) {
            env.error(\`mkdir: cannot create directory '\${arg}'\\n\`);
            ret = 1;
        }
    }

    return ret;
}`;

/// pwd - displays current working directory path
const pwd = `function main(env, args) {
    env.print(env.getPath(true) + '\\n');
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
        const item = env.get(path);
        if (item) {
            items.push({item, path});
        } else {
            error(env, path, 'No such file or directory');
            ret = 1;
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
const touch = `function main(env, args) {
    let ret = 0;
    for (const arg of args) {
        if (env.get(arg))
            continue;

        if (!env.createFile(arg)) {
            env.error(
                \`touch: cannot touch '\${arg}': No such file or directory\\n\`
            );
            ret = 1;
        }
    }

    return ret;
}`;

/// true - returns 0
const trueCommand = `function main(env, args) {
    return 0;
}`

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
        false: {
            name: 'false', type: 'exe', parent, value: falseCommand,
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
        true: {
            name: 'true', type: 'exe', parent, value: trueCommand,
        },
    }
}
