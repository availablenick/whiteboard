const getQuadrant = (p, q) => {
  if (q.x >= p.x && q.y < p.y) {
    return 1;
  }

  if (q.x < p.x && q.y < p.y) {
    return 2;
  }

  if (q.x < p.x && q.y >= p.y) {
    return 3;
  }

  return 4;
};

const calculateAngle = (p, q) => {
  if (p.x === q.x) {
    if (q.y < p.y) {
      return -90;
    }

    return 90;
  }

  if (p.y === q.y) {
    if (q.x < p.x) {
      return -180;
    }

    return 0;
  }

  const slope = (q.y - p.y) / (q.x - p.x);
  const angle = (Math.atan(slope) * 180) / Math.PI;
  const quadrant = getQuadrant(p, q);
  if (quadrant === 2 || quadrant === 3) {
    return -(180 - angle);
  }

  return angle;
};

const calculateDistance = (p, q) => (
  Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y))
);

export {
  getQuadrant,
  calculateAngle,
  calculateDistance,
};
