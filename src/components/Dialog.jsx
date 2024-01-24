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

export function ShutdownDialog({onClose, setOn}) {
    const onShutdown = () => {
        setOn(false);
    }

    return (
        <WindowDialog title="Shutting Down Winux" onClose={onClose}>
            <div className="shutdown">
                <img src="./icons/shutdown.png" alt="shutdown" />
                <div>
                    <p>Do you want to turn off the computer?</p>
                    <div className="buttons">
                        <button className="btn" onClick={onShutdown}>
                            OK
                        </button>
                        <button className="btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </WindowDialog>
    )
}

function NotImplementDialog({onClose}) {
    return (
        <WindowDialog title="Not implemented..." onClose={onClose}>
            <div className="shutdown">
                <img src="./icons/error.png" alt="error" />
                <div>
                    <p>I'm sorry, but this isn't implemented yet</p>
                </div>
            </div>
        </WindowDialog>
    )
}

export function Dialog({dialog, setDialog, setOn}) {
    const onClose = () => {
        setDialog(null);
    }

    switch (dialog) {
        case 'shutdown':
            return <ShutdownDialog onClose={onClose} setOn={setOn} />
        case 'notImplement':
            return <NotImplementDialog onClose={onClose} />
        default:
            return <></>;
    }
}
