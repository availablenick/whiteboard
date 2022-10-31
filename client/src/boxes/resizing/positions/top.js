function resize(event, measurements, setStyle, heightLowerBound) {
  const canvas = document.getElementById('canvas');
  const offsetBottom = measurements.offsetTop + measurements.offsetHeight;
  const oldHeight = measurements.offsetHeight;
  let newHeight = offsetBottom - event.clientY;
  if (newHeight < heightLowerBound) {
    newHeight = heightLowerBound;
  }

  const heightDifference = newHeight - oldHeight;
  if (measurements.offsetTop - heightDifference < canvas.offsetTop) {
    newHeight = measurements.offsetTop - canvas.offsetTop + oldHeight;
  }

  setStyle((prevStyle) => {
    const newStyle = {};
    Object.keys(prevStyle).forEach((key) => {
      newStyle[key] = prevStyle[key];
    });

    const elementBottom = measurements.offsetTop + measurements.offsetHeight;
    newStyle.bottom = `${window.innerHeight - elementBottom}px`;
    newStyle.top = '';
    newStyle.height = `${newHeight}px`;
    return newStyle;
  });
}

export default resize;
