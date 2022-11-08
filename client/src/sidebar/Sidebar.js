import React, { useState, forwardRef } from 'react';
import ColorViewer from '../color/ColorViewer';
import Group from './tools/Group';
import Misc from './misc/Misc';
import ToolContainer from './tools/ToolContainer';
import { getIcon as getToolIcon } from './tools/items/toolHandler';
import { getIcon as getMiscIcon } from './misc/items/miscHandler';
import './Sidebar.scss';

const Sidebar = forwardRef((props, ref) => {
  const toolArrangement = {
    pencil: null,
    eraser: null,
    bucket: null,
    text: null,
    shapes: [
      'segment',
      'rectangle',
      'circle',
    ],
    eyedropper: null,
  };

  const initialState = {};
  Object.keys(toolArrangement).forEach((tool) => {
    initialState[tool] = false;
  });

  initialState[props.tool] = true;
  const [state, setState] = useState(initialState);
  const toolList = Object.keys(state).map((tool) => {
    if (toolArrangement[tool] !== null) {
      return (
        <li key={tool}>
          <Group
            name={tool}
            subtools={toolArrangement[tool]}
            isSelected={state[tool]}
            setTool={props.setTool}
            setSidebarState={setState}
          />
        </li>
      );
    }

    return (
      <li key={tool}>
        <ToolContainer
          name={tool}
          icon={getToolIcon(tool)}
          isSelected={state[tool]}
          setTool={props.setTool}
          setSidebarState={setState}
        />
      </li>
    );
  });

  const miscItems = ['clearer', 'filesaver', 'hider'];
  const miscList = miscItems.map((item) => (
    <li key={item}>
      <Misc
        name={item}
        icon={getMiscIcon(item)}
        config={props.config}
        setConfig={props.setConfig}
        setIsSidebarVisible={props.setIsSidebarVisible}
      />
    </li>
  ));

  return (
    <aside
      className="d-flex flex-column justify-content-between
      text-white"
      ref={ref}
    >
      <ul className="tools-list p-0">
        {toolList}
      </ul>

      <ul className="misc-list p-0">
        <li><ColorViewer config={props.config} setConfig={props.setConfig} /></li>
        {miscList}
      </ul>
    </aside>
  );
});

export default Sidebar;
