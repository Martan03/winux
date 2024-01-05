import { useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';
import TaskBar from './components/TaskBar';

function App() {
    const [windows, setWindows] = useState([]);
    const apps = getDesktopApps();

    const addWindow = (key) => {
        setWindows([
            ...windows,
            apps[key],
        ]);
    }

    const moveUp = (id) => {
        var win = [...windows];
        const active = win.splice(id, 1);
        setWindows([
            ...win,
            ...active,
        ]);
    }

    const onClose = (id) => {
        var win = [...windows];
        win.splice(id, 1);
        setWindows(win);
    }

    return (
        <>
            <Grid apps={apps} open={addWindow} />
            <TaskBar />
            {windows.map((window, key) => (
                <Window
                    key={key}
                    id={key}
                    url={window.url}
                    title={window.title}
                    onClose={onClose}
                    onActive={moveUp}
                />
            ))}
        </>
    )
}

export default App
