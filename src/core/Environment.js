import { FileSystem } from "./FileSystem";

export class Environment {
    constructor() {
        this.fs = new FileSystem();
        this.bin = this.fs.find('/usr/bin');
    }
}
