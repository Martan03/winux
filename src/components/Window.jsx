import { useState } from "react"
import Terminal from "../apps/Terminal"
import { useEffect } from "react"
import Notepad from "../apps/Notepad";

/// Renders window bar
function WindowBar({id, win, windows, setWindows}) {
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
        if (win.focus) {
            for (let i = updated.length - 2; i >= 0; i--) {
                if (!updated[i].minimized) {
                    [updated[id], updated[i]] = [
                        {
                            ...updated[i],
                            focus: true,
                        }, {
                            ...updated[id],
                            focus: false,
                            minimized: true,
                        }
                    ];
                }
            }
        }

        setWindows(updated);
    }

    const onClose = (e) => {
        e.stopPropagation();

        var updatedWindows = [...windows];
        updatedWindows.splice(id, 1);

        if (win.focus && updatedWindows.length > 0)
            updatedWindows[updatedWindows.length - 1].focus = true;

        setWindows(updatedWindows);
    }

    return (
        <div
            className={'window-bar' + (win.focus ? ' focus' : '')}
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
function BuildInApp({title}) {
    switch (title) {
        case 'Terminal':
            return <Terminal />
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
function Window({id, win, windows, setWindows, editWindow}) {
    // Centers window
    useEffect(() => {
        const initialX = (window.innerWidth - 720) / 2;
        const initialY = (window.innerHeight - 500) / 2;
        win.pos = { x: initialX, y: initialY };
        setWindow(win);
    }, []);

    if (win.minimized)
        return;

    const setWindow = (editWin) => {
        editWindow(id, editWin);
    }

    const onActive = () => {
        if (id === windows.length - 1)
            return;

        var updated = [...windows];
        updated[updated.length - 1].focus = false;
        updated.splice(id, 1);

        setWindows([
            ...updated,
            {
                ...windows[id],
                focus: true,
            }
        ]);
    }

    return (
        <div
            className="window"
            onMouseDown={onActive}
            style={{top: win.pos.y, left: win.pos.x}}
        >
            <WindowBar
                id={id}
                win={win}
                windows={windows}
                setWindows={setWindows}
            />
            <div className="window-content">
                {win.app.url ? (
                    <ExtApp url={win.app.url} />
                ) : (
                    <BuildInApp title={win.app.title} />
                )}
            </div>
        </div>
    )
}

export default Window;
