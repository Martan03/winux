import Terminal from "../Apps/Terminal"

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
    return (
        <div className="window">
            <WindowBar title={title} onClose={onClose} />
            <div className="window-content">
                {!url && (
                    <BuildInApp title={title} />
                )}
                {url && (
                    <ExtApp url={url} />
                )}
            </div>
        </div>
    )
}

export default Window;
