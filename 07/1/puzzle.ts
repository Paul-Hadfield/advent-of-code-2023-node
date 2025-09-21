import { readFileSync } from "fs";

enum HandTypes {
    FiveOfAKind = 7,
    FourOfAKind = 6,
    FullHouse = 5,
    ThreeOfAKind = 4,
    TwoPair = 3,
    OnePair = 2,
    HighCard = 1,
    Unknown = 0,
}

enum CardRank {
    Ace = 14,
    King = 13,
    Queen = 12,
    Jack = 11,
    Ten = 10,
    Nine = 9,
    Eight = 8,
    Seven = 7,
    Six = 6,
    Five = 5,
    Four = 4,
    Three = 3,
    Two = 2,
    Unknown = 0,
}

type Card = {
    value: string;
    rank: CardRank;
};

type Hand = {
    handType: HandTypes;
    cards: Card[];
    bid: number;
};

function parseCard(value: string): string {
    return value;
}

function isFiveOfAKind(counts: Map<string, number>): boolean {
    return counts.size === 1;
}
function isFourOfAKind(counts: Map<string, number>): boolean {
    for (const key of counts.keys()) {
        if (counts.get(key) === 4) {
            return true;
        }
    }
    return false;
}

function isFullHouse(counts: Map<string, number>): boolean {
    if (counts.size !== 2) {
        return false;
    }

    return (
        [...counts.keys()].filter((value) => value !== "2" && value !== "3")
            .length === 0
    );
}

function isThreeOfAKind(counts: Map<string, number>): boolean {
    if (counts.size !== 3) {
        return false;
    }

    for (const key of counts.keys()) {
        if (counts.get(key) === 3) {
            return true;
        }
    }
    return false;
}

function isTwoPair(counts: Map<string, number>): boolean {
    if (counts.size !== 3) {
        return false;
    }

    return [...counts.values()].filter((value) => value === 2).length === 2;
}

function isOnePair(counts: Map<string, number>): boolean {
    if (counts.size !== 4) {
        return false;
    }

    return [...counts.values()].filter((value) => value === 2).length === 1;
}

function getHandType(cards: string[]): HandTypes {
    const counts = new Map<string, number>();
    cards.forEach((card) => {
        const value = counts.get(card) || 0;
        counts.set(card, value + 1);
    });

    if (isFiveOfAKind(counts)) {
        return HandTypes.FiveOfAKind;
    }

    if (isFourOfAKind(counts)) {
        return HandTypes.FourOfAKind;
    }

    if (isFullHouse(counts)) {
        return HandTypes.FullHouse;
    }

    if (isThreeOfAKind(counts)) {
        return HandTypes.ThreeOfAKind;
    }

    if (isTwoPair(counts)) {
        return HandTypes.TwoPair;
    }
    if (isOnePair(counts)) {
        return HandTypes.OnePair;
    }

    return HandTypes.HighCard;
}

function getCard(cardValue: string): Card {
    switch (cardValue) {
        case "A": {
            return {
                value: cardValue,
                rank: CardRank.Ace,
            };
        }
        case "K": {
            return {
                value: cardValue,
                rank: CardRank.King,
            };
        }
        case "Q": {
            return {
                value: cardValue,
                rank: CardRank.Queen,
            };
        }
        case "J": {
            return {
                value: cardValue,
                rank: CardRank.Jack,
            };
        }
        case "T": {
            return {
                value: cardValue,
                rank: CardRank.Ten,
            };
        }
        case "9": {
            return {
                value: cardValue,
                rank: CardRank.Nine,
            };
        }
        case "8": {
            return {
                value: cardValue,
                rank: CardRank.Eight,
            };
        }
        case "7": {
            return {
                value: cardValue,
                rank: CardRank.Seven,
            };
        }
        case "6": {
            return {
                value: cardValue,
                rank: CardRank.Six,
            };
        }
        case "5": {
            return {
                value: cardValue,
                rank: CardRank.Five,
            };
        }
        case "4": {
            return {
                value: cardValue,
                rank: CardRank.Four,
            };
        }
        case "3": {
            return {
                value: cardValue,
                rank: CardRank.Three,
            };
        }
        case "2": {
            return {
                value: cardValue,
                rank: CardRank.Two,
            };
        }
        default: {
            return {
                value: cardValue,
                rank: CardRank.Unknown,
            };
        }
    }
}

function getCards(cardValues: string[]): Card[] {
    return cardValues.map(getCard);
}

function sortCardValues(a: Card, b: Card): number {
    return b.rank - a.rank;
}

function parseHand(line: string): Hand {
    const parts = line.split(" ");
    const cardValues = parts[0].split("").map(parseCard);
    const cards = getCards(cardValues);
    //cards.sort(sortCardValues);
    return {
        cards,
        handType: getHandType(cardValues),
        bid: parseInt(parts[1]),
    };
}

function sortHands(a: Hand, b: Hand): number {
    const diff = b.handType - a.handType;
    if (diff !== 0) {
        return diff;
    }

    for (let i = 0; i < Math.min(a.cards.length, b.cards.length); i++) {
        const valueDiff = b.cards[i].rank - a.cards[i].rank;
        if (valueDiff !== 0) {
            return valueDiff;
        }
    }

    return 0;
}

try {
    const hands = readFileSync("./data.txt", "utf8").split("\n").map(parseHand);
    hands.sort(sortHands);

    const winnings = hands.reduce(getTotalWinnings, 0);
    console.log(winnings);
} catch (err) {
    console.error(err);
}
function getTotalWinnings(
    winnings: number,
    currentValue: Hand,
    currentIndex: number,
    array: Hand[]
): number {
    return winnings + currentValue.bid * (array.length - currentIndex);
}
