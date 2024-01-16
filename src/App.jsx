import { useEffect, useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';
import TaskBar from './components/TaskBar';
import StartMenu from './components/StartMenu';
import useFs from './core/FileSystem';
import { Dialog } from './components/Dialog';

function App() {
    const fs = useFs();

    const [startVis, setStartVis] = useState(false);

    const [windows, setWindows] = useState([]);
    const [focus, setFocus] = useState(-1);
    const [lastId, setLastId] = useState(1);
    const apps = getDesktopApps();

    const [dialog, setDialog] = useState(null);

    const addWindow = (app) => {
        setFocus(windows.length);
        setWindows([
            ...windows,
            {
                id: lastId,
                minimized: false,
                pos: {
                    x: -1000, y: -1000
                },
                zIndex: lastId,
                app: app,
            }
        ]);
        setLastId(lastId + 1);
    }

    const editWindow = (id, win) => {
        var newWindows = [...windows];
        newWindows[id] = win;
        setWindows(newWindows);
    }

    return (
        <>
            <Grid apps={apps} open={addWindow} />
            <TaskBar
                windows={windows}
                setWindows={setWindows}
                focus={focus}
                setFocus={setFocus}
                startVis={startVis}
                setStartVis={setStartVis}
            />
            <StartMenu
                startVis={startVis}
                setStartVis={setStartVis}
                addWindow={addWindow}
                setDialog={setDialog}
            />
            {windows.map((win, key) => (
                <Window
                    key={win.id}
                    id={key}
                    win={win}
                    windows={windows}
                    setWindows={setWindows}
                    focus={focus}
                    setFocus={setFocus}
                    editWindow={editWindow}
                    fs={fs}
                />
            ))}

            <Dialog dialog={dialog} setDialog={setDialog} />
        </>
    )
}

export default App
