import { useState } from "react";

function handleCommand(input, setView, cmdId) {
    let [cmd, ...args] = input.split(' ').filter(word => word !== '');

    switch (cmd.toLowerCase()) {
        case "clear":
            setView([]);
            break;
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

function Terminal() {
    const [cmd, setCmd] = useState('');
    const [history, setHistory] = useState([]);
    const [historyId, setHistoryId] = useState(-1);
    const [view, setView] = useState([]);
    const [pos, setPos] = useState(0);

    const onChange = (e) => {
        setCmd(e.target.value);
        setPos(e.target.selectionStart)
    }

    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft' && pos > 0) {
            setPos(pos - 1);
        } else if (e.key === 'ArrowRight' && pos < cmd.length) {
            setPos(pos + 1);
        } else if (e.key === 'ArrowUp' && historyId < history.length - 1) {
            setCmd(history[historyId + 1]);
            setHistoryId(historyId + 1);
            setPos(0);
        } else if (e.key === 'ArrowDown' && historyId > -1) {
            setCmd(history[historyId - 1] ?? '');
            setHistoryId(historyId - 1);
            setPos(0);
        } else if (e.key === 'End') {
            setPos(cmd.length);
        } else if (e.key === 'Home') {
            setPos(0);
        } else if (e.key === 'Enter') {
            const output = handleCommand(cmd, setView, history.length);
            setHistory([
                ...history,
                cmd,
            ]);
            setCmd('');
        }
    }

    return (
        <label htmlFor="cmdInput">
            <div className="term" htmlFor="cmdInput">
                {view.map((item, key) => (
                    <div key={key}>
                        <span className="term-path">visitor@winux: </span>
                        {history[item.cmd]} <br />
                        {item.output ? (
                            <p>{item.output}</p>
                        ) : ''}
                    </div>
                ))}
                <span className="term-path">visitor@winux: </span>
                <span>{cmd.slice(0, pos)}</span>
                <div className="term-cursor"><div></div></div>
                <span>{cmd.slice(pos)}</span>
                <input
                    type="text" id="cmdInput"
                    value={cmd} onChange={onChange}
                    onKeyDown={onKeyDown}
                    autoComplete="off" autoFocus
                />
            </div>
        </label>
    )
}

export default Terminal;
