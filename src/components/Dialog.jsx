export function WindowDialog({title, onClose, children}) {
    return (
        <div className="dialog">
            <div className="window">
                <div className="window-bar focus">
                    <div>
                        <p>{title}</p>
                    </div>
                    <div>
                        <button className="btn" onClick={onClose}>X</button>
                    </div>
                </div>
                <div className="window-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function ShutdownDialog({onClose}) {
    return (
        <WindowDialog title="Shutting Down Winux" onClose={onClose}>
            <div className="shutdown">
                <img src="./icons/shutdown.png" alt="shutdown" />
                <div>
                    <p>What do you want the computer to do?</p>
                </div>
            </div>
        </WindowDialog>
    )
}

export function Dialog({dialog, setDialog}) {
    const onClose = () => {
        setDialog(null);
    }

    if (dialog === 'shutdown') {
        return <ShutdownDialog onClose={onClose} />
    }
}
