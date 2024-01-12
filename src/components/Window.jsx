import { useState } from "react"
import Terminal from "../apps/Terminal"
import { useEffect } from "react"
import Notepad from "../apps/Notepad";

/// Renders window bar
function WindowBar({id, win, windows, setWindows, focus, setFocus}) {
    const [isDrag, setIsDrag] = useState(false);
    const [startPos, setStartPos] = useState({x: 0, y: 0});

    useEffect(() => {
        // Handles window dragging
        const handleMouseMove = (e) => {
            e.preventDefault();
            if (!isDrag)
                return;

            // Makes dragging bit faster
            requestAnimationFrame(() => {
                changePos({
                    x: e.clientX - startPos.x,
                    y: e.clientY - startPos.y,
                });
            });
        };

        // Disables window dragging on mouse up
        const handleMouseUp = () => setIsDrag(false);

        // Adds event listeners when dragging
        if (isDrag) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        // Removes event listeners when stopped dragging
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDrag, startPos]);

    // Starts window dragging action
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDrag(true);
        setStartPos({
            x: e.clientX - win.pos.x,
            y: e.clientY - win.pos.y,
        });
    };

    const changePos = (pos) => {
        var updated = [...windows];
        updated[id] = {
            ...updated[id],
            pos: pos,
        };
        setWindows(updated);
    }

    const onMinimize = (e) => {
        e.stopPropagation();

        var updated = [...windows];
        updated[id].minimized = true;
        setWindows(updated);

        if (id !== focus)
            return;

        let max = -1;
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].minimized)
                continue;

            if (updated[max]?.zIndex ?? 0 < updated[i].zIndex) {
                max = i;
            }
        }
        setFocus(max);
    }

    const onClose = (e) => {
        e.stopPropagation();

        var updated = [...windows];
        updated.splice(id, 1);
        setWindows(updated);

        if (id !== focus || updated.length <= 0) {
            if (id < focus)
                setFocus(focus - 1);
            return;
        }

        let max = -1;
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].minimized)
                continue;

            if (updated[max]?.zIndex ?? 0 < updated[i].zIndex) {
                max = i;
            }
        }
        setFocus(max);
    }

    return (
        <div
            className={'window-bar' + (focus === id ? ' focus' : '')}
            onMouseDown={handleMouseDown}
        >
            <div>
                <p>{win.app.title}</p>
            </div>
            <div>
                <button className="btn" onMouseDown={onMinimize}>_</button>
                <button className="btn" onMouseDown={onClose}>X</button>
            </div>
        </div>
    )
}

/// Renders build in app by its title
function BuildInApp({id, title, fs, setFs}) {
    switch (title) {
        case 'Terminal':
            return <Terminal id={id} fs={fs} setFs={setFs} />
        case 'Notepad':
            return <Notepad />
        default:
            return <p>App failed to load</p>
    }
}

/// Renders existing app using iframe
function ExtApp({url}) {
    return <iframe src={url} />
}

/// Renders window
function Window({
    id, win, windows, setWindows, focus, setFocus, editWindow, fs, setFs
}) {
    // Centers window
    useEffect(() => {
        const initialX = Math.max((window.innerWidth - 720) / 2, 0);
        const initialY = Math.max((window.innerHeight - 500) / 2, 0);
        win.pos = { x: initialX, y: initialY };
        setWindow(win);
    }, []);

    if (win.minimized)
        return;

    const setWindow = (editWin) => {
        editWindow(id, editWin);
    }

    const onFocus = () => {
        if (id == focus)
            return;

        var win = [...windows];
        win[id].zIndex = win[focus] ? win[focus].zIndex + 1 : 1;
        setWindows(win);
        setFocus(id);
    }

    return (
        <div
            className="window"
            onMouseDown={onFocus}
            style={{top: win.pos.y, left: win.pos.x, zIndex: win.zIndex}}
        >
            <WindowBar
                id={id}
                win={win}
                windows={windows}
                setWindows={setWindows}
                focus={focus}
                setFocus={setFocus}
            />
            <div className="window-content">
                {win.app.url ? (
                    <ExtApp url={win.app.url} />
                ) : (
                    <BuildInApp
                        id={id}
                        title={win.app.title}
                        fs={fs} setFs={setFs}
                    />
                )}
            </div>
        </div>
    )
}

export default Window;
