import { useState } from "react";

const useWindowManager = () => {
    const [windows, setWindows] = useState([]);
    const [focus, setFocus] = useState(-1);
    const [lastId, setLastId] = useState(1);

    /// Adds new window
    const add = (app) => {
        // Centers window
        const x = Math.max((window.innerWidth - 720) / 2, 0);
        const y = Math.max((window.innerHeight - 500) / 2, 0);

        setFocus(windows.length);
        setWindows([
            ...windows,
            {
                id: lastId,
                minimized: false,
                pos: { x, y },
                zIndex: lastId,
                app: app,
            }
        ]);
        setLastId(lastId + 1);
    }

    /// Changes focus to given id
    const changeFocus = (id) => {
        if (id == focus)
            return;

        var win = [...windows];
        win[id].zIndex = win[focus] ? win[focus].zIndex + 1 : 1;
        setWindows(win);
        setFocus(id);
    }

    /// Minimizes window
    const minimize = (id) => {
        var updated = [...windows];
        updated[id].minimized = true;
        setWindows(updated);

        if (id !== focus)
            return;

        let max = -1;
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].minimized)
                continue;

            if (updated[max]?.zIndex ?? 0 < updated[i].zIndex) {
                max = i;
            }
        }
        setFocus(max);
    }

    const unminimize = (id) => {
        var updated = [...windows];
        updated[id].zIndex = updated[focus] ? updated[focus].zIndex + 1 : 1;
        updated[id].minimized = false;

        setWindows(updated);
        setFocus(id);
    }

    /// Closes window
    const close = (id) => {
        var updated = [...windows];
        updated.splice(id, 1);
        setWindows(updated);

        if (id !== focus || updated.length <= 0) {
            if (id < focus)
                setFocus(focus - 1);
            return;
        }

        let max = -1;
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].minimized)
                continue;

            if (updated[max]?.zIndex ?? 0 < updated[i].zIndex) {
                max = i;
            }
        }
        setFocus(max);
    }

    const move = (id, pos) => {
        var updated = [...windows];
        updated[id].pos = pos;
        setWindows(updated);
    }

    return {
        windows, setWindows, focus, setFocus, add,
        changeFocus, minimize, unminimize, close, move,
    }
}

export default useWindowManager;
