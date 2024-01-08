export function execute(input, env, setView) {
    let [cmd, ...args] = input.split(' ').filter(word => word !== '');
    const prompt = `visitor@winux ${env.fs.current.getPath()}$ `;

    if (!cmd) {
        trueCommand(prompt, setView);
        return;
    }

    const file = env.bin.get(cmd);
    switch (file?.value) {
        case "cd":
            changeDir(prompt + input, args, env, setView);
            break;
        case "clear":
            clear(setView);
            break;
        case "ls":
            list(prompt + input, env, setView);
            break;
        default:
            setView(prev => [
                ...prev,
                {
                    cmd: prompt + input,
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

function changeDir(cmd, args, env, setView) {
    if (args.length <= 0 || env.fs.changeDir(args[0]))
        return trueCommand(cmd, setView);

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
}

function list(cmd, env, setView) {
    let res = '';
    for (let item in env.fs.current.children) {
        res += `${item} `;
    }
    setView(prev => [
        ...prev,
        { cmd: cmd, output: res },
    ]);
}

function mkdir(cmd, args, env, setView) {
    
}
