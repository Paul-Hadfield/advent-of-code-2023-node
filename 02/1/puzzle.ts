import { readFileSync } from "fs";

type Set = {
    red: number;
    green: number;
    blue: number;
};

type Game = {
    index: number;
    sets: Array<Set>;
};

function getColour(colourValues: string[], colourToRead: string): number {
    for (const colourValue of colourValues) {
        if (colourValue.endsWith(colourToRead)) {
            return parseInt(colourValue);
        }
    }
    return 0;
}

function setupGames(line: string): Game {
    const parts = line.split(":");
    const index = parseInt(parts[0].substring(5));
    const sets = parts[1].split(";");
    const game: Game = { index, sets: new Array<Set>() };
    for (const set of sets) {
        const colours = set.split(",");
        game.sets.push({
            red: getColour(colours, "red"),
            green: getColour(colours, "green"),
            blue: getColour(colours, "blue"),
        });
    }

    return game;
}

function setDoesNotSatisfy(set: Set, values: Set): boolean {
    return (
        set.red > values.red ||
        set.blue > values.blue ||
        set.green > values.green
    );
}

function allSetsSatisfy(game: Game, values: Set): boolean {
    return (
        game.sets.filter((set) => setDoesNotSatisfy(set, values)).length === 0
    );
}

function sumIndexes(runningTotal: number, currentValue: Game): number {
    return runningTotal + currentValue.index;
}

try {
    const games = readFileSync("./data.txt", "utf8")
        .split("\n")
        .map(setupGames)
        .filter((game) =>
            allSetsSatisfy(game, { red: 12, green: 13, blue: 14 })
        )
        .reduce(sumIndexes, 0);

    console.log(JSON.stringify(games));
} catch (err) {
    console.error(err);
}
