function splitInput(input) {
    const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(input))) {
        const result = match[1] || match[2] || match[3];
        matches.push(result);
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
            const file = env.fs.get(env.bin, cmd);
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
    const execProgram = new Function(
        'env', 'args',
        `${file.value}\nreturn main(env, args);`
    );
    try {
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



const cat = `function main(env, args) {
    if (args.length !== 1) {
        env.error('bash: cat: Invalid number of arguments\\n');
        return 1;
    }

    const file = env.fs.get(env.current, args[0]);
    if (file && !file.children) {
        env.print(file.value);
        return 0;
    }

    env.error(\`bash: cat: file '\${args[0]}' doesn't exist\\n\`);
    return 1;
}`;

function changeDir(env, args) {
    if (args.length <= 0)
        return 0;

    const current = env.fs.changeDir(env.current, args[0]);
    if (current) {
        env.current = current;
        return 0;
    }

    return error(env, `cd ${args[0]}: No such file or directory`);
}

const clear = `function main(env, args) {
    env.clear();
    return 0;
}`;

function echo(env, args) {
    env.print(args.join(' ') + '\n');
    return 0;
}

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

const pwd = `function main(env, args) {
    env.print(env.fs.getPath(env.current, true) + '\\n');
    return 0;
}`;

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

export function getCommands(parent) {
    return {
        cat: {
            name: 'cat', type: 'exe', parent, value: cat,
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
    }
}
