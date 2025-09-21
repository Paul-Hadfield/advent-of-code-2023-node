import { readFileSync } from "fs";

type PartNumber = {
    x: number;
    y: number;
    value: string;
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

type Cell = PartNumber | Symbol | Empty;

function isPartNumber(cell: Cell | undefined | null): cell is PartNumber {
    return cell ? (cell as PartNumber).value !== undefined : false;
}

function isSymbol(cell: Cell | undefined | null): cell is Symbol {
    return cell ? (cell as Symbol).code !== undefined : false;
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
    return isPartNumber(cell) || isSymbol(cell);
}

function partsWithNeighbours(
    cell: Cell,
    index: number,
    cells: Cell[]
): boolean {
    if (!isPartNumber(cell)) {
        return false;
    }

    const x1 = cell.x - 1;
    const x2 = cell.x + cell.value.length;
    const y1 = cell.y - 1;
    const y2 = cell.y + 1;

    return (
        cells
            .filter((cell) => isSymbol(cell))
            .filter(
                (cell) =>
                    cell.x >= x1 && cell.x <= x2 && cell.y >= y1 && cell.y <= y2
            ).length > 0
    );
}

function sumPartNumbers(runningTotal: number, cell: Cell): number {
    if (!isPartNumber(cell)) {
        return runningTotal;
    }

    return runningTotal + parseInt(cell.value);
}

try {
    const lines = readFileSync("./example.txt", "utf8")
        .split("\n")
        .map(parseLines)
        .reduce(flattenLines)
        .filter(removeEmptyCells)
        .filter(partsWithNeighbours)
        .reduce(sumPartNumbers, 0);

    console.log(JSON.stringify(lines));
} catch (err) {
    console.error(err);
}
