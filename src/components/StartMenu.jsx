function Item({text, icon, iconSm}) {
    return (
        <div className="start-menu-item">
            <img className={iconSm ? 'sm' : ''} src={'/icons/' + icon} />
            <p>{text}</p>
        </div>
    )
}

function StartMenu({startVis, setStartVis}) {
    if (!startVis)
        return;

    return (
        <div className="start-menu">
            <div className="start-menu-header">
                <p>Winux98</p>
            </div>
            <div className="start-menu-content">
                <Item text="Programs" icon="programs.png" iconSm />
                <Item text="Favourites" icon="favourites.png" iconSm />
                <Item text="Documents" icon="documents.png" iconSm />
                <Item text="Settings" icon="settings.png" />
                <Item text="Find" icon="search.png" />
                <Item text="Help" icon="help.png" iconSm />
                <Item text="Run..." icon="run.png" iconSm />
                <div className="start-menu-sep"></div>
                <Item text="Log Off..." icon="logout.png" />
                <Item text="Shut Down..." icon="shutdown.png" />
            </div>
        </div>
    )
}

export default StartMenu;
