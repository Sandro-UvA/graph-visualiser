import ColouredNode from "./colouredNode";

class TextNode extends ColouredNode {
    protected _label: string;
    get label() {
        return this._label;
    }
    set label(value: string) {
        this._label = value;
    }

    protected _textColour: string;
    get textColour() {
        return this._textColour;
    }
    set textColour(value: string) {
        this._textColour = value;
    }

    constructor(
        x: number,
        y: number,
        colour: string,
        label: string,
        textColour: string
    ) {
        super(x, y, colour);

        this._label = label;
        this._textColour = textColour;
    }
}

export default TextNode;
