import { getFavourites, getPrograms } from '../apps/Apps';
import Arrow from '../assets/arrow.svg';

function Item({text, icon, onClick, iconSm, children}) {
    return (
        <div className="start-menu-item" onClick={onClick}>
            <img
                className={`icon${iconSm ? ' sm': ''}`}
                src={'./icons/' + icon}
            />
            <p>{text}</p>
            {children ? <>
                <img className='menu-arrow' src={Arrow}/>
                {children}
            </> : ''}
        </div>
    )
}

function ItemSm({item, addWindow, iconSm, children}) {
    return (
        <div className="start-menu-item sm" onClick={() => addWindow(item)}>
            <img
                className={`icon${iconSm ? ' sm': ''}`}
                src={item.icon}
            />
            <p>{item.title}</p>
            {children ? <>
                <img className='menu-arrow' src={Arrow}/>
                {children}
            </> : ''}
        </div>
    )
}

function StartMenu({startVis, setStartVis, addWindow, setDialog}) {
    if (!startVis)
        return;

    const programs = getPrograms();
    const favs = getFavourites();

    const openWindow = (app) => {
        setStartVis(false);
        addWindow(app);
    }

    const onShutdown = () => {
        setStartVis(false);
        setDialog('shutdown');
    }

    return (
        <div className='start-wrapper' onClick={() => setStartVis(false)}>
            <div className="start-menu" onClick={e => e.stopPropagation()}>
                <div className="start-menu-header">
                    <p>Winux98</p>
                </div>
                <div className="start-menu-content">
                    <Item text="Programs" icon="programs.png" iconSm>
                        <div className='start-menu-item-submenu'>
                            {programs.map((item, key) => (
                                <ItemSm
                                    key={key}
                                    item={item}
                                    addWindow={openWindow}
                                />
                            ))}
                        </div>
                    </Item>
                    <Item text="Favourites" icon="favourites.png" iconSm>
                        <div className="start-menu-item-submenu">
                            {favs.map((item, key) => (
                                <ItemSm
                                    key={key}
                                    item={item}
                                    addWindow={openWindow}
                                />
                            ))}
                        </div>
                    </Item>
                    <Item text="Documents" icon="documents.png" iconSm />
                    <Item text="Settings" icon="settings.png" />
                    <Item text="Find" icon="search.png" />
                    <Item text="Help" icon="help.png" iconSm />
                    <Item text="Run..." icon="run.png" iconSm />
                    <div className="start-menu-sep"></div>
                    <Item text="Log Off..." icon="logout.png" />
                    <Item
                        text="Shut Down..."
                        icon="shutdown.png"
                        onClick={onShutdown}
                    />
                </div>
            </div>
        </div>
    )
}

export default StartMenu;
