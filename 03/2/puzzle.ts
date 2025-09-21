import { readFileSync } from "fs";

type PartNumber = {
    x: number;
    y: number;
    value: string;
};

type Gear = {
    x: number;
    y: number;
    ratio: number;
};

type Symbol = {
    x: number;
    y: number;
    code: string;
};

type Empty = {
    x: number;
    y: number;
};

type Cell = PartNumber | Symbol | Empty | Gear;

function isPartNumber(cell: Cell | undefined | null): cell is PartNumber {
    return cell ? (cell as PartNumber).value !== undefined : false;
}

function isSymbol(cell: Cell | undefined | null): cell is Symbol {
    return cell ? (cell as Symbol).code !== undefined : false;
}

function isGear(cell: Cell | undefined | null): cell is Gear {
    return cell ? (cell as Gear).ratio !== undefined : false;
}

const isNumeric = (num: unknown) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

function parseLines(line: string, y: number): Cell[] {
    function parseCharacters(cells: Cell[], value: string, x: number): Cell[] {
        if (value === ".") {
            cells.push({ x, y });
            return cells;
        }

        if (value === "*") {
            cells.push({ x, y, ratio: 0 });
            return cells;
        }

        const currentCell: Cell | null =
            cells.length > 0 ? cells[cells.length - 1] : null;

        if (isNumeric(value)) {
            if (isPartNumber(currentCell)) {
                currentCell.value = currentCell.value + value;
            } else {
                cells.push({
                    x,
                    y,
                    value,
                });
            }
            return cells;
        }

        cells.push({
            x,
            y,
            code: value,
        });

        return cells;
    }

    return line.split("").reduce(parseCharacters, new Array<Cell>());
}

function flattenLines(cells: Cell[], cellsInLine: Cell[]): Cell[] {
    cells.push(...cellsInLine);
    return cells;
}

function removeEmptyCells(cell: Cell): boolean {
    return isPartNumber(cell) || isSymbol(cell) || isGear(cell);
}

function isNeighbour(cellToCheck: Cell, gear: Cell): boolean {
    if (!isPartNumber(cellToCheck)) {
        return false;
    }

    const x1 = gear.x - cellToCheck.value.length;
    const x2 = gear.x + 1;
    const y1 = gear.y - 1;
    const y2 = gear.y + 1;

    const result =
        cellToCheck.x >= x1 &&
        cellToCheck.x <= x2 &&
        cellToCheck.y >= y1 &&
        cellToCheck.y <= y2;

    return result;
}

function getGearRatios(cell: Cell, index: number, array: Cell[]): Cell {
    if (!isGear(cell)) {
        return cell;
    }

    const partNumberNeighbours = array.filter((cellToCheck) =>
        isNeighbour(cellToCheck, cell)
    );

    if (partNumberNeighbours.length !== 2) {
        return cell;
    }

    return {
        x: cell.x,
        y: cell.y,
        ratio:
            parseInt((partNumberNeighbours[0] as PartNumber).value) *
            parseInt((partNumberNeighbours[1] as PartNumber).value),
    };
}

function justGears(value: Cell): boolean {
    return isGear(value);
}

function sumGearRatios(runningTotal: number, cell: Cell): number {
    if (!isGear(cell)) {
        return runningTotal;
    }

    return runningTotal + cell.ratio;
}

try {
    const lines = readFileSync("./data.txt", "utf8")
        .split("\n")
        .map(parseLines)
        .reduce(flattenLines)
        .filter(removeEmptyCells)
        .map(getGearRatios)
        .filter(justGears)
        .reduce(sumGearRatios, 0);

    console.log(JSON.stringify(lines));
} catch (err) {
    console.error(err);
}
