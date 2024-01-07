import { useState } from "react";

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
        } else if (e.key === 'End') {
            setPos(cmd.length);
        } else if (e.key === 'Home') {
            setPos(0);
        } else if (e.key === 'Enter') {
            setView([
                ...view,
                {
                    cmd: history.length,
                    output: 'Not implemented',
                },
            ]);
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
                        {item.output} <br />
                    </div>
                ))}
                <span className="term-path">visitor@winux: </span>
                {cmd.slice(0, pos)}
                <div className="term-cursor"><div></div></div>
                {cmd.slice(pos)}
                <input
                    type="text" id="cmdInput" autoFocus
                    value={cmd} onChange={onChange}
                    onKeyDown={onKeyDown}
                />
            </div>
        </label>
    )
}

export default Terminal;
