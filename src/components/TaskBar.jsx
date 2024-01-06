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
function OpenedApps({windows, setWindows, focus, setFocus}) {
    const onClick = (id) => {
        if (windows[id].minimized)
            maximize(id);
        else
            minimize(id);
    }

    const maximize = (id) => {
        var updated = [...windows];
        updated[id].zIndex = updated[focus] ? updated[focus].zIndex + 1 : 1;
        updated[id].minimized = false;

        setWindows(updated);
        setFocus(id);
    }

    const minimize = (id) => {
        var updated = [...windows];
        updated[id].minimized = true;
        setWindows(updated);

        if (id !== focus)
            return;

        let max = -1;
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].minimized)
                continue;

            if (updated[max]?.zIndex ?? 0 < updated[i].zIndex) {
                max = i;
            }
        }
        setFocus(max);
    }

    return (
        <div className="taskbar-open-apps">
            {windows.map((win, key) => (
                <div
                    key={key}
                    className={'btn' + (focus === key ? ' focus' : '')}
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

function TaskBar({windows, setWindows, focus, setFocus}) {
    return (
        <div className="taskbar">
            <StartButton />
            <div className="taskbar-divider"></div>
            <OpenedApps
                windows={windows}
                setWindows={setWindows}
                focus={focus}
                setFocus={setFocus}
            />
            <div className="taskbar-divider"></div>
            <Tray />
        </div>
    )
}

export default TaskBar;
