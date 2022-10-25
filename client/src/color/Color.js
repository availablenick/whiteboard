import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from './ColorPicker';
import './Color.scss';

function Color({ config, setConfig }) {
  const colorViewerRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [type, setType] = useState('drawing');
  const [isContentVisible, setIsContentVisible] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    let colorType = 'drawing';
    if (/erasing/.test(event.target.className)) {
      colorType = 'erasing';
    }

    setType(colorType);
    setIsContentVisible(!isContentVisible);
  };

  useEffect(() => {
    if (isContentVisible) {
      const hideContent = (event) => {
        if (event.target === colorPickerRef.current
          || colorPickerRef.current.contains(event.target)) {
          return;
        }

        if (event.target === colorViewerRef.current
          || colorViewerRef.current.contains(event.target)) {
          return;
        }

        setIsContentVisible(false);
      };

      document.addEventListener('mousedown', hideContent);
      return () => {
        document.removeEventListener('mousedown', hideContent);
      };
    }

    return () => {};
  }, [isContentVisible]);

  return (
    <div
      className="misc d-inline-flex align-items-center justify-content-center
        position-relative w-100"
    >

      <span className="color-viewer" ref={colorViewerRef}>
        <span
          className="highlightable drawing"
          style={{ background: config.drawing.color }}
          onClick={handleClick}
        />

        <span
          className="highlightable erasing"
          style={{ background: config.erasing.color }}
          onClick={handleClick}
        />
      </span>

      {isContentVisible
        && (
        <ColorPicker
          ref={colorPickerRef}
          type={type}
          config={config}
          setConfig={setConfig}
        />
        )}
    </div>
  );
}

export default Color;
