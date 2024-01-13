import { useState } from "react";

class File {
    constructor(name, type, value, icon = null) {
        this.icon = icon;
        this.name = name;
        this.type = type;
        this.value = value;
        this.parent = null;
    }
}

class Directory {
    constructor(name) {
        this.name = name;
        this.children = {};
        this.parent = null;
    }

    add(child) {
        if (this.children[child.name])
            return false;

        child.parent = this;
        this.children[child.name] = child;
        return true;
    }

    remove(childName) {
        delete this.children[childName];
    }

    get(childName) {
        return this.children[childName];
    }

    getPath() {
        if (!this.parent)
            return '/';

        const path = this.parent.getPath();
        return path === '/' ? `/${this.name}` : `${path}/${this.name}`;
    }
}

export class FileSystem {
    constructor() {
        this.root = new Directory('/');
        this.current = this.root;
        this.build();
    }

    build() {
        const usr = new Directory('usr');
        const bin = new Directory('bin');

        const clear = new File('clear', 'exe', 'clear');
        bin.add(clear);
        const ls = new File('ls', 'exe', 'ls');
        bin.add(ls);
        const mkdir = new File('mkdir', 'exe', 'mkdir');
        bin.add(mkdir);
        usr.add(bin);

        const portfolio = new File(
            'My Porfolio', 'app', '', './icons/internet-explorer.png'
        );

        const home = new Directory('home');
        const visitor = new Directory('visitor');
        const desktop = new Directory('Desktop');

        desktop.add(portfolio);

        visitor.add(desktop);
        home.add(visitor);

        this.root.add(home);
        this.root.add(usr);
    }

    get(name) {
        return this.current.get(name);
    }

    changeDir(path) {
        const newPath = path.split('/').filter(part => part !== '');

        let current = this.current;
        if (path.startsWith('/'))
            current = this.root;

        for (const part of newPath) {
            if (part == '..') {
                if (current.parent)
                    current = current.parent;
                continue;
            }
            current = current.get(part);

            if (!(current instanceof Directory))
                return false;
        }

        this.current = current;
        return true;
    }

    createFile(name, content = '', type = 'txt') {
        const file = new File(name, content, type);
        return this.current.add(file);
    }

    createDir(name) {
        const dir = new Directory(name);
        return this.current.add(dir);
    }

    remove(name) {
        this.current.remove(name);
    }

    find(path) {
        const newPath = path.split('/').filter(part => part !== '');

        let current = this.root;
        for (const part of newPath) {
            current = current.get(part);
            if (!(current instanceof Directory))
                return null;
        }

        return current;
    }
}

const useFs = () => {
    const [root, setRoot] = useState({
        name: 'root',
        children: {},
        parent: null
    });

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

            current = get(current, part);
            if (!current.children)
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
            if (!current.children)
                return null;
        }

        return current;
    }

    /// Gets parent child based on given name
    const get = (parent, name) => {
        return parent.children[name];
    }

    /// Gets path of given item
    const getPath = (item) => {
        if (!item.parent)
            return '/';

        let path = '';
        let current = item;
        while (current) {
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
        root, add, changeDir, find, get, getPath, createFile, createDir, remove
    }
}

export default useFs;
