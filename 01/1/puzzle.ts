import { readFileSync } from "fs";

const isNumeric = (num: any) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

function numbersOnly(numericValues: string[], currentValue: string): string[] {
    if (isNumeric(currentValue)) {
        numericValues.push(currentValue);
    }

    return numericValues;
}

function concatFirstAndLastNumbers(
    concatValue: string,
    currentValue: string,
    currentIndex: number,
    array: string[]
): string {
    if (array.length === 1) {
        return currentValue + currentValue;
    }

    if (currentIndex === 0 || currentIndex === array.length - 1) {
        return concatValue + currentValue;
    }
    return concatValue;
}

function sumLines(previousValue: number, currentValue: number): number {
    return previousValue + currentValue;
}

function processLine(originalValue: string): number {
    const parsedValue = originalValue
        .split("")
        .reduce(numbersOnly, new Array<string>())
        .reduce(concatFirstAndLastNumbers, "");

    return parseInt(parsedValue);
}

try {
    const values = readFileSync("./data.txt", "utf8")
        .split("\n")
        .map(processLine)
        .reduce(sumLines, 0);
    console.log(values);
} catch (err) {
    console.error(err);
}
