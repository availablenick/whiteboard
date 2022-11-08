import React from 'react';
import Tool from './Tool';

function ToolContainer({ name, icon, isSelected, setTool, setSidebarState }) {
  const handleClick = (event) => {
    const canvas = document.getElementById('canvas');
    canvas.focus();
    event.stopPropagation();
    setTool(name);
    if (!isSelected) {
      setSidebarState((prevSidebarState) => {
        const newSidebarState = {};
        Object.keys(prevSidebarState).forEach((toolName) => {
          newSidebarState[toolName] = false;
        });

        newSidebarState[name] = true;
        return newSidebarState;
      });
    }
  };

  return <Tool name={name} icon={icon} isSelected={isSelected} handleClick={handleClick} />;
}

export default ToolContainer;
