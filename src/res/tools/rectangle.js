const rectangle = {
  setShapeState: () => {},
  getIcon() {
    return ['far', 'square'];
  },
  getCursor() {
    return 'crosshair';
  },
  executeAction(event) {
    const LEFT_BUTTON = 1;
    if (event.type === 'mousemove' && event.buttons === LEFT_BUTTON) {
      event.persist();
      this.setShapeState((prevState) => {
        if (prevState.isShaping) {
          return prevState;
        }

        return {
          isShaping: true,
          shape: 'rectangle',
          x: event.clientX,
          y: event.clientY,
        };
      });
    }
  },
};

export default rectangle;
