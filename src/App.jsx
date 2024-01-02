import { useState } from 'react'
import './css/App.css'
import Grid from './components/Grid';
import Window from './components/Window';

function App() {
    const icons = [
        {
            path: "/icons/profile-pic.jpg",
            title: "My Portfolio",
        },
    ];

    const onClose = () => {
        console.log('test');
    }

    return (
        <>
            <Grid icons={icons} />
            <Window title="Terminal" onClose={onClose} />
        </>
    )
}

export default App
