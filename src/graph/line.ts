import Node from "./node";

class Line {
    private _start: Node | null = null;
    get start() {
        return this._start;
    }
    set start(value) {
        this._start = value;
    }

    private _end: Node | null = null;
    get end() {
        return this._end;
    }
    set end(value) {
        this._end = value;
    }

    constructor(start: Node, end: Node) {
        this.start = start;
        this.end = end;
    }
}

export default Line;