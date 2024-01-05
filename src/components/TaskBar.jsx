/// Renders start menu button
function StartButton() {
    return (
        <button className="taskbar-start-btn btn">
            <img src="/icons/start.png" alt="Start" />
        </button>
    )
}

function TaskBar() {
    return (
        <div className="taskbar">
            <StartButton />
            <div className="taskbar-divider"></div>
        </div>
    )
}

export default TaskBar;
