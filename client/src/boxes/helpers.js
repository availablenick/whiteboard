function getElementMeasurements(element) {
  if (element) {
    return {
      offsetHeight: element.offsetHeight,
      offsetLeft: element.offsetLeft,
      offsetTop: element.offsetTop,
      offsetWidth: element.offsetWidth,
    };
  }

  return {
    offsetHeight: 0,
    offsetLeft: 0,
    offsetTop: 0,
    offsetWidth: 0,
  };
}

export default getElementMeasurements;
