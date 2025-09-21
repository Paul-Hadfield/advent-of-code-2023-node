import { readFileSync } from "fs";

type Galaxy = {
    x: number;
    y: number;
    id: number;
};

function readGalaxy(
    galaxies: Galaxy[],
    value: string,
    x: number,
    y: number
): Galaxy[] {
    if (value === "#") {
        galaxies.push({
            x,
            y,
            id: -1,
        });
    }
    return galaxies;
}

function assignId(value: Galaxy, index: number, array: Galaxy[]): Galaxy {
    return { ...value, id: index + 1 };
}

function readGalaxies(
    galaxies: Galaxy[],
    currentLine: string,
    currentYIndex: number
): Galaxy[] {
    return currentLine
        .split("")
        .reduce(
            (currentGalaxies: Galaxy[], value: string, currentXIndex: number) =>
                readGalaxy(
                    currentGalaxies,
                    value,
                    currentXIndex + 1,
                    currentYIndex + 1
                ),
            galaxies
        )
        .map(assignId);
}

function measureDistances(
    distances: Map<string, number>,
    currentGalaxy: Galaxy,
    currentIndex: number,
    allGalaxies: Galaxy[]
): Map<string, number> {
    allGalaxies.forEach((galaxy) => {
        if (galaxy.id === currentGalaxy.id) {
            return;
        }

        const key = `${Math.min(galaxy.id, currentGalaxy.id)}-${Math.max(
            galaxy.id,
            currentGalaxy.id
        )}`;

        if (distances.has(key)) {
            return;
        }

        distances.set(
            key,
            Math.abs(galaxy.x - currentGalaxy.x) +
                Math.abs(galaxy.y - currentGalaxy.y)
        );
    });

    return distances;
}

function getMaxX(currentMaxX: number, galaxy: Galaxy): number {
    return Math.max(galaxy.x, currentMaxX);
}

function getMaxY(currentMaxY: number, galaxy: Galaxy): number {
    return Math.max(galaxy.y, currentMaxY);
}

function noGalaxiesInColumn(x: number, galaxies: Galaxy[]): boolean {
    return (
        galaxies.filter((galaxy) => {
            return galaxy.x == x;
        }).length === 0
    );
}

function expandXSpace(galaxies: Galaxy[], x: number): void {
    galaxies.forEach((galaxy) => {
        if (galaxy.x >= x) {
            galaxy.x++;
        }
    });
}

function noGalaxiesInRow(y: number, galaxies: Galaxy[]): boolean {
    return (
        galaxies.filter((galaxy) => {
            return galaxy.y == y;
        }).length === 0
    );
}

function expandYSpace(galaxies: Galaxy[], y: number): void {
    galaxies.forEach((galaxy) => {
        if (galaxy.y >= y) {
            galaxy.y++;
        }
    });
}

try {
    const galaxies = readFileSync("./data.txt", "utf8")
        .split("\n")
        .reduce(readGalaxies, []);
    console.log(galaxies);
    const maxX = galaxies.reduce(getMaxX, 0);
    const maxY = galaxies.reduce(getMaxY, 0);
    console.log(maxX, maxY);

    for (let x = maxX; x > 0; x--) {
        if (noGalaxiesInColumn(x, galaxies)) {
            expandXSpace(galaxies, x);
        }
    }

    for (let y = maxY; y > 0; y--) {
        if (noGalaxiesInRow(y, galaxies)) {
            expandYSpace(galaxies, y);
        }
    }

    const distances = galaxies.reduce(
        measureDistances,
        new Map<string, number>()
    );
    console.log(
        Array.from(distances.values()).reduce((acc, value) => {
            return acc + value;
        }, 0)
    );
} catch (err) {
    console.error(err);
}
