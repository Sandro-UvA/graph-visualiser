import Graph from "./graph/graph";
import "./graph.css";

interface Props {
    graph: Graph;
}

function GraphRenderer(props: Props) {
    console.log("RENDERING NEW GRAPH");

    return (
        <div class="graph-container">
            {props.graph.lines?.map((line) => {
                if (line == null) return;
                const deltaX = line.start!.x - line.end!.x;
                const deltaY = line.start!.y - line.end!.y;
                const distance = Math.sqrt(
                    Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
                );
                const angle = Math.atan(deltaY / deltaX) * (180 / Math.PI);
                const originNode = deltaY >= 0 ? line.end! : line.start!;
                const origin =
                    originNode.x === Math.max(line.start!.x, line.end!.x)
                        ? originNode.y === Math.max(line.start!.y, line.end!.y)
                            ? "left"
                            : "right"
                        : "left";
                return (
                    <div
                        class="line"
                        style={{
                            left: `${
                                Math.min(line.start!.x, line.end!.x) -
                                (origin === "right"
                                    ? deltaX >= 0
                                        ? distance - deltaX
                                        : distance + deltaX
                                    : 0)
                            }px`,
                            top: `${Math.min(line.start!.y, line.end!.y)}px`,
                            width: `${distance}px`,
                            rotate: `${angle}deg`,
                            "transform-origin": origin,
                        }}
                    />
                );
            })}
            {props.graph.nodes?.map((node) => {
                return (
                    <div
                        class="node"
                        style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    />
                );
            })}
        </div>
    );
}

export default GraphRenderer;
