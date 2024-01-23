import { useEffect, useRef, useState } from "react";
import { Environment } from "../core/Environment";
import { exec } from "../core/Commands";

function Input({cmd, cursor}) {
    return (
        <>
            <span>{cmd.slice(0, cursor)}</span>
            <span className="term-cursor">{cmd[cursor] ?? ' '}</span>
            <span>{cmd.slice(cursor + 1)}</span>
        </>
    )
}

function Prompt({env, cmd, cursor}) {
    return (
        <>
            <span>{env.vars['USER']}@winux {env.getPath()}$ </span>
            <Input cmd={cmd} cursor={cursor} />
        </>
    )
}

function Terminal({id, fs, wm}) {
    const [view, setView] = useState([]);
    const [env, setEnv] = useState(new Environment(fs, setView));

    const [cmd, setCmd] = useState('');
    const [history, setHistory] = useState([]);
    const [historyId, setHistoryId] = useState(-1);
    const [pos, setPos] = useState(0);

    const term = useRef(null);

    useEffect(() => {
        term.current.scrollTop = term.current.scrollHeight;
    }, [view]);

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
            //execute(cmd, env, wm, setView);
            exec(cmd, env, wm, setView);
            setHistoryId(-1);
            setHistory(prev => [
                cmd,
                ...prev,
            ]);
            setCmd('');
        }
    }

    return (
        <label htmlFor={`cmdInput${id}`}>
            <div className="term" ref={term}>
                {view.map((item, key) => (
                    <span key={key}>{item}</span>
                ))}
                <Prompt env={env} cmd={cmd} cursor={pos} />
                <input
                    type="text" id={`cmdInput${id}`}
                    value={cmd} onChange={onChange}
                    onKeyDown={onKeyDown}
                    autoComplete="off" autoFocus
                    autoCapitalize="off"
                />
            </div>
        </label>
    )
}

export default Terminal;
