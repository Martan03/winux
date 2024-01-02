import { useState } from "react"
import Terminal from "../Apps/Terminal"
import { useEffect } from "react"

/// Renders window bar
function WindowBar({title, onClose}) {
    return (
        <div className="window-bar">
            <div>
                <p>{title}</p>
            </div>
            <div>
                <button onClick={onClose}>X</button>
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
function Window({title, url, onClose}) {
    const [isDrag, setIsDrag] = useState(false);
    const [pos, setPos] = useState({x: 0, y: 0});
    const [startPos, setStartPos] = useState({x: 0, y: 0});

    useEffect(() => {
        // Handles window dragging
        const handleMouseMove = (e) => {
            e.preventDefault();
            if (!isDrag)
                return;

            // Makes dragging bit faster
            requestAnimationFrame(() => {
                setPos({
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

    // Centers window
    useEffect(() => {
        const initialX = (window.innerWidth - 720) / 2;
        const initialY = (window.innerHeight - 500) / 2;
        setPos({ x: initialX, y: initialY });
      }, []);

    // Starts window dragging action
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDrag(true);
        setStartPos({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        });
    };

    return (
        <div
            className="window"
            style={{top: pos.y, left: pos.x}}
            onMouseDown={handleMouseDown}
        >
            <WindowBar title={title} onClose={onClose} />
            <div className="window-content">
                {url ? (
                    <ExtApp url={url} />
                ) : (
                    <BuildInApp title={title} />
                )}
            </div>
        </div>
    )
}

export default Window;
