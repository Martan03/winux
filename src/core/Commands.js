export function execute(input, env, setView) {
    let [cmd, ...args] = input.split(' ').filter(word => word !== '');
    const prompt = `visitor@winux ${env.fs.getPath(env.current)}$ `;

    setView(prev => [...prev, prompt + input + '\n']);

    if (!cmd) {
        return;
    }

    switch (cmd) {
        case "cd":
            changeDir(prompt + input, args, env, setView);
            break;
        case "echo":
            echo(prompt + input, args, setView);
            break;
        case "help":
            help(prompt + input, setView);
            break;
        default:
            const file = env.fs.get(env.bin, cmd);
            if (!file)
                error(setView, `${cmd}: command not found`);
            else if (file.type === 'exe')
                executeProgram(file, cmd, args, env, setView);
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
}`

function changeDir(cmd, args, env, setView) {
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
}`

function echo(cmd, args, setView) {
    let output = '';
    for (const arg of args) {
        output = `${output}${arg} `;
    }
    setView(prev => [
        ...prev, cmd, output,
    ]);
    return 0;
}

function help(cmd, setView) {
    setView(prev => [
        ...prev, cmd,
        "Welcome in winux by Martan03\n" +
        "Commands:\n" +
        "    cd\n",
    ]);
    return 0;
}

const list = `function main(env, args, setView) {
    const dir = env.fs.get(env.current, args[0] ?? '');
    if (!dir || !dir.children) {
        setView(prev => [
            ...prev, \`bash: ls: directory '\${args[0]}' not found\\n\`,
        ]);
        return 1;
    }

    let res = '';
    for (let item in dir.children) {
        res += \`\${item} \`;
    }
    setView(prev => [
        ...prev, res + '\\n',
    ]);
    return 0;
}`

const mkdir = `function main(env, args, setView) {
    if (args.length <= 0) {
        setView(prev => [
            ...prev, "mkdir: missing operand\\n",
        ]);
        return 1;
    }

    if (!env.fs.createDir(env.current, args[0])) {
        setView(prev => [
            ...prev, \`mkdir: cannot create directory '\${args[0]}'\\n\`,
        ]);
        return 1;
    }

    return 0;
}`

export function getCommands(parent) {
    return {
        cat: {
            name: 'cat', type: 'exe', parent,
            value: cat,
        },
        clear: {
            name: 'clear', type: 'exe', parent,
            value: clear,
        },
        ls: {
            name: 'ls', type: 'exe', parent,
            value: list,
        },
        mkdir: {
            name: 'mkdir', type: 'exe', parent,
            value: mkdir,
        },
    }
}
