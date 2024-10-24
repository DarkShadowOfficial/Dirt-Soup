function displayCS(cS, xmin, ymin, xmax, ymax, step = 1) {
  let plane = "";
  For(
    (y) => {
      For(
        (x) => {
          plane += cs.getCoordinateData(cS, tuple(x, y)) + "  ";
        },
        xmin,
        xmax+step,
        step
      );
      plane += "\n";
    },
    ymin,
    ymax+step,
    step
  );
  return plane;
}
