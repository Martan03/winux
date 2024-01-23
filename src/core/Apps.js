import Notepad from "../apps/Notepad";
import Terminal from "../apps/Terminal";

export function getPrograms(parent) {
    return {
        'terminal.desktop': {
            name: 'terminal.desktop', type: 'desktop', parent,
            value: getDesktopFile(
                'Terminal', '/usr/bin/terminal', './icons/cmd.png',
            ),
        },
        'notepad.desktop': {
            name: 'notepad.desktop', type: 'desktop', parent,
            value: getDesktopFile(
                'Notepad', '/usr/bin/notepad', './icons/notepad.png',
            ),
        }
    }
}

export function getFavourites(parent) {
    return {
        'My Portfolio': {
            name: 'My Portfolio',
            type: 'app',
            icon: './icons/internet-explorer.png',
            url: 'https://martan03.github.io',
            parent,
        },
    };
}

export function getBinApps(parent) {
    return {
        notepad: {
            name: 'notepad', type: 'app', parent, value: Notepad.toString(),
        },
        terminal: {
            name: 'terminal', type: 'app', parent, value: Terminal.toString(),
        }
    }
}

function getDesktopFile(name, exe, icon) {
    return `[Desktop Entry]
Name=${name}
Exec=${exe}
Icon=${icon}`;
}

export function getDesktop(parent) {
    return {
        'My Portfolio': {
            name: 'My Portfolio',
            type: 'app',
            icon: './icons/internet-explorer.png',
            url: 'https://martan03.github.io',
            parent,
        },
        'terminal.desktop': {
            name: 'terminal.desktop', type: 'desktop', parent,
            value: getDesktopFile(
                'Terminal', '/usr/bin/terminal', './icons/cmd.png',
            ),
        },
        'notepad.desktop': {
            name: 'notepad.desktop', type: 'desktop', parent,
            value: getDesktopFile(
                'Notepad', '/usr/bin/notepad', './icons/notepad.png',
            ),
        },
    }
}

function getDesktopInfo(content) {
    const lines = content.split('\n');
    const info = {};

    for (const line of lines) {
        const match = line.match(/^\s*([^=]+)\s*=\s*(.*)\s*$/);

        if (match) {
            info[match[1]] = match[2];
        }
    }

    return info;
}

export function getAppsFromDir(dir) {
    if (!dir)
        return [];

    const apps = [];
    for (const file in dir.children) {
        if (dir.children[file].type !== 'desktop') {
            if (dir.children[file].type === 'app')
                apps.push(dir.children[file]);
            continue;
        }

        apps.push(getDesktopInfo(dir.children[file].value));
    }

    return apps;
}
