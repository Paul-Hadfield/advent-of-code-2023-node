import { readFileSync } from "fs";

type IdMap = {
    sourceStartId: number;
    destinationStartId: number;
    range: number;
};

type Data = {
    seeds: Array<number>;
    seedToSoilMap: Array<IdMap>;
    soilTofertilizerMap: Array<IdMap>;
    fertilizerToWaterMap: Array<IdMap>;
    waterToLightMap: Array<IdMap>;
    lightToTemperatureMap: Array<IdMap>;
    temperatureToLightMap: Array<IdMap>;
    humidityToLocationMap: Array<IdMap>;
};

const isNumeric = (num: unknown) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

function mapId(sourceId: number, maps: Array<IdMap>): number {
    for (const map of maps) {
        if (
            sourceId >= map.sourceStartId &&
            sourceId <= map.sourceStartId + (map.range - 1)
        ) {
            const offset = sourceId - map.sourceStartId;
            return map.destinationStartId + offset;
        }
    }

    return sourceId;
}

function splitValues(data: string): number[] {
    const values: number[] = [];
    data.split(" ").forEach((value) => {
        if (isNumeric(value)) {
            values.push(parseInt(value));
        }
    });

    return values;
}

function getSeeds(lines: string[]): number[] {
    for (const line of lines) {
        if (line.startsWith("seeds:")) {
            return splitValues(line.split(":")[1]);
        }
    }
    return [];
}

function createIdMap(line: string): IdMap {
    const parts = splitValues(line);
    return {
        sourceStartId: parts[1],
        destinationStartId: parts[0],
        range: parts[2],
    };
}

function getMap(lines: string[], identifier: string): IdMap[] {
    let inMap = false;
    const map: IdMap[] = [];
    for (const line of lines) {
        if (inMap) {
            if (line === "") {
                return map;
            }

            map.push(createIdMap(line));
        } else if (line.startsWith(identifier)) {
            inMap = true;
        }
    }
    return map;
}

function linesToData(lines: string[]): Data {
    return {
        seeds: getSeeds(lines),
        seedToSoilMap: getMap(lines, "seed-to-soil map:"),
        soilTofertilizerMap: getMap(lines, "soil-to-fertilizer map:"),
        fertilizerToWaterMap: getMap(lines, "fertilizer-to-water map:"),
        waterToLightMap: getMap(lines, "water-to-light map:"),
        lightToTemperatureMap: getMap(lines, "light-to-temperature map:"),
        temperatureToLightMap: getMap(lines, "temperature-to-humidity map:"),
        humidityToLocationMap: getMap(lines, "humidity-to-location map:"),
    };
}

try {
    const lines = readFileSync("./data.txt", "utf8").split("\n");
    const data = linesToData(lines);

    const result = Math.min(
        ...data.seeds
            .map((seed) => mapId(seed, data.seedToSoilMap))
            .map((seed) => mapId(seed, data.soilTofertilizerMap))
            .map((seed) => mapId(seed, data.fertilizerToWaterMap))
            .map((seed) => mapId(seed, data.waterToLightMap))
            .map((seed) => mapId(seed, data.lightToTemperatureMap))
            .map((seed) => mapId(seed, data.temperatureToLightMap))
            .map((seed) => mapId(seed, data.humidityToLocationMap))
    );
    console.log(result);
} catch (err) {
    console.error(err);
}
