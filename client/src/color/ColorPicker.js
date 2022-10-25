import React, {
  useState, useEffect, useRef, forwardRef,
} from 'react';
import {
  getSelectorColorFromPos,
  getSelectorPosFromColor,
  getSliderColorFromPos,
  getSliderColorFromSelectorColor,
  getSliderPosFromColor,
} from './helpers';

import './ColorPicker.scss';

const ColorPicker = forwardRef((props, ref) => {
  const lightChangerRef = useRef(null);
  const selectorRef = useRef(null);
  const alphaSliderRef = useRef(null);
  const alphaChangerRef = useRef(null);
  const colorChangerRef = useRef(null);
  const colorSliderRef = useRef(null);

  const [selectorStyle, setSelectorStyle] = useState({});
  const [alphaSliderStyle, setAlphaSliderStyle] = useState({});
  const [colorSliderStyle, setColorSliderStyle] = useState({});
  const [selectorColor, setSelectorColor] = useState(props.config[props.type].color);
  const [sliderColor, setSliderColor] = useState(
    getSliderColorFromSelectorColor(props.config[props.type].color),
  );

  useEffect(() => {
    const [selectorX, selectorY] = getSelectorPosFromColor(props.config[props.type].color);
    const colorSliderY = getSliderPosFromColor(
      getSliderColorFromSelectorColor(props.config[props.type].color),
    );

    const selectorLeft = lightChangerRef.current.offsetWidth * selectorX
      - selectorRef.current.offsetWidth / 2;

    const selectorTop = lightChangerRef.current.offsetHeight * selectorY
      - selectorRef.current.offsetHeight / 2;

    const m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(props.config[props.type].color);
    let alphaSliderTop = 0;
    if (m[4]) {
      let alpha = Number(m[5]);
      if (m[6]) {
        alpha = Number(m[5] + m[6]);
      }

      alphaSliderTop = alphaChangerRef.current.offsetHeight * (1 - alpha);
    }

    const colorSliderTop = colorChangerRef.current.offsetHeight * colorSliderY;

    setSelectorStyle({
      left: `${selectorLeft}px`,
      top: `${selectorTop}px`,
    });

    setAlphaSliderStyle({
      top: `${alphaSliderTop}px`,
    });

    setColorSliderStyle({
      top: `${colorSliderTop}px`,
    });

    const lightChanger = lightChangerRef.current;
    const selector = selectorRef.current;
    const alphaChanger = alphaChangerRef.current;
    const alphaSlider = alphaSliderRef.current;
    const colorChanger = colorChangerRef.current;
    const colorSlider = colorSliderRef.current;

    return () => {
      document.onmousemove = null;
      document.onmouseup = null;

      const colorSliderYTotal = colorSlider.offsetTop / colorChanger.offsetHeight;
      const finalSliderColor = getSliderColorFromPos(colorSliderYTotal);
      const x = selector.offsetLeft + selector.offsetWidth / 2;
      const y = selector.offsetTop + selector.offsetHeight / 2;
      const xTotal = x / lightChanger.offsetWidth;
      const yTotal = y / lightChanger.offsetHeight;
      const [r, g, b] = getSelectorColorFromPos(xTotal, yTotal, finalSliderColor);
      let color = `rgb(${r}, ${g}, ${b})`;
      let alpha = 1 - alphaSlider.offsetTop / alphaChanger.offsetHeight;
      alpha = Math.floor(alpha * 1000) / 1000;
      if (alpha < 1) {
        color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      props.setConfig((prevConfig) => ({
        ...prevConfig,
        [props.type]: { color },
      }));
    };
  }, []);

  useEffect(() => {
    const x = selectorRef.current.offsetLeft + selectorRef.current.offsetWidth / 2;
    const y = selectorRef.current.offsetTop + selectorRef.current.offsetHeight / 2;
    const xTotal = x / lightChangerRef.current.offsetWidth;
    const yTotal = y / lightChangerRef.current.offsetHeight;
    const [r, g, b] = getSelectorColorFromPos(xTotal, yTotal, sliderColor);
    let color = `rgb(${r}, ${g}, ${b})`;
    let alpha = 1 - alphaSliderRef.current.offsetTop / alphaChangerRef.current.offsetHeight;
    alpha = Math.floor(alpha * 1000) / 1000;
    if (alpha < 1) {
      color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    setSelectorColor(color);
  }, [selectorStyle, sliderColor, alphaSliderStyle]);

  useEffect(() => {
    const yTotal = colorSliderRef.current.offsetTop / colorChangerRef.current.offsetHeight;
    const color = getSliderColorFromPos(yTotal);
    setSliderColor(color);
  }, [colorSliderStyle]);

  function getSelectorCoords(event) {
    const selector = selectorRef.current;
    const lightChangerRect = lightChangerRef.current.getBoundingClientRect();
    const halfWidth = selector.offsetWidth / 2;
    const halfHeight = selector.offsetHeight / 2;
    let left = event.clientX - halfWidth - lightChangerRect.left;
    let top = event.clientY - halfHeight - lightChangerRect.top;
    if (left < -halfWidth) {
      left = -halfWidth;
    } else if (left + selector.offsetWidth > lightChangerRect.width + halfWidth) {
      left = lightChangerRect.width + halfWidth - selector.offsetWidth;
    }

    if (top < -halfHeight) {
      top = -halfHeight;
    } else if (top + selector.offsetHeight > lightChangerRect.height + halfHeight) {
      top = lightChangerRect.height + halfHeight - selector.offsetHeight;
    }

    return [left, top];
  }

  const handleLightChangerMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const [left, top] = getSelectorCoords(event);
    setSelectorStyle({
      ...selectorStyle,
      left: `${left}px`,
      top: `${top}px`,
    });

    const newEvent = new MouseEvent('mousedown', { bubbles: true });
    selectorRef.current.dispatchEvent(newEvent);
  };

  const handleSelectorMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    document.onmousemove = (mouseMoveEvent) => {
      const [left, top] = getSelectorCoords(mouseMoveEvent);
      setSelectorStyle({
        ...selectorStyle,
        left: `${left}px`,
        top: `${top}px`,
      });
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  const handleAlphaChangerMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const alphaChangerRect = alphaChangerRef.current.getBoundingClientRect();
    let top = event.clientY - (alphaSliderRef.current.offsetHeight / 2)
      - alphaChangerRect.top;

    if (top < 0) {
      top = 0;
    } else if (top > alphaChangerRect.height) {
      top = alphaChangerRect.height;
    }

    setAlphaSliderStyle((prevAlphaSliderStyle) => ({
      ...prevAlphaSliderStyle,
      top: `${top}px`,
    }));

    const newEvent = new MouseEvent('mousedown', { bubbles: true });
    alphaSliderRef.current.dispatchEvent(newEvent);
  };

  const handleAlphaSliderMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const alphaChangerRect = alphaChangerRef.current.getBoundingClientRect();
    setAlphaSliderStyle((prevAlphaSliderStyle) => ({
      ...prevAlphaSliderStyle,
      cursor: 'grabbing',
    }));

    document.onmousemove = (mouseMoveEvent) => {
      let top = mouseMoveEvent.clientY - alphaChangerRect.top;
      if (top < 0) {
        top = 0;
      } else if (top > alphaChangerRect.height) {
        top = alphaChangerRect.height;
      }

      setAlphaSliderStyle((prevAlphaSliderStyle) => ({
        ...prevAlphaSliderStyle,
        top: `${top}px`,
      }));
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      setAlphaSliderStyle((prevAlphaSliderStyle) => ({
        ...prevAlphaSliderStyle,
        cursor: 'grab',
      }));
    };
  };

  const handleColorChangerMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const colorChangerRect = colorChangerRef.current.getBoundingClientRect();
    let top = event.clientY - (colorSliderRef.current.offsetHeight / 2) - colorChangerRect.top;
    if (top < 0) {
      top = 0;
    } else if (top > colorChangerRect.height) {
      top = colorChangerRect.height;
    }

    setColorSliderStyle((prevColorSliderStyle) => ({
      ...prevColorSliderStyle,
      top: `${top}px`,
    }));

    const newEvent = new MouseEvent('mousedown', { bubbles: true });
    colorSliderRef.current.dispatchEvent(newEvent);
  };

  const handleColorSliderMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const colorChangerRect = colorChangerRef.current.getBoundingClientRect();
    setColorSliderStyle((prevColorSliderStyle) => ({
      ...prevColorSliderStyle,
      cursor: 'grabbing',
    }));

    document.onmousemove = (mouseMoveEvent) => {
      let top = mouseMoveEvent.clientY - colorChangerRect.top;
      if (top < 0) {
        top = 0;
      } else if (top > colorChangerRect.height) {
        top = colorChangerRect.height;
      }

      setColorSliderStyle((prevColorSliderStyle) => ({
        ...prevColorSliderStyle,
        top: `${top}px`,
      }));
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      setColorSliderStyle((prevColorSliderStyle) => ({
        ...prevColorSliderStyle,
        cursor: 'grab',
      }));
    };
  };

  let viewerTextColor = 'black';
  const m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(selectorColor);
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (r + g + b < 128 * 3) {
    viewerTextColor = 'white';
  }

  const rgbSelector = `rgb(${r}, ${g}, ${b})`;
  const lightChangerBg = 'linear-gradient(to bottom, transparent, black), '
    + `linear-gradient(to right, white, ${sliderColor})`;

  const alphaChangerBg = `linear-gradient(${rgbSelector}, transparent), `
    + 'linear-gradient(45deg, #555 25%, transparent 25%), '
    + 'linear-gradient(45deg, #555 25%, transparent 25%), '
    + 'linear-gradient(45deg, transparent 75%, #555 75%), '
    + 'linear-gradient(45deg, transparent 75%, #555 75%)';

  return (
    <div
      className="color-picker d-flex flex-column position-absolute p-3"
      ref={ref}
    >
      <div
        className="viewer d-flex align-items-center justify-content-center"
        style={{ background: selectorColor, color: viewerTextColor }}
      >
        {selectorColor}
      </div>

      <div className="bottom d-flex mt-2">
        <div
          className="light-changer d-flex position-relative overflow-hidden"
          style={{ background: lightChangerBg }}
          ref={lightChangerRef}
          onMouseDown={handleLightChangerMouseDown}
        >

          <div
            className="selector d-inline-block position-absolute"
            style={selectorStyle}
            ref={selectorRef}
            onMouseDown={handleSelectorMouseDown}
          />
        </div>

        <div
          className="alpha-changer d-flex position-relative ml-3"
          ref={alphaChangerRef}
          style={{
            backgroundImage: alphaChangerBg,
            backgroundPosition: 'center, 0 0, 0.25em 0.25em, 0.25em 0.25em, 0 0',
            backgroundSize: 'auto, 0.5em 0.5em, 0.5em 0.5em, 0.5em 0.5em, 0.5em 0.5em',
            cursor: alphaSliderStyle.cursor,
          }}
          onMouseDown={handleAlphaChangerMouseDown}
        >

          <div
            className="slider d-inline-block position-absolute"
            style={alphaSliderStyle}
            ref={alphaSliderRef}
            onMouseDown={handleAlphaSliderMouseDown}
          />
        </div>

        <div
          className="color-changer d-flex position-relative ml-3"
          ref={colorChangerRef}
          style={{ cursor: colorSliderStyle.cursor }}
          onMouseDown={handleColorChangerMouseDown}
        >

          <div
            className="slider d-inline-block position-absolute"
            style={colorSliderStyle}
            ref={colorSliderRef}
            onMouseDown={handleColorSliderMouseDown}
          />
        </div>
      </div>
    </div>
  );
});

export default ColorPicker;
