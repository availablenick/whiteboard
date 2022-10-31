function resize(event, measurements, setStyle, widthLowerBound) {
  const canvas = document.getElementById('canvas');
  if (event.type === 'mousemove') {
    const offsetRight = measurements.offsetLeft + measurements.offsetWidth;
    const oldWidth = measurements.offsetWidth;
    let newWidth = event.clientX - measurements.offsetLeft;
    if (newWidth < widthLowerBound) {
      newWidth = widthLowerBound;
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

      newStyle.left = `${measurements.offsetLeft}px`;
      newStyle.right = '';
      newStyle.width = `${newWidth}px`;
      return newStyle;
    });
  }
}

export default resize;
