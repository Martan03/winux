import { useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';
import TaskBar from './components/TaskBar';

function App() {
    const [windows, setWindows] = useState([]);
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
                id: win.length,
                focus: true,
                pos: {
                    x: -1000, y: -1000
                },
                app: apps[key],
            }
        ]);
    }

    const editWindow = (id, win) => {
        var newWindows = [...windows];
        newWindows[id] = win;
        setWindows(newWindows);
    }

    const moveUp = (id) => {
        var win = defocusWindows();
        const active = win.splice(id, 1);
        setWindows([
            ...win,
            {
                ...active[0],
                focus: true,
            }
        ]);
    }

    const onClose = (id) => {
        var win = [...windows];
        const removed = win.splice(id, 1)[0];
        setWindows(win);
    }

    return (
        <>
            <Grid apps={apps} open={addWindow} />
            <TaskBar />
            {windows.map((win, key) => (
                <Window
                    key={win.id}
                    id={key}
                    win={win}
                    editWindow={editWindow}
                    onClose={onClose}
                    onActive={moveUp}
                />
            ))}
        </>
    )
}

export default App
