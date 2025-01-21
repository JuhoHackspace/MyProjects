const gradeMapping = {
    '3': 3.0,
    '4': 4.0,
    '4+': 4.5,
    '5': 5.0,
    '5+': 5.5,
    '6a': 6.0,
    '6a+': 6.17,
    '6b': 6.33,
    '6b+': 6.5,
    '6c': 6.67,
    '6c+': 6.83,
    '7a': 7.0,
    '7a+': 7.17,
    '7b': 7.33,
    '7b+': 7.5,
    '7c': 7.67,
    '7c+': 7.83,
    '8a': 8.0,
    '8a+': 8.17,
    '8b': 8.33,
    '8b+': 8.5,
    '8c': 8.67,
    '8c+': 8.83,
    '9a': 9.0,
    '9a+': 9.17,
    '9b': 9.33,
    '9b+': 9.5,
    '9c': 9.67,
    '9c+': 9.83
};
const difficultyMapping = [
    { color: "yellow", grades: ["3", "4"], values: [3.0, 4.0] },
    { color: "green", grades: ["4+", "5"], values: [4.5, 5.0] },
    { color: "blue", grades: ["5+", "6A"], values: [5.5, 6.0] },
    { color: "pink", grades: ["6A+", "6B", "6B+"], values: [6.17, 6.33, 6.5] },
    { color: "red", grades: ["6C", "6C+", "7A"], values: [6.67, 6.83, 7.0] },
    { color: "purple", grades: ["7A+", "7B"], values: [7.17, 7.33] },
    { color: "black", grades: ["7B+", '7c+'], values: [7.5, 7,83] },
    { color: "white", grades: ["8a", "9a+"], values: [8.0, 9.17] },
  ];

const reverseGradeMapping = Object.fromEntries(
    Object.entries(gradeMapping).map(([key, value]) => [value, key])
);

export const convertGrade = (gradesArray, gradeColor) => {
    if (!gradesArray.length) return 'No grades available';

    // Käännetään gradet numeroiksi
    const numericalGrades = gradesArray.map(grade => gradeMapping[grade]);
    console.log('Numerical grades:', numericalGrades);

    // Lasketaan keskiarvo
    const total = numericalGrades.reduce((sum, grade) => sum + grade, 0);
    const average = total / numericalGrades.length;
    console.log('Average grade:', average);

    // Pyöristetään keskiarvo
    const roundedAverage = Math.round(average * 100) / 100;
    console.log('Rounded average:', roundedAverage);

    // Haetaan värin lukuväli
    const colorRange = difficultyMapping.find(entry => entry.color === gradeColor);
    if (!colorRange) {
        console.warn(`Color ${gradeColor} not found in difficultyMapping.`);
        return 'Unknown grade';
    }

    const [minValue, maxValue] = [Math.min(...colorRange.values), Math.max(...colorRange.values)];

    // Määritetään palaute lukuarvon ja värin välin perusteella
    let feedback = '';
    if (roundedAverage < minValue) {
        feedback = 'easy for the grade!';
    } else if (roundedAverage > maxValue) {
        feedback = 'sandbagged!';
    } else {
        feedback = 'spot on!';
    }

    // Päivitetty logiikka lähimmän graden löytämiseksi
    const closestGrade = Object.keys(gradeMapping).reduce((prev, curr) => {
        const currValue = gradeMapping[curr];
        return Math.abs(currValue - roundedAverage) < Math.abs(gradeMapping[prev] - roundedAverage)
            ? curr
            : prev;
    });

    // Palautetaan lähin grade ja palaute
    return `${closestGrade} (${feedback})`;
};