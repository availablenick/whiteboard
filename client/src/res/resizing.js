const behaviors = {
  top: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    const offsetBottom = element.offsetTop + element.offsetHeight;
    const oldHeight = element.offsetHeight;
    let newHeight = offsetBottom - event.clientY;
    if (newHeight < bound.height) {
      newHeight = bound.height;
    }

    const heightDifference = newHeight - oldHeight;
    if (element.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = element.offsetTop - canvas.offsetTop + oldHeight;
    }

    setStyle((prevStyle) => {
      const newStyle = {};
      Object.keys(prevStyle).forEach((key) => {
        newStyle[key] = prevStyle[key];
      });

      const elementBottom = element.offsetTop + element.offsetHeight;
      newStyle.bottom = `${window.innerHeight - elementBottom}px`;
      newStyle.top = '';
      newStyle.height = `${newHeight}px`;
      return newStyle;
    });
  },

  'top-right': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    const offsetBottom = element.offsetTop + element.offsetHeight;
    const oldHeight = element.offsetHeight;
    let newHeight = offsetBottom - event.clientY;
    if (newHeight < bound.height) {
      newHeight = bound.height;
    }

    const heightDifference = newHeight - oldHeight;
    if (element.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = element.offsetTop - canvas.offsetTop + oldHeight;
    }

    const offsetRight = element.offsetLeft + element.offsetWidth;
    const oldWidth = element.offsetWidth;
    let newWidth = event.clientX - element.offsetLeft;
    if (newWidth < bound.width) {
      newWidth = bound.width;
    }

    const widthDifference = newWidth - oldWidth;
    const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
    if (offsetRight + widthDifference > canvasRight) {
      newWidth = oldWidth + canvasRight - offsetRight;
    }

    setStyle((prevStyle) => {
      const newStyle = {};
      Object.keys(prevStyle).forEach((key) => {
        newStyle[key] = prevStyle[key];
      });

      const elementBottom = element.offsetTop + element.offsetHeight;
      newStyle.bottom = `${window.innerHeight - elementBottom}px`;
      newStyle.left = `${element.offsetLeft}px`;
      newStyle.right = '';
      newStyle.top = '';
      newStyle.height = `${newHeight}px`;
      newStyle.width = `${newWidth}px`;
      return newStyle;
    });
  },

  right: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    if (event.type === 'mousemove') {
      const offsetRight = element.offsetLeft + element.offsetWidth;
      const oldWidth = element.offsetWidth;
      let newWidth = event.clientX - element.offsetLeft;
      if (newWidth < bound.width) {
        newWidth = bound.width;
      }

      const widthDifference = newWidth - oldWidth;
      const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
      if (offsetRight + widthDifference > canvasRight) {
        newWidth = oldWidth + canvasRight - offsetRight;
      }

      setStyle((prevStyle) => {
        const newStyle = {};
        Object.keys(prevStyle).forEach((key) => {
          newStyle[key] = prevStyle[key];
        });

        newStyle.left = `${element.offsetLeft}px`;
        newStyle.right = '';
        newStyle.width = `${newWidth}px`;
        return newStyle;
      });
    }
  },

  'bottom-right': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    if (event.type === 'mousemove') {
      const offsetBottom = element.offsetTop + element.offsetHeight;
      const oldHeight = element.offsetHeight;
      let newHeight = event.clientY - element.offsetTop;
      if (newHeight < bound.height) {
        newHeight = bound.height;
      }

      const heightDifference = newHeight - oldHeight;
      const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
      if (offsetBottom + heightDifference > canvasBottom) {
        newHeight = oldHeight + canvasBottom - offsetBottom;
      }

      const offsetRight = element.offsetLeft + element.offsetWidth;
      const oldWidth = element.offsetWidth;
      let newWidth = event.clientX - element.offsetLeft;
      if (newWidth < bound.width) {
        newWidth = bound.width;
      }

      const widthDifference = newWidth - oldWidth;
      const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
      if (offsetRight + widthDifference > canvasRight) {
        newWidth = oldWidth + canvasRight - offsetRight;
      }

      setStyle((prevStyle) => {
        const newStyle = {};
        Object.keys(prevStyle).forEach((key) => {
          newStyle[key] = prevStyle[key];
        });

        newStyle.bottom = '';
        newStyle.left = `${element.offsetLeft}px`;
        newStyle.right = '';
        newStyle.top = `${element.offsetTop}px`;
        newStyle.height = `${newHeight}px`;
        newStyle.width = `${newWidth}px`;
        return newStyle;
      });
    }
  },

  bottom: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    if (event.type === 'mousemove') {
      const offsetBottom = element.offsetTop + element.offsetHeight;
      const oldHeight = element.offsetHeight;
      let newHeight = event.clientY - element.offsetTop;
      if (newHeight < bound.height) {
        newHeight = bound.height;
      }

      const heightDifference = newHeight - oldHeight;
      const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
      if (offsetBottom + heightDifference > canvasBottom) {
        newHeight = oldHeight + canvasBottom - offsetBottom;
      }

      setStyle((prevStyle) => {
        const newStyle = {};
        Object.keys(prevStyle).forEach((key) => {
          newStyle[key] = prevStyle[key];
        });

        newStyle.bottom = '';
        newStyle.top = `${element.offsetTop}px`;
        newStyle.height = `${newHeight}px`;
        return newStyle;
      });
    }
  },

  'bottom-left': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    const offsetBottom = element.offsetTop + element.offsetHeight;
    const oldHeight = element.offsetHeight;
    let newHeight = event.clientY - element.offsetTop;
    if (newHeight < bound.height) {
      newHeight = bound.height;
    }

    const heightDifference = newHeight - oldHeight;
    const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
    if (offsetBottom + heightDifference > canvasBottom) {
      newHeight = oldHeight + canvasBottom - offsetBottom;
    }

    const offsetRight = element.offsetLeft + element.offsetWidth;
    const oldWidth = element.offsetWidth;
    let newWidth = offsetRight - event.clientX;
    if (newWidth < bound.width) {
      newWidth = bound.width;
    }

    const widthDifference = newWidth - oldWidth;
    if (element.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = element.offsetLeft - canvas.offsetLeft + oldWidth;
    }

    setStyle((prevStyle) => {
      const newStyle = {};
      Object.keys(prevStyle).forEach((key) => {
        newStyle[key] = prevStyle[key];
      });

      const elementRight = element.offsetLeft + element.offsetWidth;
      newStyle.bottom = '';
      newStyle.left = '';
      newStyle.right = `${window.innerWidth - elementRight}px`;
      newStyle.top = `${element.offsetTop}px`;
      newStyle.height = `${newHeight}px`;
      newStyle.width = `${newWidth}px`;
      return newStyle;
    });
  },

  left: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    const offsetRight = element.offsetLeft + element.offsetWidth;
    const oldWidth = element.offsetWidth;
    let newWidth = offsetRight - event.clientX;
    if (newWidth < bound.width) {
      newWidth = bound.width;
    }

    const widthDifference = newWidth - oldWidth;
    if (element.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = element.offsetLeft - canvas.offsetLeft + oldWidth;
    }

    setStyle((prevStyle) => {
      const newStyle = {};
      Object.keys(prevStyle).forEach((key) => {
        newStyle[key] = prevStyle[key];
      });

      const elementRight = element.offsetLeft + element.offsetWidth;
      newStyle.left = '';
      newStyle.right = `${window.innerWidth - elementRight}px`;
      newStyle.width = `${newWidth}px`;
      return newStyle;
    });
  },

  'top-left': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas');
    const offsetBottom = element.offsetTop + element.offsetHeight;
    const oldHeight = element.offsetHeight;
    let newHeight = offsetBottom - event.clientY;
    if (newHeight < bound.height) {
      newHeight = bound.height;
    }

    const heightDifference = newHeight - oldHeight;
    if (element.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = element.offsetTop - canvas.offsetTop + oldHeight;
    }

    const offsetRight = element.offsetLeft + element.offsetWidth;
    const oldWidth = element.offsetWidth;
    let newWidth = offsetRight - event.clientX;
    if (newWidth < bound.width) {
      newWidth = bound.width;
    }

    const widthDifference = newWidth - oldWidth;
    if (element.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = element.offsetLeft - canvas.offsetLeft + oldWidth;
    }

    setStyle((prevStyle) => {
      const newStyle = {};
      Object.keys(prevStyle).forEach((key) => {
        newStyle[key] = prevStyle[key];
      });

      const elementBottom = element.offsetTop + element.offsetHeight;
      const elementRight = element.offsetLeft + element.offsetWidth;
      newStyle.bottom = `${window.innerHeight - elementBottom}px`;
      newStyle.left = '';
      newStyle.right = `${window.innerWidth - elementRight}px`;
      newStyle.top = '';
      newStyle.height = `${newHeight}px`;
      newStyle.width = `${newWidth}px`;
      return newStyle;
    });
  },
};

export default behaviors;
