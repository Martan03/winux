import { useState } from "react";
import { getCommands } from "./Commands";
import { getBinApps } from "../apps/Apps";

const useFs = () => {
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

        const home = {name: 'home', children: {}, parent: root};
        root.children.home = home;
        const visitor = {name: 'visitor', children: {}, parent: home};
        home.children.visitor = visitor;

        usr.children.bin = bin;
        usr.children.share = share;
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

            current = current?.children[part];
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
            current = current?.children[part];
            if (!current || !current?.children)
                return null;
        }

        return current;
    }

    /// Gets file based on given path
    const get = (dir, path) => {
        const newPath = path.split('/').filter(part => part !== '');

        let current = dir;
        if (path.startsWith('/'))
            current = root;

        for (let i = 0; i < newPath.length - 1; i++) {
            if (newPath[i] === '..') {
                current = current.parent;
                continue;
            }

            current = current?.children[newPath[i]];
            if (!current || !current.children)
                return null;
        }

        return current?.children[newPath[newPath.length - 1]];
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

        if (path.startsWith('/home/visitor'))
            path = path.replace('/home/visitor', '~');

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
