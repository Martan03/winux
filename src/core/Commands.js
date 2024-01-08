export function execute(command, fs) {
    let [cmd, ...args] = input.split(' ').filter(word => word !== '');

    const file = fs.get(cmd);

    switch (file?.value) {
        case "clear":
            setView([]);
            break;
        case "mkdir":
            fs.createDir(args)
        default:
            setView(prev => [
                ...prev,
                {
                    cmd: cmdId,
                    output: `bash: ${cmd}: command not found`,
                }
            ]);
            break;
    }
}

function clear(setView) {
    setView([]);
}
