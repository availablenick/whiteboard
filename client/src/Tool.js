import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Tool.scss';

function Tool({
  name,
  isSelected,
  setTool,
  setSidebarState,
  icon,
  setGroupIcon,
  setGroupState,
}) {
  const handleClick = (event) => {
    const canvas = document.getElementById('canvas');
    canvas.focus();
    event.stopPropagation();
    setTool(name);
    if (setSidebarState && !isSelected) {
      setSidebarState((prevSidebarState) => {
        const newSidebarState = {};
        Object.keys(prevSidebarState).forEach((key) => {
          newSidebarState[key] = false;
        });

        newSidebarState[name] = true;
        return newSidebarState;
      });
    } else if (!isSelected) {
      setGroupIcon(icon);
      setGroupState((prevGroupState) => {
        const newGroupState = {};
        Object.keys(prevGroupState).forEach((key) => {
          if (key === name) {
            newGroupState[key] = !prevGroupState[key];
          } else {
            newGroupState[key] = false;
          }
        });

        return newGroupState;
      });
    }
  };

  let style = {};
  if (isSelected) {
    style = {
      background: 'white',
      color: 'black',
    };
  }

  return (
    <span
      className="tool d-inline-block w-100"
      style={style}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}

export default Tool;
