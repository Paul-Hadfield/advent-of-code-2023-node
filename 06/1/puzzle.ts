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

function getValues(values: number[], value: string): number[] {
    if (isNumeric(value)) {
        values.push(parseInt(value));
    }
    return values;
}

function getLineValues(line: string): number[] {
    const parts = line.split(":");
    return parts[1].split(" ").reduce(getValues, []);
}

function getfastestRaceResults(lines: Array<Array<number>>): RaceDetails[] {
    const raceResults: RaceDetails[] = [];
    for (let i = 0; i < lines[0].length; i++) {
        raceResults.push({
            time: lines[0][i],
            currentFurthestDistance: lines[1][i],
        });
    }
    return raceResults;
}

function getWinningCombinations(race: RaceDetails): WinningCombination[] {
    const winningCombinations: WinningCombination[] = [];
    for (
        let buttonPressTime = 1;
        buttonPressTime < race.time;
        buttonPressTime++
    ) {
        const travelTime = race.time - buttonPressTime;
        const distanceTravelled = buttonPressTime * travelTime;
        if (distanceTravelled > race.currentFurthestDistance) {
            winningCombinations.push({ buttonPressTime, distanceTravelled });
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
        .map(getLineValues);

    const winningCombinations = getfastestRaceResults(lines)
        .map(getWinningCombinations)
        .reduce(productOfWinningCombinations, 1);

    console.log(winningCombinations);
} catch (err) {
    console.error(err);
}
