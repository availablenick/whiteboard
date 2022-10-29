import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Tool.scss';

function Tool({ icon, isSelected, handleClick }) {
  return (
    <span
      className="tool d-inline-block w-100"
      style={isSelected ? { background: '#fff', color: '#000' } : {}}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}

export default Tool;
