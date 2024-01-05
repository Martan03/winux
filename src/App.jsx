import { useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';
import TaskBar from './components/TaskBar';

function App() {
    const [windows, setWindows] = useState([]);
    const [lastId, setLastId] = useState(1);
    const apps = getDesktopApps();

    const defocusWindows = () => {
        var win = [...windows];
        win = win.map(item => ({...item, focus: false}));
        return win;
    }

    const addWindow = (key) => {
        const win = defocusWindows();
        setWindows([
            ...win,
            {
                id: lastId,
                focus: true,
                minimized: false,
                pos: {
                    x: -1000, y: -1000
                },
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
            <TaskBar windows={windows} />
            {windows.map((win, key) => (
                <Window
                    key={win.id}
                    id={key}
                    win={win}
                    windows={windows}
                    setWindows={setWindows}
                    editWindow={editWindow}
                />
            ))}
        </>
    )
}

export default App
