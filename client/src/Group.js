import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tool from './Tool';
import makeItem from './res/tools/toolHandler';
import './Group.scss';

function Group({ name, tools, setTool, isSelected, setSidebarState }) {
  const ref = useRef(null);
  const initialState = {};
  Object.keys(tools).forEach((tool) => {
    initialState[tool] = false;
  });

  initialState[tools[0]] = true;
  const [icon, setIcon] = useState(makeItem(tools[0], {}).getIcon());
  const [state, setState] = useState(initialState);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const toolsGroup = tools.map((tool) => (
    <li key={tool}>
      <Tool
        name={tool}
        icon={makeItem(tool, {}).getIcon()}
        isSelected={state[tool]}
        setGroupIcon={setIcon}
        setGroupState={setState}
        setTool={setTool}
      />
    </li>
  ));

  useEffect(() => {
    if (isContentVisible) {
      const hideGroup = (event) => {
        if (event.target === ref.current
            || ref.current.contains(event.target)) {
          return;
        }

        setIsContentVisible(false);
      };

      document.addEventListener('mousedown', hideGroup);
      return () => {
        document.removeEventListener('mousedown', hideGroup);
      };
    }

    return () => {};
  }, [isContentVisible]);

  const handleClick = (event) => {
    event.stopPropagation();
    if (!isSelected) {
      Object.keys(state).forEach((tool) => {
        if (state[tool] === true) {
          setTool(tool);
        }
      });

      setSidebarState((prevSidebarState) => {
        const newSidebarState = {};
        Object.keys(prevSidebarState).forEach((key) => {
          newSidebarState[key] = false;
        });

        newSidebarState[name] = true;
        return newSidebarState;
      });
    }
  };

  const changeGroupVisibility = (event) => {
    event.stopPropagation();
    setIsContentVisible(!isContentVisible);
  };

  let arrowStyle = {};
  let blockStyle = {};
  if (isSelected) {
    arrowStyle = {
      borderLeft: '4.5px solid black',
    };

    blockStyle = {
      background: 'white',
      color: 'black',
    };
  }

  return (
    <div className="tool-group w-100" ref={ref} onClick={handleClick}>
      <span className="d-inline-block w-100" style={blockStyle}>
        <FontAwesomeIcon icon={icon} />
        <span
          className="show-hide"
          style={arrowStyle}
          onClick={changeGroupVisibility}
        />
      </span>

      {isContentVisible
        && (
        <ul>
          {toolsGroup}
        </ul>
        )}
    </div>
  );
}

export default Group;
