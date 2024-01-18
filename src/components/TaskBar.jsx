import { useEffect, useState } from "react";

/// Renders start menu button
function StartButton({startVis, setStartVis}) {
    return (
        <button
            className={'taskbar-start-btn btn' + (startVis ? ' active' : '')}
            onClick={() => setStartVis(!startVis)}
        >
            <img src="./icons/start.png" alt="Start" />
        </button>
    )
}

/// Renders opened apps
function OpenedApps({wm}) {
    const onClick = (id) => {
        if (wm.windows[id].minimized)
            wm.unminimize(id);
        else
            wm.minimize(id);
    }

    return (
        <div className="taskbar-open-apps">
            {wm.windows.map((win, key) => (
                <div
                    key={key}
                    className={'btn' + (wm.focus === key ? ' focus' : '')}
                    onClick={() => onClick(key)}
                >
                    <img src={win.app.icon} />
                    <p>{win.app.name}</p>
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

function TaskBar({
    wm, startVis, setStartVis
}) {
    return (
        <div className="taskbar">
            <StartButton startVis={startVis} setStartVis={setStartVis} />
            <div className="taskbar-divider"></div>
            <OpenedApps wm={wm} />
            <div className="taskbar-divider"></div>
            <Tray />
        </div>
    )
}

export default TaskBar;
