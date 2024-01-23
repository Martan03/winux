export class Environment {
    constructor(fs, setView) {
        this.fs = fs;
        this.current = this.fs.getDir(fs.root, '/home/visitor') ?? fs.root;
        this.bin = this.fs.getDir(fs.root, '/usr/bin');

        this.print = (val) => setView(prev => [...prev, val]);
        this.error = (val) => setView(prev => [...prev, val]);
        this.clear = () => setView([]);
    }

    get = (path) => this.fs.get(this.current, path);

    getFile = (path) => this.fs.getFile(this.current, path);

    getDir = (path) => this.fs.getDir(this.current, path);

    createFile = (path) => this.fs.createFile(this.current, path);

    createDir = (path) => this.fs.createDir(this.current, path);

    getPath = (full = true) => this.fs.getPath(this.current, full);
}
