import { Setter } from "solid-js";
import ColouredNode from "../graph/colouredNode";
import Node from "../graph/node";
import Mode from "../mode";
import "./info.css";
import Line from "../graph/line";
import Graph from "../graph/graph";
import _ from "lodash";
import ColouredLine from "../graph/colouredLine";

interface Props {
    mode: Mode;
    nodes: Node[];
    lines: Line[];
    nodeIndex: number | null;
    lineIndex: number | null;
    setGraph: Setter<Graph>;
}

function Info(props: Props) {
    const showColourInput = () =>
        props.nodeIndex !== null || props.lineIndex !== null;

    const incomingColour = () => {
        if (props.nodeIndex !== null)
            return (props.nodes[props.nodeIndex] as ColouredNode).colour;
        if (props.lineIndex !== null)
            return (props.lines[props.lineIndex] as ColouredLine).colour;
        return undefined;
    };

    function colourChange(e: Event) {
        changeNodeColour(e);
        changeLineColour(e);
    }

    function changeNodeColour(e: Event) {
        if (props.nodeIndex === null) return;
        props.setGraph((prev) => {
            const output = _.clone(prev);
            (output.nodes[props.nodeIndex!] as ColouredNode).colour = (
                e.target as HTMLInputElement
            ).value;
            return output;
        });
    }

    function changeLineColour(e: Event) {
        if (props.lineIndex === null) return;
        props.setGraph((prev) => {
            const output = _.clone(prev);
            (output.lines[props.lineIndex!] as ColouredLine).colour = (
                e.target as HTMLInputElement
            ).value;
            return output;
        });
    }

    return (
        <div class={`info-container ${props.mode === Mode.Edit ? "edit" : ""}`}>
            <span>Mode: {props.mode}</span>
            <span>
                x:{" "}
                {props.nodeIndex !== null
                    ? props.nodes[props.nodeIndex].x
                    : "No info"}
            </span>
            <span>
                y:{" "}
                {props.nodeIndex !== null
                    ? props.nodes[props.nodeIndex].y
                    : "No info"}
            </span>
            <span class="colour">
                <input
                    type="color"
                    class={`element-colour-input ${
                        showColourInput() !== false ? "element-selected" : ""
                    }`}
                    name="element-colour-input"
                    onChange={colourChange}
                    value={
                        showColourInput() !== null &&
                        incomingColour() !== undefined
                            ? incomingColour()
                            : "#ffffff"
                    }
                />
            </span>
        </div>
    );
}

export default Info;
