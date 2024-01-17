import { useEffect, useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './apps/Apps';
import TaskBar from './components/TaskBar';
import StartMenu from './components/StartMenu';
import useFs from './core/FileSystem';
import { Dialog } from './components/Dialog';
import useWindowManager from './core/WindowManager';

function App() {
    const [on, setOn] = useState(true);
    const [dialog, setDialog] = useState(null);

    const fs = useFs();
    const wm = useWindowManager();

    const [startVis, setStartVis] = useState(false);

    const apps = getDesktopApps();

    if (!on) {
        return <div className='turned-off'>how can I turn it on?</div>
    }

    return (
        <>
            <Grid apps={apps} open={wm.add} />
            <TaskBar
                windows={wm.windows}
                setWindows={wm.setWindows}
                focus={wm.focus}
                setFocus={wm.setFocus}
                startVis={startVis}
                setStartVis={setStartVis}
            />
            <StartMenu
                startVis={startVis}
                setStartVis={setStartVis}
                addWindow={wm.add}
                setDialog={setDialog}
            />
            {wm.windows.map((win, key) => (
                <Window
                    key={win.id}
                    id={key}
                    win={win}
                    windows={wm.windows}
                    setWindows={wm.setWindows}
                    focus={wm.focus}
                    setFocus={wm.setFocus}
                    fs={fs}
                    wm={wm}
                />
            ))}

            <Dialog dialog={dialog} setDialog={setDialog} setOn={setOn} />
        </>
    )
}

export default App
