import { createSignal, onMount } from "solid-js";
import "./App.css";
import Graph from "./graph/graph";
import Node from "./graph/node/node";
import Line from "./graph/line/line";
import GraphRenderer from "./graphRenderer";
import Info from "./menu/info";
import Mode from "./mode";
import _ from "lodash";
import ColouredLine from "./graph/line/colouredLine";

function App() {
    const [canvas, setCanvas] = createSignal<HTMLCanvasElement | undefined>();

    const [graph, setGraph] = createSignal<Graph>(new Graph([], []));

    const nodes = () => graph().nodes;

    const lines = () => graph().lines;

    const [mode, setMode] = createSignal(Mode.Normal);

    let [selectedNodeIndex, setSelectedNodeIndex] = createSignal<number | null>(
        null
    );
    let [selectedLineIndex, setSelectedLineIndex] = createSignal<number | null>(
        null
    );
    let lineStart: Node | null = null;

    onMount(() => {
        if (canvas()! === undefined) return;

        canvas()!.addEventListener("mousedown", mouseDown);
        canvas()!.addEventListener("mouseup", mouseUp);
        document.addEventListener("keydown", keyDown);
    });

    function mouseDown(e: MouseEvent) {
        if (canvas()! === undefined) return;

        switch (mode()) {
            case Mode.Normal:
                setSelectedNodeIndex(getClosestNode(e));

                if (selectedNodeIndex() === null) return;

                canvas()!.addEventListener("mousemove", moveNode);
                break;
            case Mode.Node:
                addNode(e.clientX, e.clientY);

                setSelectedNodeIndex(nodes().length - 1);

                canvas()!.addEventListener("mousemove", moveNode);
                break;
            case Mode.Line:
                const closestNodeIndex = getClosestNode(e);
                if (closestNodeIndex === null) return;

                lineStart = nodes()[closestNodeIndex];

                setGraph((prev) => {
                    const output = _.clone(prev);
                    output.lines = [
                        ...output.lines,
                        new Line(lineStart!, new Node(e.clientX, e.clientY)),
                    ];
                    return output;
                });

                canvas()!.addEventListener("mousemove", moveLine);
                break;
            case Mode.Delete:
                canvas()!.addEventListener("mousemove", deleteElements);
                break;
            case Mode.Edit:
                setSelectedLineIndex(null);
                setSelectedNodeIndex(null);
                setSelectedNodeIndex(getClosestNode(e));
                if (selectedNodeIndex() !== null) break;
                setSelectedLineIndex(getClosestLine(e));

                break;
        }
    }

    function mouseUp() {
        if (canvas()! === undefined) return;
        switch (mode()) {
            case Mode.Normal:
            case Mode.Node:
                setSelectedNodeIndex(null);
                canvas()!.removeEventListener("mousemove", moveNode);
                break;
            case Mode.Line:
                canvas()!.removeEventListener("mousemove", moveLine);
                if (lineStart === null) return;

                // If distance from lineEnd to existing point < Node.NODE_RADIUS, create the line
                // Smallest distance from lineEnd to existing point
                const lineEnd = lines()[lines().length - 1].end;

                setGraph((prev) => {
                    const output = _.clone(prev);
                    output.lines = output.lines.slice(0, -1);
                    return output;
                });

                const closestNode = nodes().reduce((acc, curr) => {
                    if (
                        nodeToNodeSquared(curr, lineEnd) <
                        nodeToNodeSquared(acc, lineEnd)
                    )
                        return curr;
                    return acc;
                });

                const newLine = new ColouredLine(
                    lineStart,
                    closestNode,
                    "#ff0000"
                );

                if (
                    nodeToNodeSquared(lineEnd, closestNode) <
                        Node.NODE_RADIUS ** 2 &&
                    isExistingLine(newLine) === false
                ) {
                    setGraph((prev) => {
                        const output = _.clone(prev);
                        output.lines.push(newLine);
                        return output;
                    });
                }

                lineStart = null;
                setSelectedLineIndex(null);
                break;
            case Mode.Delete:
                canvas()!.removeEventListener("mousemove", deleteElements);
                prevX = null;
                prevY = null;
                break;
        }
    }

    function keyDown(e: KeyboardEvent) {
        lineStart = null;
        switch (e.key) {
            case "n":
                setMode(Mode.Normal);
                setSelectedNodeIndex(null);
                setSelectedLineIndex(null);
                break;
            case "i":
                setMode(Mode.Node);
                setSelectedNodeIndex(null);

                setSelectedLineIndex(null);
                break;
            case "l":
                setMode(Mode.Line);
                setSelectedNodeIndex(null);
                setSelectedLineIndex(null);
                break;
            case "d":
                setMode(Mode.Delete);
                setSelectedNodeIndex(null);
                setSelectedLineIndex(null);
                break;
            case "e":
                setMode(Mode.Edit);
                setSelectedNodeIndex(null);
                setSelectedLineIndex(null);
                break;
            case "g":
                setGraph((prev) => {
                    const output = _.clone(prev).toLinegraph();
                    return output;
                });

                break;
        }
    }

    function moveNode(e: MouseEvent) {
        const x = e.clientX;
        const y = e.clientY;

        updateNode(x, y);
    }

    function updateNode(x: number, y: number) {
        setGraph((prev) => {
            if (selectedNodeIndex() === null) return prev;

            const output = _.clone(prev);
            output.nodes[selectedNodeIndex()!].x = x;
            output.nodes[selectedNodeIndex()!].y = y;

            return output;
        });
    }

    function getClosestNode(e: MouseEvent) {
        if (nodes().length === 0) return null;

        const x = e.clientX;
        const y = e.clientY;

        const closestNode = nodes().reduce((acc, curr) => {
            if (nodeToPointSquared(curr, x, y) < nodeToPointSquared(acc, x, y))
                return curr;
            return acc;
        });

        if (nodeToPointSquared(closestNode, x, y) < Node.NODE_RADIUS ** 2)
            return nodes().indexOf(closestNode);

        return null;
    }

    function getClosestLine(e: MouseEvent) {
        if (lines().length === 0) return null;

        const x = e.clientX;
        const y = e.clientY;

        const closestLine = lines().filter((line) =>
            pointOnLineSegment(line, x, y)
        );
        return closestLine[0] === undefined
            ? null
            : lines().indexOf(closestLine[0]);
    }

    function pointOnLineSegment(line: Line, x: number, y: number) {
        const slope = (line.start.y - line.end.y) / (line.start.x - line.end.x);
        // Vertical line
        if (Number.isFinite(slope) === false) {
            console.log("VERTICAL LINE");

            return (
                Math.min(line.start.y, line.end.y) <= y &&
                y <= Math.max(line.start.y, line.end.y) &&
                2 * Math.abs(line.start.x - x) <= Line.LINE_WIDTH
            );
        }
        const yAxisIntersect = line.start.y - slope * line.start.x;
        return 2 * Math.abs(slope * x + yAxisIntersect - y) <= Line.LINE_WIDTH;
    }

    function nodeToNodeSquared(node1: Node, node2: Node) {
        return distanceSquared(node1.x, node1.y, node2.x, node2.y);
    }

    function nodeToPointSquared(node: Node, x: number, y: number) {
        return distanceSquared(node.x, node.y, x, y);
    }

    function distanceSquared(x1: number, y1: number, x2: number, y2: number) {
        return (x1 - x2) ** 2 + (y1 - y2) ** 2;
    }

    function addNode(x: number, y: number) {
        setGraph((prev) => {
            const output = _.clone(prev);
            output.nodes.push(new Node(x, y));
            return output;
        });
    }

    function moveLine(e: MouseEvent) {
        const x = e.clientX;
        const y = e.clientY;

        setGraph((prev) => {
            const output = _.clone(prev);
            output.lines[output.lines.length - 1].end = new Node(x, y);
            return output;
        });
    }
    function isExistingLine(line: Line) {
        if (
            lines().filter(
                (existingLine) =>
                    existingLine.start === line.start &&
                    existingLine.end === line.end
            ).length > 0
        )
            return true;
        if (
            lines().filter(
                (existingLine) =>
                    existingLine.end === line.start &&
                    existingLine.start === line.end
            ).length > 0
        )
            return true;

        return false;
    }

    let prevX: number | null = null;
    let prevY: number | null = null;

    function deleteElements(e: MouseEvent) {
        const x = e.clientX;
        const y = e.clientY;

        deleteLines(x, y);
        deleteNodes(x, y);
    }

    function deleteLines(x: number, y: number) {
        if (prevX === null || prevY === null) {
            prevX = x;
            prevY = y;
            return;
        }

        if (prevX === x && prevY === y) return;

        // Horrible intersect code
        let mouseSlope = (y - prevY) / (x - prevX);
        const mouseYIntersect = y - mouseSlope * x;

        const toBeDeleted = lines().filter((line) => {
            let lineSlope =
                (line.start.y - line.end.y) / (line.start.x - line.end.x);

            const lineYIntersect = line.start.y - lineSlope * line.start.x;

            let intsectX =
                (lineYIntersect - mouseYIntersect) / (mouseSlope - lineSlope);
            if (Number.isFinite(intsectX) === false) {
                if (
                    Number.isFinite(mouseSlope) === false &&
                    Number.isFinite(lineSlope) === false
                ) {
                    return x === line.start.x;
                }
                if (Number.isFinite(mouseSlope) === false) {
                    return (
                        Math.min(line.start.x, line.end.x) <= x &&
                        x <= Math.max(line.start.x, line.end.x) &&
                        Math.min(y, prevY!) <= lineSlope * x + lineYIntersect &&
                        lineSlope * x + lineYIntersect <= Math.max(y, prevY!)
                    );
                }
                if (Number.isFinite(lineSlope) === false) {
                    return (
                        Math.min(x, prevX!) <= line.start.x &&
                        line.start.x <= Math.max(x, prevX!) &&
                        Math.min(line.start.y, line.end.y) <=
                            mouseSlope * line.start.x + mouseYIntersect &&
                        mouseSlope * line.start.x + mouseYIntersect <=
                            Math.max(line.start.y, line.end.y)
                    );
                }
            }
            return (
                Math.min(line.start.x, line.end.x) <= intsectX &&
                intsectX <= Math.max(line.start.x, line.end.x) &&
                Math.min(prevX!, x) <= intsectX &&
                intsectX <= Math.max(prevX!, x)
            );
        });

        setGraph((prev) => {
            const output = _.clone(prev);
            output.lines = output.lines.filter(
                (line) => toBeDeleted.includes(line) === false
            );
            return output;
        });

        prevX = x;
        prevY = y;
    }

    function deleteNodes(x: number, y: number) {
        const toBeDeleted = nodes().filter(
            (node) => nodeToPointSquared(node, x, y) < Node.NODE_RADIUS ** 2
        );

        toBeDeleted.forEach((node) => deleteNode(node));
    }

    function deleteNode(node: Node) {
        setGraph((prev) => {
            const output = _.clone(prev);
            output.nodes.splice(output.nodes.indexOf(node), 1);
            output.lines = output.lines.filter(
                (line) => (line.start === node || line.end === node) === false
            );
            return output;
        });
    }

    return (
        <div>
            <Info
                mode={mode()}
                nodes={nodes()}
                lines={lines()}
                nodeIndex={selectedNodeIndex()}
                lineIndex={selectedLineIndex()}
                setGraph={setGraph}
            />
            <GraphRenderer graph={graph()} ref={setCanvas} canvas={canvas()!} />
        </div>
    );
}

export default App;
