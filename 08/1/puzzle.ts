import { readFileSync } from "fs";
type Position = string;
type Instruction = "L" | "R";

type Node = {
    left: Position;
    right: Position;
};
type Navigation = {
    instructions: Instruction[];
    nodes: Map<Position, Node>;
};

function parseLines(
    navigation: Navigation,
    line: string,
    currentIndex: number
): Navigation {
    if (currentIndex === 0) {
        navigation.instructions = line.split("") as Instruction[];
    }

    if (currentIndex > 1 && line !== "") {
        const parts = line.split("=");
        const nodes = parts[1].replace("(", "").replace(")", "").split(",");
        navigation.nodes.set(parts[0].trim(), {
            left: nodes[0].trim(),
            right: nodes[1].trim(),
        });
    }
    return navigation;
}

try {
    const navigation = readFileSync("./data.txt", "utf8")
        .split("\n")
        .reduce(parseLines, {
            instructions: [],
            nodes: new Map<string, Node>(),
        });

    const count = navigateMap("ZZZ", navigation);
    console.log(navigation, count);
} catch (err) {
    console.error(err);
}

function getNextPosition(
    current: string,
    instruction: string,
    nodes: Map<string, Node>
): string {
    const node = nodes.get(current)!;
    return instruction === "L" ? node.left : node.right;
}

function navigateMap(destination: string, navigation: Navigation): number {
    let positionInInstructions = 0;
    let current = "AAA";
    let steps = 1;
    while (true) {
        const instruction = navigation.instructions[positionInInstructions];
        current = getNextPosition(current, instruction, navigation.nodes);

        if (current === destination) {
            return steps;
        }

        positionInInstructions = positionInInstructions + 1;
        if (positionInInstructions >= navigation.instructions.length) {
            positionInInstructions = 0;
        }

        steps = steps + 1;
    }
}
