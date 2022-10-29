import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubtoolContainer from './SubtoolContainer';
import makeItem from './items/toolHandler';
import './Group.scss';

function Group({ name, subtools, setTool, isSelected, setSidebarState }) {
  const groupRef = useRef(null);
  const initialState = {};
  Object.keys(subtools).forEach((tool) => {
    initialState[tool] = false;
  });

  initialState[subtools[0]] = true;
  const [icon, setIcon] = useState(makeItem(subtools[0], {}).getIcon());
  const [state, setState] = useState(initialState);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toolGroup = subtools.map((tool) => (
    <li key={tool}>
      <SubtoolContainer
        name={tool}
        icon={makeItem(tool, {}).getIcon()}
        isSelected={state[tool]}
        isGroupSelected={isSelected}
        setTool={setTool}
        setGroupIcon={setIcon}
        setGroupState={setState}
      />
    </li>
  ));

  useEffect(() => {
    if (isContentVisible) {
      const hideGroup = (event) => {
        if (!groupRef.current.contains(event.target)) {
          setIsContentVisible(false);
        }
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

  return (
    <div className="tool-group w-100" ref={groupRef} onClick={handleClick}>
      <span
        className="d-inline-block w-100"
        style={isSelected ? { background: '#fff', color: '#000' } : {}}
      >
        <FontAwesomeIcon icon={icon} />
        <Toggler isGroupSelected={isSelected} setIsContentVisible={setIsContentVisible} />
      </span>

      {isContentVisible
        && (
        <ul>
          {toolGroup}
        </ul>
        )}
    </div>
  );
}

function Toggler({ isGroupSelected, setIsContentVisible }) {
  const changeGroupVisibility = (event) => {
    event.stopPropagation();
    setIsContentVisible((prev) => !prev);
  };

  return (
    <span
      className="show-hide"
      style={isGroupSelected ? { borderLeft: '4.5px solid black' } : {}}
      onClick={changeGroupVisibility}
    />
  );
}

export default Group;
