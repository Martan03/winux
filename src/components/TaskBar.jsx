/// Renders start menu button
function StartButton() {
    return (
        <button className="taskbar-start-btn btn">
            Start
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
