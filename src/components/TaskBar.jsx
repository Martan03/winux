import { useEffect, useState } from "react";

/// Renders start menu button
function StartButton() {
    return (
        <button className="taskbar-start-btn btn">
            <img src="/icons/start.png" alt="Start" />
        </button>
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

function TaskBar() {
    return (
        <div className="taskbar">
            <StartButton />
            <div className="taskbar-divider"></div>
            <div className="taskbar-spacer"></div>
            <div className="taskbar-divider"></div>
            <Tray />
        </div>
    )
}

export default TaskBar;
