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

function getMaximumDrawn(maximumDrawn: Set, currentValue: Set): Set {
    return {
        red: Math.max(maximumDrawn.red, currentValue.red),
        green: Math.max(maximumDrawn.green, currentValue.green),
        blue: Math.max(maximumDrawn.blue, currentValue.blue),
    };
}

function minimumToStatisfy(game: Game): Set {
    return game.sets.reduce(getMaximumDrawn, { red: 0, blue: 0, green: 0 });
}

function powerOfSet(value: Set): number {
    return value.red * value.blue * value.green;
}

function sumOfPowers(runningTotal: number, currentValue: number): number {
    return runningTotal + currentValue;
}

try {
    const games = readFileSync("./data.txt", "utf8")
        .split("\n")
        .map(setupGames)
        .map(minimumToStatisfy)
        .map(powerOfSet)
        .reduce(sumOfPowers);

    console.log(JSON.stringify(games));
} catch (err) {
    console.error(err);
}
