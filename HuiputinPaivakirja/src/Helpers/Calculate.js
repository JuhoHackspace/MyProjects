const gradeMapping = {
    4.0: '4a',
    4.33: '4b',
    4.67: '4c',
    5.0: '5a',
    5.17: '5a+',
    5.33: '5b',
    5.5: '5b+',
    5.67: '5c',
    5.83: '5c+',
    6.0: '6a',
    6.17: '6a+',
    6.33: '6b',
    6.5: '6b+',
    6.67: '6c',
    6.83: '6c+',
    7.0: '7a',
    7.17: '7a+',
    7.33: '7b',
    7.5: '7b+',
    7.67: '7c',
    7.83: '7c+',
    8.0: '8a',
    8.17: '8a+',
    8.33: '8b',
    8.5: '8b+',
    8.67: '8c',
    8.83: '8c+',
    9.0: '9a',
    9.17: '9a+',
    9.33: '9b',
    9.5: '9b+',
};

const convertGrade = (numericalGrade) => {
    const roundedGrade = Math.round(numericalGrade * 100) / 100; // Round to nearest 0.01
    return gradeMapping[roundedGrade] || 'Unknown grade';
};

export default convertGrade;