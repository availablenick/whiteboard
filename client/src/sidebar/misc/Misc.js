import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '../Tooltip';
import { executeAction } from './items/miscHandler';
import './Misc.scss';

function Misc({ name, icon, tooltip, setIsSidebarVisible }) {
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
      {tooltip && <Tooltip text={tooltip} />}
    </span>
  );
}

export default Misc;
