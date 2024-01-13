import { useEffect, useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';
import TaskBar from './components/TaskBar';
import StartMenu from './components/StartMenu';
import { FileSystem } from './core/FileSystem';

function App() {
    const [fs, setFs] = useState(new FileSystem());

    useEffect(() => {
        console.log(fs);
    }, [fs])

    const test = useFs();

    const [startVis, setStartVis] = useState(false);

    const [windows, setWindows] = useState([]);
    const [focus, setFocus] = useState(-1);
    const [lastId, setLastId] = useState(1);
    const apps = getDesktopApps();

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
            <Grid apps={apps} open={addWindow} fs={fs} />
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
                    setFs={setFs}
                />
            ))}
        </>
    )
}

export default App
