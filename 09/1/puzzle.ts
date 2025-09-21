import { readFileSync } from "fs";

type ValueTriangle = {
    left: number;
    right: number | undefined;
    bottom: number | undefined;
};

function parseValueTriangle(
    values: ValueTriangle[],
    currentValue: string
): ValueTriangle[] {
    if (values.length > 0) {
        const currentTriangle = values[values.length - 1];
        currentTriangle.right = parseInt(currentValue.trim());
        currentTriangle.bottom = currentTriangle.right - currentTriangle.left;
    }

    values.push({
        left: parseInt(currentValue.trim()),
        right: undefined,
        bottom: undefined,
    });

    return values;
}

function parseLine(line: string): ValueTriangle[] {
    const parts = line.split(" ");

    const newLine: ValueTriangle[] = [];
    for (let i = 1; i < parts.length; i++) {
        const left = parseInt(parts[i - 1]);
        const right = parseInt(parts[i]);
        newLine.push({
            left,
            right,
            bottom: right - left,
        });
    }
    return newLine;
}

function wrapLineInArray(value: ValueTriangle[]): Array<Array<ValueTriangle>> {
    return [value];
}

function hasValue(value: ValueTriangle): boolean {
    return value.bottom !== undefined && value.bottom !== 0;
}

function stillDifferencesToProcess(values: ValueTriangle[]) {
    return values.filter(hasValue).length > 0;
}

function resolveDifferences(value: ValueTriangle[][]): ValueTriangle[][] {
    while (stillDifferencesToProcess(value[value.length - 1])) {
        const previousLine = value[value.length - 1];
        const newLine: ValueTriangle[] = [];
        for (let i = 1; i < previousLine.length; i++) {
            const left = previousLine[i - 1].bottom!;
            const right = previousLine[i].bottom!;
            newLine.push({
                left,
                right,
                bottom: right - left,
            });
        }
        value.push(newLine);
    }
    return value;
}

function getBottomValue(existingData: ValueTriangle[][], i: number): number {
    if (i === existingData.length - 1) {
        return 0;
    }

    const line = existingData[i + 1];
    return line[line.length - 1].right!;
}

function backfillPlaceHolder(
    existingData: ValueTriangle[][]
): ValueTriangle[][] {
    for (let i = existingData.length - 1; i >= 0; i--) {
        const currentLine = existingData[i];
        const bottom = getBottomValue(existingData, i);
        const left = currentLine[currentLine.length - 1].right!;
        currentLine.push({
            left,
            right: left + bottom,
            bottom,
        });
    }

    return existingData;
}

function sumNextValues(
    runningTotal: number,
    currentValue: ValueTriangle[][]
): number {
    const line = currentValue[0];
    if (line[line.length - 1].right === undefined) {
        throw new Error("opps");
    }

    return runningTotal + line[line.length - 1].right!;
}

function reduceLines(values: string[], value: string, index: number): string[] {
    if (index === 3) {
        values.push(value);
    }
    return values;
}

try {
    const data = readFileSync("./data.txt", "utf8")
        .split("\n")
        //.reduce(reduceLines, [])
        .map(parseLine)
        .map(wrapLineInArray)
        .map(resolveDifferences)
        .map(backfillPlaceHolder)
        .reduce(sumNextValues, 0);
    console.log(JSON.stringify(data, null, " "));
} catch (err) {
    console.error(err);
}
