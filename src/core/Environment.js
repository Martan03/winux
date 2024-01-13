export class Environment {
    constructor(fs) {
        this.fs = fs;
        this.current = fs.root;
        this.bin = this.fs.find('/usr/bin');
    }
}
