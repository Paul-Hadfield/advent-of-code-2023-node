import { readFileSync } from "fs";

type Card = {
    index: number;
    winningNumbers: Set<number>;
    chosenNumbers: Set<number>;
};

const isNumeric = (num: unknown) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

function getNumbers(numbers: Set<number>, value: string): Set<number> {
    if (isNumeric(value)) {
        numbers.add(parseInt(value));
    }
    return numbers;
}

function parseCard(line: string): Card {
    const mainParts = line.split(":");
    const numbers = mainParts[1].split("|");
    return {
        index: parseInt(mainParts[0].split(" ")[1]),
        winningNumbers: numbers[0]
            .split(" ")
            .reduce(getNumbers, new Set<number>()),
        chosenNumbers: numbers[1]
            .split(" ")
            .reduce(getNumbers, new Set<number>()),
    };
}

function scoreCard(card: Card): number {
    const intersection = new Set(
        [...card.chosenNumbers].filter((x) => card.winningNumbers.has(x))
    );

    let score = 0;
    for (let i = 0; i < intersection.size; i++) {
        if (score === 0) {
            score = 1;
        } else {
            score = score * 2;
        }
    }

    return score;
}

function scoreCards(runningScore: number, card: Card): number {
    return runningScore + scoreCard(card);
}

try {
    const result = readFileSync("./data.txt", "utf8")
        .split("\n")
        .map(parseCard)
        .reduce(scoreCards, 0);

    console.log(result);
} catch (err) {
    console.error(err);
}
