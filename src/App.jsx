import { useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';

function App() {
    const [windows, setWindows] = useState([]);
    const apps = getDesktopApps();

    const addWindow = (key) => {
        setWindows([
            ...windows,
            apps[key],
        ]);
    }

    const onClose = () => {
        console.log('test');
    }

    return (
        <>
            <Grid apps={apps} open={addWindow} />
            {windows.map((window, key) => (
                <Window
                    key={key}
                    id={key}
                    title={window.title}
                    onClose={onClose}
                />
            ))}
        </>
    )
}

export default App
