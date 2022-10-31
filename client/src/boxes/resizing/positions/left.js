function resize(event, measurements, setStyle, widthLowerBound) {
  const canvas = document.getElementById('canvas');
  const offsetRight = measurements.offsetLeft + measurements.offsetWidth;
  const oldWidth = measurements.offsetWidth;
  let newWidth = offsetRight - event.clientX;
  if (newWidth < widthLowerBound) {
    newWidth = widthLowerBound;
  }

  const widthDifference = newWidth - oldWidth;
  if (measurements.offsetLeft - widthDifference < canvas.offsetLeft) {
    newWidth = measurements.offsetLeft - canvas.offsetLeft + oldWidth;
  }

  setStyle((prevStyle) => {
    const newStyle = {};
    Object.keys(prevStyle).forEach((key) => {
      newStyle[key] = prevStyle[key];
    });

    const elementRight = measurements.offsetLeft + measurements.offsetWidth;
    newStyle.left = '';
    newStyle.right = `${window.innerWidth - elementRight}px`;
    newStyle.width = `${newWidth}px`;
    return newStyle;
  });
}

export default resize;
