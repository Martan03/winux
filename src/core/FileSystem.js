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
