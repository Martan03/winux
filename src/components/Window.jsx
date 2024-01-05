import { useState } from "react"
import Terminal from "../apps/Terminal"
import { useEffect } from "react"

/// Renders window bar
function WindowBar({win, setWindow, onClose}) {
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
                win.pos = {
                    x: e.clientX - startPos.x,
                    y: e.clientY - startPos.y,
                };
                setWindow(win);
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

    const close = (e) => {
        e.stopPropagation();
        onClose();
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
                <button className="btn" onMouseDown={close}>X</button>
            </div>
        </div>
    )
}

/// Renders build in app by its title
function BuildInApp({title}) {
    switch (title) {
        case 'Terminal':
            return <Terminal />
        default:
            return <p>App failed to load</p>
    }
}

/// Renders existing app using iframe
function ExtApp({url}) {
    return <iframe src={url} />
}

/// Renders window
function Window({id, win, editWindow, onClose, onActive}) {
    // Centers window
    useEffect(() => {
        const initialX = (window.innerWidth - 720) / 2;
        const initialY = (window.innerHeight - 500) / 2;
        win.pos = { x: initialX, y: initialY };
        setWindow(win);
    }, []);

    const setWindow = (editWin) => {
        editWindow(id, editWin);
    }

    return (
        <div
            className="window"
            onMouseDown={() => onActive(id)}
            style={{top: win.pos.y, left: win.pos.x}}
        >
            <WindowBar
                win={win}
                setWindow={setWindow}
                onClose={() => onClose(id)}
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
