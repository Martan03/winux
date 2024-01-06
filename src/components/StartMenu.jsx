function StartMenu() {
    return (
        <div className="start-menu">
            <div className="start-menu-header">
                <p>Winux98</p>
            </div>
            <div className="start-menu-content">
                <div className="start-menu-item">
                    <img src="/icons/logout.png" />
                    <p>Log Off...</p>
                </div>
                <div className="start-menu-item">
                    <img src="/icons/shutdown.png" />
                    <p>Shut Down...</p>
                </div>
            </div>
        </div>
    )
}

export default StartMenu;
