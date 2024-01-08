class File {
    constructor(name, type, value) {
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

class FileSystem {
    constructor() {
        this.root = new Directory('/');
        this.current = this.root;
    }

    get(name) {
        return this.current.get(name);
    }

    changeDir(path) {
        if (path === '/') {
            this.current = this.root;
            return true;
        }

        const newPath = path.split('/').filter(part => part !== '');

        let current = this.root;
        for (const part of newPath) {
            current = current.get(part);
            if (!(child instanceof Directory))
                return false;
        }

        this.current = current;
        return true;
    }

    createFile(name, content = '', type = 'txt') {
        const file = new File(name, content, type);
        this.current.add(file);
    }

    createDir(name) {
        const dir = new Directory(name);
        this.current.add(dir);
    }

    remove(name) {
        this.current.remove(name);
    }
}
