export function execute(input, env, setView) {
    let [cmd, ...args] = input.split(' ').filter(word => word !== '');
    const prompt = `visitor@winux ${env.fs.getPath(env.current)}$ `;

    if (!cmd) {
        trueCommand(prompt, setView);
        return;
    }

    const file = env.fs.get(env.bin, cmd);
    switch (file?.value) {
        case "cat":
            cat(prompt + input, args, env, setView);
            break;
        case "cd":
            changeDir(prompt + input, args, env, setView);
            break;
        case "clear":
            clear(setView);
            break;
        case "ls":
            list(prompt + input, env, setView);
            break;
        case "mkdir":
            mkdir(prompt + input, args, env, setView);
            break;
        default:
            internal(cmd, args, prompt + input, env, setView);
            break;
    }
}

function internal(cmd, args, prompt, env, setView) {
    switch (cmd) {
        case "cd":
            changeDir(prompt, args, env, setView);
            break;
        case "echo":
            echo(prompt, args, setView);
            break;
        case "help":
            help(prompt, setView);
            break;
        default:
            setView(prev => [
                ...prev,
                {
                    cmd: prompt,
                    output: `bash: ${cmd}: command not found`,
                }
            ]);
            break;
    }
}

function trueCommand(cmd, setView) {
    setView(prev => [
        ...prev,
        { cmd: cmd }
    ]);
    return 0;
}

function cat(cmd, args, env, setView) {
    if (args.length !== 1) {
        setView(prev => [
            ...prev,
            { cmd, output: 'bash: cat: Invalid number of arguments' },
        ]);
        return 1;
    }

    const file = env.fs.get(env.current, args[0]);
    if (file && !file.children) {
        setView(prev => [
            ...prev,
            { cmd, output: file.value },
        ]);
        return 0;
    }

    setView(prev => [
        ...prev,
        { cmd, output: `bash: cat: file '${args[0]}' doesn't exist` },
    ]);
    return 1;
}

function changeDir(cmd, args, env, setView) {
    if (args.length <= 0)
        return trueCommand(cmd, setView);

    const current = env.fs.changeDir(env.current, args[0]);
    if (current) {
        env.current = current;
        return trueCommand(cmd, setView);
    }

    setView(prev => [
        ...prev,
        {
            cmd: cmd,
            output: `bash: cd: ${args[0]}: No such file or directory`,
        },
    ]);
    return 1;
}

function clear(setView) {
    setView([]);
    return 0;
}

function echo(cmd, args, setView) {
    let output = '';
    for (const arg of args) {
        output = `${output}${arg} `;
    }
    setView(prev => [
        ...prev,
        { cmd, output }
    ]);
    return 0;
}

function help(cmd, setView) {
    setView(prev => [
        ...prev,
        {
            cmd: cmd,
            output:
                "Welcome in winux by Martan03\n\n" +
                "Commands:\n" +
                "    cd"
        }
    ]);
    return 0;
}

function list(cmd, env, setView) {
    let res = '';
    for (let item in env.current.children) {
        res += `${item} `;
    }
    setView(prev => [
        ...prev,
        { cmd: cmd, output: res },
    ]);
    return 0;
}

function mkdir(cmd, args, env, setView) {
    if (args.length <= 0) {
        setView(prev => [
            ...prev,
            { cmd: cmd, output: "mkdir: missing operand" },
        ]);
        return 1;
    }

    if (!env.fs.createDir(env.current, args[0])) {
        setView(prev => [
            ...prev,
            {
                cmd: cmd,
                output: `mkdir: cannot create directory '${args[0]}'`
            },
        ]);
        return 1;
    }

    setView(prev => [
        ...prev,
        { cmd: cmd },
    ]);
    return 0;
}
