import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Board from './Board';
import Sidebar from './Sidebar';
import './App.scss';

function App() {
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);
  const initialConfig = {
    pencil: null,
    eraser: { size: 16 },
    bucket: null,
    text: null,
    shapes: {
      segment: null,
      rectangle: null,
      circle: null,
    },
    eyeDropper: null,
    drawing: { color: 'rgba(0, 0, 0, 1)' },
    erasing: { color: 'rgba(255, 255, 255, 1)' },
  };

  const [config, setConfig] = useState(initialConfig);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [tool, setTool] = useState('pencil');

  useEffect(() => {
    if (!isSidebarVisible) {
      sidebarRef.current.classList.add('slide-to-left');
      buttonRef.current.classList.add('expand');
    } else {
      sidebarRef.current.classList.remove('slide-to-left');
    }
  }, [isSidebarVisible]);

  const handleClick = () => {
    setIsSidebarVisible(true);
  };

  return (
    <div className="app d-flex h-100">
      <Sidebar
        ref={sidebarRef}
        config={config}
        setConfig={setConfig}
        setIsSidebarVisible={setIsSidebarVisible}
        tool={tool}
        setTool={setTool}
      />

      <Board
        config={config}
        setConfig={setConfig}
        tool={tool}
        width="675"
        height="450"
      />

      {!isSidebarVisible
        && (
        <button
          type="button"
          className="show-hide-sidebar position-absolute border-0 text-white"
          ref={buttonRef}
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={['fas', 'arrow-right']} />
        </button>
        )}
    </div>
  );
}

export default App;
