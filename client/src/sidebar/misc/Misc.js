import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { executeAction } from './items/miscHandler';
import './Misc.scss';

function Misc({ name, icon, setIsSidebarVisible }) {
  const params = { setIsSidebarVisible };

  const handleClick = (event) => {
    executeAction(name, event, params);
  };

  return (
    <span
      className="misc circular d-inline-flex align-items-center justify-content-center"
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}

export default Misc;
