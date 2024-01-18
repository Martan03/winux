import { useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';
import { getDesktopApps } from './core/Apps';
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
            <Grid fs={fs} wm={wm} />
            <TaskBar wm={wm} startVis={startVis} setStartVis={setStartVis} />
            <StartMenu
                startVis={startVis}
                setStartVis={setStartVis}
                addWindow={wm.add}
                setDialog={setDialog}
                fs={fs}
                wm={wm}
            />
            {wm.windows.map((win, key) => (
                <Window key={win.id} id={key} win={win} fs={fs} wm={wm} />
            ))}

            <Dialog dialog={dialog} setDialog={setDialog} setOn={setOn} />
        </>
    )
}

export default App
