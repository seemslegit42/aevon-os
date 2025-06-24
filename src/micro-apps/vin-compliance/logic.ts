
type VinData = {
    manufacturerId: string;
    trailerType: 'Flatbed' | 'Enclosed' | 'Gooseneck' | 'Utility';
    modelYear: number;
    plantCode: string;
};

// North American VIN character values
const charToValue: Record<string, number> = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 6, 'R': 7, 'S': 9,
    'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0,
};

const weights: number[] = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

const yearToCode: Record<number, string> = {
    2020: 'L', 2021: 'M', 2022: 'N', 2023: 'P', 2024: 'R', 2025: 'S',
    2026: 'T', 2027: 'V', 2028: 'W', 2029: 'X', 2030: 'Y',
};

// Generates a mock sequential number for the last 6 digits of the VIN
const generateSequentialNumber = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getVdsForType = (type: VinData['trailerType']): string => {
    const typeMap = {
        'Flatbed': 'FB123',
        'Enclosed': 'EC456',
        'Gooseneck': 'GN789',
        'Utility': 'UT012',
    };
    return typeMap[type];
};

const calculateCheckDigit = (vinWithoutCheckDigit: string): string => {
    if (vinWithoutCheckDigit.length !== 17) {
        throw new Error("Input string must be 17 characters long with a placeholder for the check digit.");
    }
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        if (i === 8) continue; // Skip the check digit position
        const char = vinWithoutCheckDigit[i].toUpperCase();
        const value = charToValue[char];
        if (value === undefined) throw new Error(`Invalid character in VIN: ${char}`);
        sum += value * weights[i];
    }
    
    const remainder = sum % 11;
    return remainder === 10 ? 'X' : remainder.toString();
};


export const generateVin = (data: VinData) => {
    const wmi = data.manufacturerId.toUpperCase();
    const vds = getVdsForType(data.trailerType);
    const yearCode = yearToCode[data.modelYear];
    const plant = data.plantCode.toUpperCase();
    const sequentialNumber = generateSequentialNumber();

    if (!yearCode) {
        throw new Error(`Invalid model year: ${data.modelYear}.`);
    }

    let partialVin = `${wmi}${vds}0${yearCode}${plant}${sequentialNumber}`;
    const checkDigit = calculateCheckDigit(partialVin);
    const finalVin = `${wmi}${vds}${checkDigit}${yearCode}${plant}${sequentialNumber}`;

    return {
        vin: finalVin,
        checkDigit: checkDigit,
        breakdown: {
            wmi,
            vds,
            yearCode,
            plantCode: plant,
            sequentialNumber,
        }
    };
};
