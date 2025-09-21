import { readFileSync } from "fs";

type IdMap = {
    sourceStartId: number;
    destinationStartId: number;
    range: number;
};

type SeedRange = {
    startId: number;
    range: number;
};

type Data = {
    seedRanges: Array<SeedRange>;
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

function getSeedRanges(lines: string[]): SeedRange[] {
    const seeds: SeedRange[] = [];
    for (const line of lines) {
        if (line.startsWith("seeds:")) {
            const values = splitValues(line.split(":")[1]);
            for (let i = 0; i < values.length; i = i + 2) {
                seeds.push({ startId: values[i], range: values[i + 1] });
            }
        }
    }
    return seeds;
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
        seedRanges: getSeedRanges(lines),
        seedToSoilMap: getMap(lines, "seed-to-soil map:"),
        soilTofertilizerMap: getMap(lines, "soil-to-fertilizer map:"),
        fertilizerToWaterMap: getMap(lines, "fertilizer-to-water map:"),
        waterToLightMap: getMap(lines, "water-to-light map:"),
        lightToTemperatureMap: getMap(lines, "light-to-temperature map:"),
        temperatureToLightMap: getMap(lines, "temperature-to-humidity map:"),
        humidityToLocationMap: getMap(lines, "humidity-to-location map:"),
    };
}

function mapSeedToLocation(seed: number, data: Data): number {
    const soilId = mapId(seed, data.seedToSoilMap);
    const fertilizerId = mapId(soilId, data.soilTofertilizerMap);
    const waterId = mapId(fertilizerId, data.fertilizerToWaterMap);
    const lightId = mapId(waterId, data.waterToLightMap);
    const tempId = mapId(lightId, data.lightToTemperatureMap);
    const humidityId = mapId(tempId, data.temperatureToLightMap);
    return mapId(humidityId, data.humidityToLocationMap);
}

function getMapSeedRangeReduce(
    data: Data
): (
    previousValue: number | undefined,
    currentValue: SeedRange
) => number | undefined {
    return function mapSeedRange(
        startingMinimum: number | undefined,
        seedRange: SeedRange
    ): number | undefined {
        let currentMinimum = startingMinimum;
        for (
            let i = seedRange.startId;
            i < seedRange.startId + seedRange.range;
            i++
        ) {
            const value = mapSeedToLocation(i, data);
            currentMinimum =
                currentMinimum === undefined
                    ? value
                    : Math.min(value, currentMinimum);
        }

        return currentMinimum;
    };
}

try {
    const lines = readFileSync("./data.txt", "utf8").split("\n");
    const data = linesToData(lines);

    const result = data.seedRanges.reduce(
        getMapSeedRangeReduce(data),
        undefined
    );
    console.log(result);
} catch (err) {
    console.error(err);
}
