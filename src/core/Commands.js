export function execute(input, env, setView) {
    let [cmd, ...args] = input.split(' ').filter(word => word !== '');
    const prompt = `visitor@winux ${env.fs.getPath(env.current)}$ `;

    if (!cmd) {
        trueCommand(prompt, setView);
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
            executeProgram(cmd, args, prompt + input, env, setView);
            break;
    }
}

function executeProgram(cmd, args, prompt, env, setView) {
    const file = env.fs.get(env.bin, cmd);
    if (!file) {
        setView(prev => [
            ...prev,
            prompt,
            `bash: ${cmd}: command not found`,
        ]);
        return 1;
    }

    setView(prev => [...prev, prompt]);
    const execProgram = new Function(
        'env', 'args', 'setView',
        `${file.value}\nreturn main(env, args, setView);`
    );
    try {
        return execProgram(env, args, setView);
    } catch (err) {
        setView(prev => [
            ...prev, `Error executing program '${cmd}'`,
        ]);
        console.error(err);
        return 1;
    }
}

function trueCommand(cmd, setView) {
    setView(prev => [
        ...prev, cmd,
    ]);
    return 0;
}

const cat = `function main(env, args, setView) {
    if (args.length !== 1) {
        setView(prev => [
            ...prev, 'bash: cat: Invalid number of arguments'
        ]);
        return 1;
    }

    const file = env.fs.get(env.current, args[0]);
    if (file && !file.children) {
        setView(prev => [
            ...prev, file.value
        ]);
        return 0;
    }

    setView(prev => [
        ...prev, \`bash: cat: file '\${args[0]}' doesn't exist\`,
    ]);
    return 1;
}`

function changeDir(cmd, args, env, setView) {
    if (args.length <= 0)
        return trueCommand(cmd, setView);

    const current = env.fs.changeDir(env.current, args[0]);
    if (current) {
        env.current = current;
        return trueCommand(cmd, setView);
    }

    setView(prev => [
        ...prev, cmd, `bash: cd: ${args[0]}: No such file or directory`,
    ]);
    return 1;
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
        "    cd",
    ]);
    return 0;
}

const list = `function main(env, args, setView) {
    let res = '';
    for (let item in env.current.children) {
        res += \`\${item} \`;
    }
    setView(prev => [
        ...prev, res,
    ]);
    return 0;
}`

const mkdir = `function main(env, args, setView) {
    if (args.length <= 0) {
        setView(prev => [
            ...prev, "mkdir: missing operand",
        ]);
        return 1;
    }

    if (!env.fs.createDir(env.current, args[0])) {
        setView(prev => [
            ...prev, \`mkdir: cannot create directory '\${args[0]}'\`,
        ]);
        return 1;
    }

    return ;
}`

export function getCommands(parent) {
    return {
        cat: {
            name: 'cat', type: 'exe', parent,
            value: cat.toString().replace('cat', 'main'),
        },
        clear: {
            name: 'clear', type: 'exe', parent,
            value: clear.toString().replace('clear', 'main'),
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
