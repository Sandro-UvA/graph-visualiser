import { createSignal } from "solid-js";
import "./App.css";
import Graph from "./graph/graph";
import Node from "./graph/node";
import Line from "./graph/line";
import GraphRenderer from "./graphRenderer";

function App() {
    const [nodes, setNodes] = createSignal([
        new Node(100, 100),
        new Node(700, 200),
    ]);
    const lines = () => [new Line(nodes()[0], nodes()[1])];
    const graph = () => new Graph(nodes(), lines());

    const moveListener = (e: MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        setNodes([new Node(x, y), new Node(700, 200)]);
    };

    document.addEventListener("mousedown", (e) => {
        setNodes([new Node(e.clientX, e.clientY), new Node(700, 200)]);
        document.addEventListener("mousemove", moveListener);
    });

    document.addEventListener("mouseup", (e) => {
        setNodes([new Node(e.clientX, e.clientY), new Node(700, 200)]);
        document.removeEventListener("mousemove", moveListener);
    });

    return (
        <div>
            <GraphRenderer graph={graph()} />
        </div>
    );
}

export default App;
