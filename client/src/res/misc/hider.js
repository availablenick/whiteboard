const hider = {
  setIsSidebarVisible: () => {},
  getIcon() {
    return ['fas', 'arrow-left'];
  },
  executeAction(event) {
    event.stopPropagation();
    this.setIsSidebarVisible(false);
  },
};

export default hider;
