const clearer = {
  getIcon() {
    return ['fas', 'broom'];
  },
	executeAction(event) {
    event.stopPropagation();
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
	},
};

export default clearer;
