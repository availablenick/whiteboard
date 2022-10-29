import React, { useState, useEffect, useRef } from 'react';
import { adjustToCanvasLeft, adjustToCanvasTop, drawText } from './helpers';
import createCanvasChangeEvent from '../../global/helpers';
import behaviors from '../resizing';
import './TextBlock.scss';
import '../resizing.scss';

let rowHeight = 0;
const removal = {
  shouldRemove: true,
  target: null,
};

function TextBlock({ config, x, y, setTextState }) {
  const canvas = document.getElementById('canvas');
  const textRef = useRef(null);
  const initialStyle = {
    left: '-500px',
    top: '-500px',
  };

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
      if (removal.shouldRemove) {
        setTextState({
          isWriting: false,
          x: -1,
          y: -1,
        });
      } else {
        const newEvent = new MouseEvent('mouseup');
        removal.target.dispatchEvent(newEvent);
      }
    }

    document.addEventListener('click', handleDocumentClick);
    textarea.focus();

    return () => {
      document.onmousemove = null;
      document.onmouseup = null;
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleClick = (event) => {
    if (event.target !== removal.target && removal.target !== null) {
      const newEvent = new MouseEvent('mouseup');
      removal.target.dispatchEvent(newEvent);
    }
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    event.persist();
    const shiftX = event.clientX - textRef.current.offsetLeft;
    const shiftY = event.clientY - textRef.current.offsetTop;
    removal.shouldRemove = false;
    removal.target = textRef.current;

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
      removal.shouldRemove = true;
      removal.target = null;
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

  const points = positions.map((item) => {
    function resMouseDown(event) {
      event.preventDefault();
      event.persist();
      event.stopPropagation();
      removal.shouldRemove = false;
      removal.target = event.target;

      document.onmousemove = (mouseMoveEvent) => {
        behaviors[item](mouseMoveEvent, textRef.current, setStyle, { height: 25, width: 25 });
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        setStyle({
          bottom: '',
          height: textRef.current.offsetHeight,
          left: `${textRef.current.offsetLeft}px`,
          right: '',
          top: `${textRef.current.offsetTop}px`,
          width: `${textRef.current.offsetWidth}px`,
        });

        const textarea = textRef.current.getElementsByTagName('textarea')[0];
        let newRowsNumber = textarea.offsetHeight / rowHeight;
        if (newRowsNumber < 1) {
          newRowsNumber = 1;
        }

        textarea.rows = newRowsNumber;
        removal.shouldRemove = true;
        removal.target = null;
      };
    }

    return (
      <div
        key={item}
        className={`res ${item}`}
        onMouseDown={resMouseDown}
      />
    );
  });

  return (
    <div
      className="text-block resizable"
      style={style}
      ref={textRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {points}
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
