import { FileSystem } from "./FileSystem";

export class Environment {
    constructor(fs) {
        this.fs = fs;
        this.bin = this.fs.find('/usr/bin');
    }
}
