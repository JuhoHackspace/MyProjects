import React from 'react';

/**
 * Dates component is used to select a date.
 * @param onSelectDate // Function that sets the selected date to the parent component.
 * @returns {Element}
 */

const Dates = ({ onSelectDate }) => {

  return (
    <div>
      <label htmlFor="date"> Valitse päivämäärä:</label>
      <input type="date" id="date" onChange={(e) => onSelectDate(e.target.value)} /> <br/>
    </div>
  );
};

export default Dates;