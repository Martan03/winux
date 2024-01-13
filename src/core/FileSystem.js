import { useState } from "react";

const useFs = () => {
    const build = () => {
        const root = {name: 'root', children: {}, parent: null};
        const usr = {name: 'usr', children: {}, parent: root};

        const bin = {name: 'bin', children: {}, parent: usr};
        const clear = {name: 'clear', type: 'exe', value: 'clear', parent: bin};
        const ls = {name: 'ls', type: 'exe', value: 'ls', parent: bin};
        const mkdir = {name: 'mkdir', type: 'exe', value: 'mkdir', parent: bin};
        bin.children.clear = clear;
        bin.children.ls = ls;
        bin.children.mkdir = mkdir;

        usr.children.bin = bin;
        root.children.usr = usr;

        return root;
    }

    const [root, setRoot] = useState(build());

    /// Adds child item to the parent
    const add = (parent, child) => {
        if (parent.children[child.name])
            return false;

        child.parent = parent;
        parent.children[child.name] = child;
        setRoot(prev => ({...prev}));

        return true;
    }

    const addChildren = (parent, children) => {
        for (const child in children)
            add(parent, children[child]);
    }

    /// Returns directory based on given path
    const changeDir = (dir, path) => {
        const newPath = path.split('/').filter(part => part !== '');

        let current = dir;
        if (path.startsWith('/'))
            current = root;

        for (const part of newPath) {
            if (part === '..') {
                current = current.parent;
                continue;
            }

            current = get(current, part);
            if (!current || !current.children)
                return null;
        }

        return current;
    }

    /// Finds directory by given path from root directory
    const find = (path) => {
        const newPath = path.split('/').filter(part => part !== '');

        let current = root;
        for (const part of newPath) {
            current = get(current, part);
            if (!current?.children)
                return null;
        }

        return current;
    }

    /// Gets parent child based on given name
    const get = (parent, name) => {
        if (!parent?.children[name])
            return null;
        return parent.children[name];
    }

    /// Gets path of given item
    const getPath = (item) => {
        if (!item.parent)
            return '/';

        let path = '';
        let current = item;
        while (current.parent) {
            path = `/${current.name}${path}`;
            current = current.parent;
        }

        return path;
    }

    /// Creates file and adds it to given parent
    const createFile = (name, content = '', type = 'txt') => {
        const file = {name, content, type};
        return add(parent, file);
    }

    /// Creates directory and adds it to given parent
    const createDir = (parent, name) => {
        const dir = {name, children: {}, parent: null};
        return add(parent, dir);
    }

    /// Removes child by its name from given directory
    const remove = (parent, name) => {
        if (parent.children[name])
            return false;

        delete parent.children[name];
        setRoot(prev => ({...prev}));

        return true;
    }

    return {
        root, add, changeDir, find, get, getPath,
        createFile, createDir, remove,
    }
}

export default useFs;
