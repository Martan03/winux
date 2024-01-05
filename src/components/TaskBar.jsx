import { useEffect, useState } from "react";

/// Renders start menu button
function StartButton() {
    return (
        <button className="taskbar-start-btn btn">
            <img src="/icons/start.png" alt="Start" />
        </button>
    )
}

/// Renders opened apps
function OpenedApps({windows, setWindows}) {
    const onClick = (id) => {
        if (windows[id].minimized)
            maximize(id);
        else
            minimize(id);
    }

    const maximize = (id) => {
        var updated = [...windows];
        updated[updated.length - 1].focus = false;
        updated.splice(id, 1);

        setWindows([
            ...updated,
            {
                ...windows[id],
                focus: true,
                minimized: false,
            }
        ]);
    }

    const minimize = (id) => {
        var updated = [...windows];
        updated[id].minimized = true;
        if (windows[id].focus) {
            for (let i = updated.length - 2; i >= 0; i--) {
                if (!updated[i].minimized) {
                    [updated[id], updated[i]] = [
                        {
                            ...updated[i],
                            focus: true,
                        }, {
                            ...updated[id],
                            focus: false,
                        }
                    ];
                }
            }
        }

        setWindows(updated);
    }

    return (
        <div className="taskbar-open-apps">
            {windows.map((win, key) => (
                <div
                    key={key}
                    className={'btn' + (win.focus ? ' focus' : '')}
                    onClick={() => onClick(key)}
                >
                    <img src={win.app.icon} />
                    <p>{win.app.title}</p>
                </div>
            ))}
        </div>
    )
}

/// Renders taskbar tray
function Tray() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const now = new Date();
        const toNextMinute = (60 - now.getSeconds()) * 1000;

        var interval = null;
        setTimeout(() => {
            setTime(new Date());

            interval = setInterval(() => {
                setTime(new Date());
            }, 60000);
        }, toNextMinute);

        return () => {
            if (interval)
                clearInterval(interval)
        };
    }, []);

    const formattedTime = time.toLocaleTimeString(
        [], {hour: '2-digit', minute: '2-digit'}
    );

    return (
        <div className="taskbar-tray">
            <p>{formattedTime}</p>
        </div>
    )
}

function TaskBar({windows, setWindows}) {
    return (
        <div className="taskbar">
            <StartButton />
            <div className="taskbar-divider"></div>
            <OpenedApps windows={windows} setWindows={setWindows} />
            <div className="taskbar-divider"></div>
            <Tray />
        </div>
    )
}

export default TaskBar;
