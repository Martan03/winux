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

export function Dialog({dialog, setDialog, setOn}) {
    const onClose = () => {
        setDialog(null);
    }

    if (dialog === 'shutdown') {
        return <ShutdownDialog onClose={onClose} setOn={setOn} />
    }

    return <></>
}
