import React from 'react';
import './Tooltip.scss';

function Tooltip({ text }) {
  return (
    <span className="tooltip-container">
      <span className="custom-tooltip">{capitalize(text)}</span>
    </span>
  );
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default Tooltip;
