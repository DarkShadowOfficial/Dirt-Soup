function displayCS(cS, w, h) {
  let plane = "";
  For(
    (x) => {
      For(
        (y) => {
          plane += cs.getCoordinateData(cS, tuple(x, y)) + "  ";
        },
        0,
        w
      );
      plane += "\n";
    },
    0,
    h
  );
  return plane;
}
