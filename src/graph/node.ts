class Node {
    protected _x: number = 0;
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }

    protected _y: number = 0;
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }

    static NODE_RADIUS = 20;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default Node;