import { readFileSync } from "fs";

type Card = {
    index: number;
    winningNumbers: Array<number>;
    chosenNumbers: Array<number>;
    numberOfWinningNumbers: number;
};

const isNumeric = (num: unknown) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

function getNumbers(numbers: Array<number>, value: string): Array<number> {
    if (isNumeric(value)) {
        numbers.push(parseInt(value));
    }
    return numbers;
}

function parseCard(line: string): Card {
    const mainParts = line.split(":");
    const numbers = mainParts[1].split("|");
    const winningNumbers = numbers[0]
        .split(" ")
        .reduce(getNumbers, new Array<number>());
    const chosenNumbers = numbers[1]
        .split(" ")
        .reduce(getNumbers, new Array<number>());

    const numberOfWinningNumbers = chosenNumbers.filter((x) =>
        winningNumbers.includes(x)
    ).length;

    const index = mainParts[0].split(" ");

    const result = {
        index: parseInt(index[index.length - 1]),
        winningNumbers,
        chosenNumbers,
        numberOfWinningNumbers,
    };

    return result;
}

function processCards(currentCards: Card[], totalCards: Card[]): number {
    const cardsToReProcess = new Array<Card>();

    for (const card of currentCards) {
        if (card.numberOfWinningNumbers > 0) {
            const startingElement = card.index;
            const endElement = Math.min(
                totalCards.length,
                startingElement + card.numberOfWinningNumbers
            );

            cardsToReProcess.push(
                ...totalCards.slice(startingElement, endElement)
            );
        }
    }

    if (cardsToReProcess.length > 0) {
        return currentCards.length + processCards(cardsToReProcess, totalCards);
    }

    return currentCards.length;
}

try {
    const cards = readFileSync("./data.txt", "utf8").split("\n").map(parseCard);

    const total = processCards(cards, cards);

    console.log(total);
} catch (err) {
    console.error(err);
}
