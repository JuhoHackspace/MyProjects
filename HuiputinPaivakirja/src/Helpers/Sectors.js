// Sector coordinates are based on the original map image.  The coordinates are the top left and bottom right corners of the sector.
// Y = 0 is the top of the image, X = 0 is the left side of the image.
const sectors = [
    { id : 1, name: 'Sector A', yMin: 237, yMax: 304, xMin: 40, xMax: 102, color: 'red' },
    { id : 2,  name: 'Sector B', yMin: 189, yMax: 236, xMin: 40, xMax: 114, color: 'blue' },
    { id : 4,  name: 'Sector C', yMin: 138, yMax: 188, xMin: 40, xMax: 102, color: 'green' },
    { id : 5,  name: 'Sector D', yMin: 50, yMax: 137, xMin: 75, xMax: 114, color: 'purple' },
    { id : 6,  name: 'Sector E', yMin: 24, yMax: 49, xMin: 75, xMax: 147, color: 'pink' },
    { id : 7,  name: 'Sector F', yMin: 24, yMax: 49, xMin: 148, xMax: 225, color: 'black' },
    { id : 8,  name: 'Sector G', yMin: 24, yMax: 58, xMin: 226, xMax: 310, color: 'yellow' },
    { id : 9,  name: 'Sector H', yMin: 59, yMax: 135, xMin: 277, xMax: 310, color: 'white' },
    { id : 10,  name: 'Sector I', yMin: 164, yMax: 284, xMin: 277, xMax: 312, color: 'red' },
    { id : 11,  name: 'Sector J', yMin: 285, yMax: 324, xMin: 225, xMax: 312, color: 'green' },
    { id : 12,  name: 'Sector K', yMin: 258, yMax: 292, xMin: 146, xMax: 224, color: 'blue' },
    { id : 13,  name: 'Sector L', yMin: 190, yMax: 222, xMin: 158, xMax: 234, color: 'black' },
    { id : 14,  name: 'Sector M', yMin: 100, yMax: 197, xMin: 125, xMax: 157, color: 'pink' },
    { id : 15,  name: 'Sector N', yMin: 80, yMax: 114, xMin: 158, xMax: 234, color: 'purple' },
    { id : 16,  name: 'Sector O', yMin: 100, yMax: 197, xMin: 235, xMax: 262, color: 'purple' }
]

export default sectors;