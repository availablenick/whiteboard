function resize(event, measurements, setStyle, heightLowerBound) {
  const canvas = document.getElementById('canvas');
  if (event.type === 'mousemove') {
    const offsetBottom = measurements.offsetTop + measurements.offsetHeight;
    const oldHeight = measurements.offsetHeight;
    let newHeight = event.clientY - measurements.offsetTop;
    if (newHeight < heightLowerBound) {
      newHeight = heightLowerBound;
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
      newStyle.top = `${measurements.offsetTop}px`;
      newStyle.height = `${newHeight}px`;
      return newStyle;
    });
  }
}

export default resize;
