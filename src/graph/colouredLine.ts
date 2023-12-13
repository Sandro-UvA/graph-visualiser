import Line from "./line";
import Node from "./node";


class ColouredLine extends Line {
    protected _colour = "#ffffff";
    get colour() {
        return this._colour;
    }
    set colour(value: string) {
        this._colour = value;
    }
    constructor(start: Node, end: Node, colour: string) {
        super(start, end);
        this._colour = colour;
    }
}

export default ColouredLine;