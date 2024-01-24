import { getAppsFromDir } from '../core/Apps';
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

function ItemSm({item, wm, close, iconSm, children}) {
    const icon = item.Icon ?? item.icon ?? '';
    const name = item.Name ?? item.name ?? '';

    const open = () => {
        close();
        if (item.Exec) {
            wm.addFromFile(item);
        } else {
            wm.add(item);
        }
    }

    return (
        <div className="start-menu-item sm" onClick={open}>
            <img
                className={`icon${iconSm ? ' sm': ''}`}
                src={icon}
            />
            <p>{name}</p>
            {children ? <>
                <img className='menu-arrow' src={Arrow}/>
                {children}
            </> : ''}
        </div>
    )
}

/// Renders submenu with files from directory on given path
function FilesFromDir({wm, fs, path, close}) {
    const dir = fs.get(fs.root, path);
    const files = getAppsFromDir(dir);

    return (
        <div className='start-menu-item-submenu'>
            {files.map((item, key) => (
                <ItemSm
                    key={key}
                    item={item}
                    wm={wm}
                    close={close}
                />
            ))}
        </div>
    );
}

function StartMenu({startVis, setStartVis, setDialog, fs, wm}) {
    if (!startVis)
        return;

    const onShutdown = () => {
        setStartVis(false);
        setDialog('shutdown');
    }

    const openNotImplement = () => {
        setStartVis(false);
        setDialog('notImplement')
    }

    return (
        <div className='start-wrapper' onClick={() => setStartVis(false)}>
            <div className="start-menu" onClick={e => e.stopPropagation()}>
                <div className="start-menu-header">
                    <p>Winux98</p>
                </div>
                <div className="start-menu-content">
                    <Item text="Programs" icon="programs.png" iconSm>
                        <FilesFromDir
                            wm={wm} fs={fs} path='/usr/share/applications'
                            close={() => setStartVis(false)}
                        />
                    </Item>
                    <Item text="Favourites" icon="favourites.png" iconSm>
                        <FilesFromDir
                            wm={wm} fs={fs} path='/home/visitor/Favourites'
                            close={() => setStartVis(false)}
                        />
                    </Item>
                    <Item text="Documents" icon="documents.png" iconSm>
                        <FilesFromDir
                            wm={wm} fs={fs} path='/home/visitor/Documents'
                            close={() => setStartVis(false)}
                        />
                    </Item>
                    <Item text="Settings" icon="settings.png"
                          onClick={openNotImplement} />
                    <Item text="Find" icon="search.png"
                          onClick={openNotImplement} />
                    <Item text="Help" icon="help.png" iconSm
                          onClick={openNotImplement} />
                    <Item text="Run..." icon="run.png" iconSm
                          onClick={openNotImplement} />
                    <div className="start-menu-sep"></div>
                    <Item text="Log Off..." icon="logout.png"
                          onClick={openNotImplement} />
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
