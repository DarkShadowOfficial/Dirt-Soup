Import("CoordinateSystem", "cs");
Import("Random", null, "randint");
function getPlane(data, key) {
  let d = data.split("\n");
  let fd = [];
  d.forEach((i) => {
    fd.push(i.replaceAll(" ", ""));
  });
  fd = fd.filter((x) => NOT(x == ""));
  let rows = fd[0].length;
  let columns = fd.length;
  let cS = cs.initialize(0, rows, 0, columns);
  For(
    (x) => {
      For(
        (y) => {
          cs.setCoordinateData(cS, tuple(y, x), key[fd[y].charAt(x)]);
        },
        0,
        columns
      );
    },
    0,
    rows
  );
  return cS;
}
function displayPlane(cS, xmin, ymin, xmax, ymax, step = 1) {
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
function generatePlane(w, h) {
  let plane = "";
  For(
    (x) => {
      For(
        (y) => {
          plane += randint(0, 9) + " ";
        },
        0,
        h
      );
      plane += "\n";
    },
    0,
    w
  );
  return plane;
}
let default_key = {};
For(
  (i) => {
    default_key[str(i)] = i;
  },
  0,
  10
);
let my_plane = generatePlane(5, 5);
let system = getPlane(my_plane, default_key);
print(displayPlane(system, 5, 5));
