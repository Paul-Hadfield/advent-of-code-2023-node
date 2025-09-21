import { readFileSync } from "fs";
type Position = string;
type Instruction = "L" | "R";

type Node = {
    left: Position;
    right: Position;
};
type Navigation = {
    instructions: Instruction[];
    startingPositions: Position[];
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
        const key = parts[0].trim();
        if (key.endsWith("A")) {
            navigation.startingPositions.push(key);
        }

        const nodes = parts[1].replace("(", "").replace(")", "").split(",");
        navigation.nodes.set(key, {
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
            startingPositions: [],
            nodes: new Map<string, Node>(),
        });

    const count = navigateMap(navigation);
    console.log(count);
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

function navigateMap(navigation: Navigation): number {
    let positionInInstructions = 0;
    let current = [...navigation.startingPositions];
    let steps = 1;
    while (true) {
        const instruction = navigation.instructions[positionInInstructions];
        let routesAtDestination = 0;
        for (let i = 0; i < navigation.startingPositions.length; i++) {
            current[i] = getNextPosition(
                current[i],
                instruction,
                navigation.nodes
            );

            if (current[i].endsWith("Z")) {
                routesAtDestination++;
            }
        }

        if (routesAtDestination === navigation.startingPositions.length) {
            return steps;
        }

        positionInInstructions = positionInInstructions + 1;
        if (positionInInstructions >= navigation.instructions.length) {
            positionInInstructions = 0;
        }

        steps = steps + 1;
    }
}
