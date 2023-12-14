import Graph from "./graph/graph";
import "./graph.css";
import Node from "./graph/node/node";
import ColouredNode from "./graph/node/colouredNode";
import ColouredLine from "./graph/line/colouredLine";
import Line from "./graph/line/line";
import TextNode from "./graph/node/textNode";

interface Props {
    graph: Graph;
    ref: () => HTMLCanvasElement | undefined;
    canvas: HTMLCanvasElement | undefined;
}
function GraphRenderer(props: Props) {
    function draw() {
        requestAnimationFrame(draw);

        if (props.graph.nodes === null) return;
        if (props.graph.lines === null) return;

        if (props.canvas === undefined) return;

        const context = props.canvas.getContext("2d");

        if (context == null) return;

        context.clearRect(0, 0, props.canvas.width, props.canvas.height);

        props.graph.lines.forEach((line) => {
            if (line.start === null || line.end === null) return;
            context.beginPath();
            context.moveTo(line.start.x + 0.5, line.start.y + 0.5);
            context.lineTo(line.end.x + 0.5, line.end.y + 0.5);
            if ((line as ColouredLine).colour)
                context.strokeStyle = (line as ColouredLine).colour;
            else context.strokeStyle = "white";
            context.lineWidth = Line.LINE_WIDTH;
            context.stroke();
        });

        props.graph.nodes.forEach((node) => {
            context.beginPath();
            context.arc(node.x, node.y, Node.NODE_RADIUS, 0, 2 * Math.PI);

            if ((node as ColouredNode).colour)
                context.fillStyle = (node as ColouredNode).colour;
            else context.fillStyle = "white";

            context.fill();

            if ((node as TextNode).label) {
                const label = (node as TextNode).label;
                const text = context.measureText(label);

                context.font = "24px sans-serif";
                context.fillStyle = (node as TextNode).textColour;
                context.textBaseline = "middle";
                context.fillText(
                    (node as TextNode).label,
                    node.x - text.width / 2,
                    node.y
                );
            }
        });
    }

    requestAnimationFrame(draw);

    window.addEventListener("resize", resize);

    function resize() {
        if (props.canvas === undefined) return;
        props.canvas.width = window.innerWidth;
        props.canvas.height = window.innerHeight;
        props.canvas.style.width = window.innerWidth.toString();
        props.canvas.style.height = window.innerHeight.toString();
    }

    return (
        <div class="graph-container">
            <canvas
                ref={props.ref}
                class="graph-canvas"
                width={window.innerWidth}
                height={window.innerHeight}
                style={{
                    width: window.innerWidth.toString(),
                    height: window.innerHeight.toString(),
                }}
            />
        </div>
    );
}

export default GraphRenderer;
