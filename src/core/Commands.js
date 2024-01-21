export function execute(input, env, wm, setView) {
    let [cmd, ...args] = input.split(' ').filter(word => word !== '');
    const prompt = `visitor@winux ${env.fs.getPath(env.current)}$ `;

    setView(prev => [...prev, prompt + input + '\n']);

    if (!cmd) {
        return;
    }

    switch (cmd) {
        case "cd":
            changeDir(args, env, setView);
            break;
        case "echo":
            echo(args, setView);
            break;
        case "help":
            help(setView);
            break;
        default:
            const file = env.fs.get(env.bin, cmd);
            if (!file)
                error(setView, `${cmd}: command not found`);
            else if (file.type === 'exe')
                executeProgram(file, cmd, args, env, setView);
            else if (file.type === 'app')
                openApp(file, wm);
            else
                error(setView, `${cmd}: file not executable`)
            break;
    }
}

function executeProgram(file, cmd, args, env, setView) {
    const execProgram = new Function(
        'env', 'args', 'setView',
        `${file.value}\nreturn main(env, args, setView);`
    );
    try {
        return execProgram(env, args, setView);
    } catch (err) {
        setView(prev => [
            ...prev, `Error executing program '${cmd}'\n`,
        ]);
        console.error(err);
        return 1;
    }
}

function openApp(file, wm) {
    wm.add(file);
}

function error(setView, err, ret = 1) {
    setView(prev => [
        ...prev,
        `bash: ${err}\n`
    ]);
    return ret;
}



const cat = `function main(env, args, setView) {
    if (args.length !== 1) {
        setView(prev => [
            ...prev, 'bash: cat: Invalid number of arguments\\n'
        ]);
        return 1;
    }

    const file = env.fs.get(env.current, args[0]);
    if (file && !file.children) {
        setView(prev => [
            ...prev, file.value + '\\n'
        ]);
        return 0;
    }

    setView(prev => [
        ...prev, \`bash: cat: file '\${args[0]}' doesn't exist\\n\`,
    ]);
    return 1;
}`;

function changeDir(args, env, setView) {
    if (args.length <= 0)
        return 0;

    const current = env.fs.changeDir(env.current, args[0]);
    if (current) {
        env.current = current;
        return 0;
    }

    return error(setView, `cd ${args[0]}: No such file or directory`);
}

const clear = `function main(env, args, setView) {
    setView([]);
    return 0;
}`;

function echo(args, setView) {
    let output = '';
    for (const arg of args) {
        output = `${output}${arg} `;
    }
    setView(prev => [
        ...prev, output + '\n',
    ]);
    return 0;
}

function help(setView) {
    setView(prev => [
        ...prev,
`Welcome in winux by Martan03

Commands:
  cd [directory]
    changes current directory to the given directory
  echo [arguments...]
    prints the arguments
  help
    prints this help
`,
    ]);
    return 0;
}

const list = `function main(env, args, setView) {
    let ret = 0;
    if (args.length <= 0)
        args.push('');
    for (const arg of args) {
        const dir = env.fs.get(env.current, arg ?? '');
        if (!dir || !dir.children) {
            setView(prev => [
                ...prev, \`bash: ls: directory '\${arg}' not found\\n\`,
            ]);
            ret = 1;
            continue;
        }

        let res = args.length > 1 ? \`\${arg}:\\n\` : '';
        for (let item in dir.children) {
            res += \`\${item} \`;
        }
        setView(prev => [
            ...prev, res + '\\n',
        ]);
    }
    return ret;
}`;

const mkdir = `function main(env, args, setView) {
    if (args.length <= 0) {
        setView(prev => [
            ...prev, "mkdir: missing operand\\n",
        ]);
        return 1;
    }

    let ret = 0;
    for (const arg of args) {
        if (!env.fs.createDir(env.current, arg)) {
            setView(prev => [
                ...prev, \`mkdir: cannot create directory '\${arg}'\\n\`,
            ]);
            ret = 1;
        }
    }

    return 0;
}`;

const pwd = `function main(env, args, setView) {
    setView(prev => [
        ...prev,
        env.fs.getPath(env.current, true) + '\\n']
    );
    return 0;
}`;

const rm = `function error(setView, path, err) {
    setView(prev => [
        ...prev, \`rm: cannot remove '\${path}': \${err}\\n\`,
    ]);
}

function main(env, args, setView) {
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
            error(setView, path, 'No such file or directory');
        }
    }

    for (let item of items) {
        if (item.item.children && !dir) {
            error(setView, item.path, 'Is a directory');
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
