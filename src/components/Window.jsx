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
        if (win.maximized)
            return;

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

    const onMaximize = () => {
        if (win.maximized)
            wm.unmaximize(id);
        else
            wm.maximize(id);
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
                <p>{win.app.name}</p>
            </div>
            <div>
                <button className="btn" onMouseDown={onMinimize}>_</button>
                <button className="btn ts" onMouseDown={onMaximize}>🗖</button>
                <button className="btn" onMouseDown={onClose}>X</button>
            </div>
        </div>
    )
}

/// Renders build in app by its title
function BuildInApp({id, win, fs, wm}) {
    const name = win.app.exec ? win.app.exec : win.app.name.toLowerCase();
    switch (name) {
        case 'terminal':
        case '/usr/bin/terminal':
            return <Terminal id={id} fs={fs} wm={wm} />
        case 'notepad':
        case '/usr/bin/notepad':
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

    let style = {
        top: win.pos.y,
        left: win.pos.x,
        zIndex: win.zIndex,
    };
    if (win.maximized) {
        style = {
            top: 0,
            left: 0,
            zIndex: win.zIndex,
            width: window.screen.width,
            height: window.screen.height - 28,
        };
    }

    return (
        <div
            className="window"
            onMouseDown={() => wm.changeFocus(id)}
            style={style}
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
                        wm={wm}
                    />
                )}
            </div>
        </div>
    )
}

export default Window;
