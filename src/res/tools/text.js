const text = {
  setTextState: () => {},
  getIcon() {
    return ['fas', 'font'];
  },
  getCursor() {
    return 'text';
  },
  executeAction (event) {
    if (event.type === 'click') {
      this.setTextState({
        isWriting: true,
        x: event.clientX,
        y: event.clientY,
      });
    }
  },
};

export default text;
