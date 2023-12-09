import Line from "./line";
import Node from "./node";

class Graph {
    nodes: Node[] | null = null;
    lines: Line[] | null = null;

    constructor(nodes: Node[], lines: Line[]) {
        this.nodes = nodes;
        this.lines = lines;
    }
}

export default Graph;