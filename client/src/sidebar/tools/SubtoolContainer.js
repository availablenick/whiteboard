import React from 'react';
import Tool from './Tool';

function SubtoolContainer({ name, isSelected, setTool, icon, setGroupIcon, setGroupState }) {
  const handleClick = (event) => {
    const canvas = document.getElementById('canvas');
    canvas.focus();
    event.stopPropagation();
    setTool(name);
    if (!isSelected) {
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
