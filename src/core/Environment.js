export class Environment {
    constructor(fs) {
        this.fs = fs;
        this.current = this.fs.find('/home/visitor') ?? fs.root;
        this.bin = this.fs.find('/usr/bin');
    }
}
