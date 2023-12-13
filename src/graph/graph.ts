import Line from "./line";
import Node from "./node";

class Graph {
    nodes: Node[] = [];
    lines: Line[] = [];

    constructor(nodes: Node[], lines: Line[]) {
        this.nodes = nodes;
        this.lines = lines;
    }

    public toLinegraph() {
        if (this.lines === null) return this;

        const newLines: Line[] = [];

        this.nodes = this.lines.map((line) => {
            const avgX = (line.start.x + line.end.x) / 2;
            const avgY = (line.start.y + line.end.y) / 2;
            const output = new Node(avgX, avgY);
            return output;
        });

        for (let i = 0; i < this.lines.length; i++) {
            for (let j = 0; j < this.lines.length; j++) {
                if (i === j) continue;
                if (Line.areNeighbours(this.lines[i], this.lines[j]) === false)
                    continue;

                // const node1 = new Node(
                //     (this.lines[i].start.x + this.lines[i].end.x) / 2,
                //     (this.lines[i].start.y + this.lines[i].end.y) / 2
                // );
                const node1 = this.nodes.find(
                    (node) =>
                        node.x ===
                            (this.lines[i].start.x + this.lines[i].end.x) / 2 &&
                        node.y ===
                            (this.lines[i].start.y + this.lines[i].end.y) / 2
                );
                // const node2 = new Node(
                //     (this.lines[j].start.x + this.lines[j].end.x) / 2,
                //     (this.lines[j].start.y + this.lines[j].end.y) / 2
                // );
                const node2 = this.nodes.find(
                    (node) =>
                        node.x ===
                            (this.lines[j].start.x + this.lines[j].end.x) / 2 &&
                        node.y ===
                            (this.lines[j].start.y + this.lines[j].end.y) / 2
                );
                const newLine = new Line(node1!, node2!);

                if (
                    newLines.filter((line) => Line.areEqual(newLine, line))
                        .length === 0
                ) {
                    newLines.push(newLine);
                }
            }
        }

        this.lines = newLines;

        return this;
    }
}

export default Graph;
