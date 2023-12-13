import Node from "../node/node";

class Line {
    static LINE_WIDTH = 5;

    protected _start: Node;
    get start() {
        return this._start;
    }
    set start(value) {
        this._start = value;
    }

    protected _end: Node;
    get end() {
        return this._end;
    }
    set end(value) {
        this._end = value;
    }

    constructor(start: Node, end: Node) {
        this._start = start;
        this._end = end;
    }

    static areNeighbours(l1: Line, l2: Line) {
        return (
            l1.start === l2.start ||
            l1.end === l2.start ||
            l1.start === l2.end ||
            l1.end === l2.end
        );
    }

    static areEqual(l1: Line, l2: Line) {
        const equal =
            (l1.start.x === l2.start.x &&
                l1.start.y === l2.start.y &&
                l1.end.x === l2.end.x &&
                l1.end.y === l2.end.y) ||
            (l1.start.x === l2.end.x &&
                l1.start.y === l2.end.y &&
                l1.end.x === l2.start.x &&
                l1.end.y === l2.start.y);

        return equal;
    }
}

export default Line;
