import { readFileSync } from "fs";

type WordDigitPair = {
    word: string;
    digit: string;
};

const wordDigitPairs: Array<WordDigitPair> = [
    { word: "one", digit: "1" },
    { word: "two", digit: "2" },
    { word: "three", digit: "3" },
    { word: "four", digit: "4" },
    { word: "five", digit: "5" },
    { word: "six", digit: "6" },
    { word: "seven", digit: "7" },
    { word: "eight", digit: "8" },
    { word: "nine", digit: "9" },
];

type CalibrationValue = {
    startingValue: string;
    firstDigit?: string;
    lastDigit?: string;
    numericValue?: number;
};

const isNumeric = (num: unknown) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

function convertToCalibrationType(line: string): CalibrationValue {
    return {
        startingValue: line,
    };
}

function findFirstDigit(originalValue: string): string {
    if (originalValue === "") {
        return "";
    }

    if (isNumeric(originalValue[0])) {
        return originalValue[0];
    }

    for (const wordDigitPair of wordDigitPairs) {
        if (originalValue.startsWith(wordDigitPair.word)) {
            return wordDigitPair.digit;
        }
    }

    return findFirstDigit(originalValue.substring(1));
}

function populateFirstDigit(
    calibrationValue: CalibrationValue
): CalibrationValue {
    const firstDigit = findFirstDigit(calibrationValue.startingValue);

    return firstDigit === calibrationValue.firstDigit
        ? calibrationValue
        : {
              ...calibrationValue,
              firstDigit,
          };
}

function findLastDigit(originalValue: string): string {
    if (originalValue === "") {
        return "";
    }

    const lastElementIndex = originalValue.length - 1;
    if (isNumeric(originalValue[lastElementIndex])) {
        return originalValue[lastElementIndex];
    }

    for (const wordDigitPair of wordDigitPairs) {
        if (originalValue.endsWith(wordDigitPair.word)) {
            return wordDigitPair.digit;
        }
    }

    return findLastDigit(originalValue.substring(0, lastElementIndex));
}

function populateLastDigit(
    calibrationValue: CalibrationValue
): CalibrationValue {
    const lastDigit = findLastDigit(calibrationValue.startingValue);

    return lastDigit === calibrationValue.lastDigit
        ? calibrationValue
        : {
              ...calibrationValue,
              lastDigit,
          };
}

function concatDigits(value: CalibrationValue): CalibrationValue {
    const numericValue =
        parseInt((value.firstDigit || "") + (value.lastDigit || "")) || 0;

    if (value.numericValue === numericValue) {
        return value;
    }

    return {
        ...value,
        numericValue,
    };
}

function sumLines(
    runningTotal: number,
    currentValue: CalibrationValue
): number {
    return runningTotal + (currentValue.numericValue || 0);
}

try {
    const values = readFileSync("./data.txt", "utf8")
        .split("\n")
        .map(convertToCalibrationType)
        .map(populateFirstDigit)
        .map(populateLastDigit)
        .map(concatDigits)
        .reduce(sumLines, 0);
    console.log(values);
} catch (err) {
    console.error(err);
}
