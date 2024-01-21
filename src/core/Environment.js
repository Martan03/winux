export class Environment {
    constructor(fs, setView) {
        this.fs = fs;
        this.current = this.fs.find('/home/visitor') ?? fs.root;
        this.bin = this.fs.find('/usr/bin');

        this.print = (val) => setView(prev => [...prev, val]);
        this.error = (val) => setView(prev => [...prev, val]);
        this.clear = () => setView([]);
    }
}
