import { readFileSync } from "fs";

type RaceDetails = {
    time: number;
    currentFurthestDistance: number;
};

type WinningCombination = {
    buttonPressTime: number;
    distanceTravelled: number;
};

const isNumeric = (num: unknown) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

function getValues(values: string[], value: string): string[] {
    if (isNumeric(value)) {
        values.push(value);
    }
    return values;
}

function getLineValue(line: string): number {
    const parts = line.split(":");
    return parseInt(parts[1].split(" ").reduce(getValues, []).join(""));
}

function getRaceDetails(lines: Array<number>): RaceDetails {
    return {
        time: lines[0],
        currentFurthestDistance: lines[1],
    };
}

function countWinningCombinations(race: RaceDetails): number {
    let winningCombinations: number = 0;
    for (
        let buttonPressTime = 1;
        buttonPressTime < race.time;
        buttonPressTime++
    ) {
        const travelTime = race.time - buttonPressTime;
        const distanceTravelled = buttonPressTime * travelTime;
        if (distanceTravelled > race.currentFurthestDistance) {
            winningCombinations += 1;
        }
    }

    return winningCombinations;
}

function productOfWinningCombinations(
    runningTotal: number,
    winningCombinations: WinningCombination[]
): number {
    return runningTotal * winningCombinations.length;
}

try {
    const lines = readFileSync("./data.txt", "utf8")
        .split("\n")
        .map(getLineValue);

    console.log(countWinningCombinations(getRaceDetails(lines)));
} catch (err) {
    console.error(err);
}
