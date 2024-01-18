import { useState } from "react"
import Terminal from "../apps/Terminal"
import { useEffect } from "react"
import Notepad from "../apps/Notepad";

/// Renders window bar
function WindowBar({id, win, wm}) {
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
        wm.move(id, pos);
    }

    const onMinimize = (e) => {
        e.stopPropagation();
        wm.minimize(id);
    }

    const onClose = (e) => {
        e.stopPropagation();
        wm.close(id);
    }

    return (
        <div
            className={'window-bar' + (wm.focus === id ? ' focus' : '')}
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
function BuildInApp({id, win, fs}) {
    const name = win.app.exec ? win.app.exec : win.app.title;
    switch (name) {
        case 'Terminal':
        case '/usr/bin/terminal':
            return <Terminal id={id} fs={fs} />
        case 'Notepad' || '/usr/bin/notepad':
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
    id, win, fs, wm
}) {
    if (win.minimized)
        return;

    return (
        <div
            className="window"
            onMouseDown={() => wm.changeFocus(id)}
            style={{top: win.pos.y, left: win.pos.x, zIndex: win.zIndex}}
        >
            <WindowBar id={id} win={win} wm={wm} />
            <div className="window-content">
                {win.app.url ? (
                    <ExtApp url={win.app.url} />
                ) : (
                    <BuildInApp
                        id={id}
                        win={win}
                        fs={fs}
                    />
                )}
            </div>
        </div>
    )
}

export default Window;
