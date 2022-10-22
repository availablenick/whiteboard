const circle = {
  setShapeState: () => {},
  getIcon() {
    return ['far', 'circle'];
  },
  getCursor() {
    return 'crosshair';
  },
  executeAction(event)  {
    const LEFT_BUTTON = 1;
    if (event.type === 'mousemove' && event.buttons === LEFT_BUTTON) {
      event.persist();
      this.setShapeState((prevState) => {
        if (prevState.isShaping) {
          return prevState;
        }

        return {
          isShaping: true,
          shape: 'circle',
          x: event.clientX,
          y: event.clientY,
        };
      });
    }
  },
};

export default circle;
