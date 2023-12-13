import Node from "./node";

class ColouredNode extends Node {
    protected _colour = "#ffffff";
    get colour() {
        return this._colour;
    }
    set colour(value: string) {
        this._colour = value;
    }

    constructor(x: number, y: number, colour: string) {
        super(x, y)
        this._colour = colour;
    }
}

export default ColouredNode;