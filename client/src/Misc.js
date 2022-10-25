import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeItem from './res/misc/miscHandler';
import './Misc.scss';

function Misc({ name, icon, setIsSidebarVisible }) {
  const params = { setIsSidebarVisible };

  const handleClick = (event) => {
    makeItem(name, params).executeAction(event);
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
