import React, { useState, useEffect, useRef } from 'react';
import Resizer from '../resizing/Resizer';
import { adjustToCanvasLeft, adjustToCanvasTop, drawText } from './helpers';
import createCanvasChangeEvent from '../../global/helpers';
import getElementMeasurements from '../helpers';
import './TextBlock.scss';

let rowHeight = 0;

function TextBlock({ config, x, y, setTextState }) {
  const canvas = document.getElementById('canvas');
  const textRef = useRef(null);
  const initialStyle = {
    left: '-500px',
    top: '-500px',
  };

  const [isPositioned, setIsPositioned] = useState(false);
  const [style, setStyle] = useState(initialStyle);
  useEffect(() => {
    const newStyle = {
      bottom: '',
      height: '',
      left: `${adjustToCanvasLeft(x, canvas, textRef.current)}px`,
      right: '',
      top: `${adjustToCanvasTop(y, canvas, textRef.current)}px`,
      width: '',
    };

    setStyle(newStyle);
    const textarea = document.getElementsByTagName('textarea')[0];
    rowHeight = textarea.offsetHeight / Number(textarea.rows);
    function handleDocumentClick(event) {
      if (event.target === textRef.current || textRef.current.contains(event.target)) {
        return;
      }

      const context = canvas.getContext('2d');
      context.fillStyle = config.drawing.color;
      context.strokeStyle = config.drawing.color;
      drawText(canvas, textarea, rowHeight);
      canvas.dispatchEvent(createCanvasChangeEvent());
      setTextState({ isWriting: false, x: -1, y: -1 });
    }

    document.addEventListener('click', handleDocumentClick);
    textarea.focus();

    return () => {
      document.onmousemove = null;
      document.onmouseup = null;
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleMouseDown = (event) => {
    event.preventDefault();
    event.persist();
    const shiftX = event.clientX - textRef.current.offsetLeft;
    const shiftY = event.clientY - textRef.current.offsetTop;

    document.onmousemove = (mouseMoveEvent) => {
      let xPos = mouseMoveEvent.clientX - shiftX;
      let yPos = mouseMoveEvent.clientY - shiftY;
      const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
      if (xPos < canvas.offsetLeft) {
        xPos = canvas.offsetLeft;
      } else if (xPos + textRef.current.offsetWidth > canvasRight) {
        xPos = canvasRight - textRef.current.offsetWidth;
      }

      const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
      if (yPos < canvas.offsetTop) {
        yPos = canvas.offsetTop;
      } else if (yPos + textRef.current.offsetHeight > canvasBottom) {
        yPos = canvasBottom - textRef.current.offsetHeight;
      }

      setStyle((prevStyle) => ({
        ...prevStyle,
        left: `${xPos}px`,
        top: `${yPos}px`,
      }));
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  const handleChange = (event) => {
    const context = canvas.getContext('2d');
    const textarea = event.target;
    context.font = window.getComputedStyle(textarea).getPropertyValue('font');

    let rows = 1;
    let currentWidth = 0;
    Array.from(textarea.value).forEach((char) => {
      if (char === '\n') {
        rows++;
        currentWidth = 0;
        return;
      }

      if (currentWidth + context.measureText(char).width > textarea.offsetWidth) {
        rows++;
        currentWidth = context.measureText(char).width;
      } else {
        currentWidth += context.measureText(char).width;
      }
    });

    if (rows > Number(textarea.rows)) {
      const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
      const topWithBorder = textRef.current.offsetTop + 2 * textRef.current.clientTop;
      let blockHeight = '';
      if (topWithBorder + rows * rowHeight > canvasBottom) {
        const height = canvasBottom - topWithBorder;
        rows = Math.floor(height / rowHeight);
        blockHeight = `${height}px`;
      }

      setStyle((prevStyle) => ({
        ...prevStyle,
        height: blockHeight,
      }));

      textarea.rows = rows;
    }
  };

  useEffect(() => {
    if (textRef.current.offsetLeft >= 0) {
      setIsPositioned(true);
    }
  }, [textRef.current]);

  let resizers = [];
  if (isPositioned) {
    const positions = [
      'top',
      'top-right',
      'right',
      'bottom-right',
      'bottom',
      'bottom-left',
      'left',
      'top-left',
    ];

    resizers = positions.map((position) => (
      <Resizer
        key={position}
        position={position}
        boxMeasurements={getElementMeasurements(textRef.current)}
        setStyle={setStyle}
        heightLowerBound={25}
        widthLowerBound={25}
      />
    ));
  }

  return (
    <div
      className="text-block"
      style={style}
      ref={textRef}
      onMouseDown={handleMouseDown}
    >
      {isPositioned && resizers}
      <textarea
        rows="1"
        cols="7"
        style={{ color: config.drawing.color }}
        onMouseDown={(event) => { event.stopPropagation(); }}
        onChange={handleChange}
      />
    </div>
  );
}

export default TextBlock;
