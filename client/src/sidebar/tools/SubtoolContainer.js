import React from 'react';
import Tool from './Tool';

function SubtoolContainer({
  name, isSelected, icon, isGroupSelected, setTool, setGroupIcon, setGroupState
}) {
  const handleClick = (event) => {
    const canvas = document.getElementById('canvas');
    canvas.focus();
    event.stopPropagation();
    if (!isSelected) {
      if (isGroupSelected) {
        setTool(name);
      }

      setGroupIcon(icon);
      setGroupState((prevGroupState) => {
        const newGroupState = {};
        Object.keys(prevGroupState).forEach((toolName) => {
          newGroupState[toolName] = false;
        });

        newGroupState[name] = true;
        return newGroupState;
      });
    }
  };

  return <Tool icon={icon} isSelected={isSelected} handleClick={handleClick} />;
}

export default SubtoolContainer;
