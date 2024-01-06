import { useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';
import TaskBar from './components/TaskBar';

function App() {
    const [windows, setWindows] = useState([]);
    const [focus, setFocus] = useState(-1);
    const [lastId, setLastId] = useState(1);
    const apps = getDesktopApps();

    const addWindow = (key) => {
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
                app: apps[key],
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
                />
            ))}
        </>
    )
}

export default App
