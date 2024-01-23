import { useState } from "react";
import { getCommands } from "./Commands";
import { getBinApps, getDesktop, getPrograms } from "../core/Apps";

const useFs = () => {
    // Adds files and directories to the file system
    const build = () => {
        const root = {name: 'root', children: {}, parent: null};
        const usr = {name: 'usr', children: {}, parent: root};

        const bin = {name: 'bin', children: {}, parent: usr};
        bin.children = {
            ...getCommands(bin),
            ...getBinApps(bin),
        };

        const share = {name: 'share', children: {}, parent: usr};
        const apps = {name: 'applications', children: {}, parent: share};
        share.children = {applications: apps}
        apps.children = getPrograms(apps);

        const home = {name: 'home', children: {}, parent: root};
        root.children.home = home;
        const visitor = {name: 'visitor', children: {}, parent: home};
        home.children.visitor = visitor;
        const desktop = {
            name: 'Desktop', children: getDesktop(visitor), parent: visitor
        };
        visitor.children.Desktop = desktop;

        usr.children.bin = bin;
        usr.children.share = share;
        root.children.usr = usr;

        return root;
    }

    const [root, setRoot] = useState(build());

    /// Adds child item to the parent
    const add = (parent, child) => {
        child.parent = parent;
        parent.children[child.name] = child;
        setRoot(prev => ({...prev}));
    }

    /// Gets file or directory based on given path
    const get = (dir, path) => {
        const pathArr = path.split('/').filter(item => item !== '');

        let current = dir;
        if (path.startsWith('/'))
            current = root;

        for (const item of pathArr) {
            if (!current)
                break;

            if (item === '..')
                current = current.parent;
            else if (item === '~')
                current = current.children['home']?.children['visitor'];
            else if (item !== '.')
                current = current.children[item];
        }

        return current;
    }

    /// Gets file based on given path
    const getFile = (dir, path) => {
        const file = get(dir, path);
        if (file?.children)
            return null;

        return file;
    }

    /// Gets directory based on given path
    const getDir = (dir, path) => {
        const folder = get(dir, path);
        if (!folder?.children)
            return null;

        return folder;
    }

    /// Gets path of given item
    const getPath = (item, full = false) => {
        if (!item.parent)
            return '/';

        let path = '';
        let current = item;
        while (current.parent) {
            path = `/${current.name}${path}`;
            current = current.parent;
        }

        if (!full && path.startsWith('/home/visitor'))
            path = path.replace('/home/visitor', '~');

        return path;
    }

    /// Creates file and adds it to given parent
    const createFile = (parent, name, value = '', type = 'txt') => {
        const file = {name, value, type};
        return add(parent, file);
    }

    const saveToFile = (dir, path, value, type = 'txt') => {
        const index = path.lastIndexOf('/');
        const parentPath = path.substring(0, index);
        const name = path.substring(index + 1);
        const parent = get(dir, parentPath);

        if (!parent || name == '..')
            return false;

        parent.children[name] = {name, value, type, parent};
    }

    /// Creates directory and adds it to given parent
    const createDir = (parent, name) => {
        const dir = {name, children: {}, parent: null};
        return add(parent, dir);
    }

    /// Removes child by its name from given directory
    const remove = (parent, name) => {
        if (!parent.children[name])
            return false;

        delete parent.children[name];
        setRoot(prev => ({...prev}));

        return true;
    }

    /// Gets parent path from given path
    const getParentPath = (path) => path.slice(0, path.lastIndexOf('/'));

    return {
        root, add, get, getFile, getDir, getPath,
        createFile, saveToFile, createDir, remove,
    }
}

export default useFs;
