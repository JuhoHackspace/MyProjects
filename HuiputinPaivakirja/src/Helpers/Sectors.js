// Original image dimensions (not to be confused with the actual resolution of the current image) that the sector coordinates are based on
export const ORIGINAL_IMAGE_WIDTH = 360;  
export const ORIGINAL_IMAGE_HEIGHT = 360; 

// Sector coordinates are based on the original (not the cureent one) map image.  The coordinates are the top left and bottom right corners of the sector.
// Y = 0 is the top of the image, X = 0 is the left side of the image.
const sectors = [
    { id : 1, name: 'Sector A', yMin: 237, yMax: 304, xMin: 40, xMax: 102, color: 'red' },
    { id : 2, name: 'Sector B', yMin: 189, yMax: 237, xMin: 40, xMax: 118, color: 'blue' },
    { id : 4, name: 'Sector C', yMin: 138, yMax: 189, xMin: 40, xMax: 102, color: 'green' },
    { id : 5, name: 'Sector D', yMin: 50, yMax: 138, xMin: 75, xMax: 114, color: 'purple' },
    { id : 6, name: 'Sector E', yMin: 24, yMax: 50, xMin: 75, xMax: 147, color: 'pink' },
    { id : 7, name: 'Sector F', yMin: 24, yMax: 50, xMin: 147, xMax: 225, color: 'black' },
    { id : 8, name: 'Sector G', yMin: 24, yMax: 58, xMin: 225, xMax: 310, color: 'yellow' },
    { id : 9, name: 'Sector H', yMin: 58, yMax: 135, xMin: 277, xMax: 310, color: 'white' },
    { id : 10, name: 'Sector I', yMin: 164, yMax: 284, xMin: 277, xMax: 312, color: 'red' },
    { id : 11, name: 'Sector J', yMin: 284, yMax: 324, xMin: 225, xMax: 312, color: 'green' },
    { id : 12, name: 'Sector K', yMin: 258, yMax: 292, xMin: 146, xMax: 224, color: 'blue' },
    { id : 13, name: 'Sector L', yMin: 190, yMax: 222, xMin: 158, xMax: 234, color: 'black' },
    { id : 14, name: 'Sector M', yMin: 98, yMax: 199, xMin: 125, xMax: 158, color: 'pink' },
    { id : 15, name: 'Sector N', yMin: 78, yMax: 116, xMin: 158, xMax: 234, color: 'purple' },
    { id : 16, name: 'Sector O', yMin: 100, yMax: 197, xMin: 234, xMax: 262, color: 'purple' }
]

export default sectors;