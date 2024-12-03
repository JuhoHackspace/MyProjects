const gradeMapping = {
    '4a': 4.0,
    '4b': 4.33,
    '4c': 4.67,
    '5a': 5.0,
    '5a+': 5.17,
    '5b': 5.33,
    '5b+': 5.5,
    '5c': 5.67,
    '5c+': 5.83,
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
};

const reverseGradeMapping = Object.fromEntries(
    Object.entries(gradeMapping).map(([key, value]) => [value, key])
);

export const convertGrade = (gradesArray) => {
    if (!gradesArray.length) return 'No grades available';

    // käännetään gradet numeroiksi
    const numericalGrades = gradesArray.map(grade => gradeMapping[grade]);
    console.log('Numerical grades:', numericalGrades);

    // lasketaan keskiarvo
    const total = numericalGrades.reduce((sum, grade) => sum + grade, 0);
    const average = total / numericalGrades.length;
    console.log('Average grade:', average);

    // pyöristetään keskiarvo
    const roundedAverage = Math.round(average * 100) / 100;
    console.log('Rounded average:', roundedAverage);

    // takas gradeksi
    if (reverseGradeMapping[roundedAverage]) {
        return reverseGradeMapping[roundedAverage];
    }

    // mätsätään lähin grade
    const closestGrade = Object.keys(reverseGradeMapping).reduce((prev, curr) => {
        return (Math.abs(curr - roundedAverage) < Math.abs(prev - roundedAverage) ? curr : prev);
    });

    return reverseGradeMapping[closestGrade] || 'Unknown grade';
};