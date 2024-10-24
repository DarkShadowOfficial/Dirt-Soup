const init = (varName, value) => {
  globalThis[varName] = value;
};
const print = console.log;
function For(action, start = 0, end, step = 1) {
  for (let i = start; i < end; i += step) {
    action(i);
  }
}
function repeat(action, n) {
  For((i) => action(), 0, n);
}
function iter(action, object) {
  if (type(object) == "object") {
    for (let i of Object.getOwnPropertyNames(object)) {
      action(i);
    }
  } else if (type(object) == "array") {
    object.forEach((x) => action(x));
  }
}
function While(action, statement) {
  do {
    action();
  } while (statement);
}
const XOR = (a, b) => (a || b) && !(a && b);
const OR = (a, b) => a || b;
const AND = (a, b) => a && b;
const NOT = (a) => !a;
const NOR = (a, b) => !OR(a, b);
const type = (item) => {
  if (item.push) {
    try {
      item.push(5);
      item.pop();
    } catch (err) {
      return "tuple";
    }
    return "array";
  } else if (typeof item == "string" && item.length == 1) {
    return "char";
  } else return typeof item;
};
const set = (a) => {
  let arr = [];
  let s = new Set(a).forEach(x => arr.push(x));
  return arr;
};
const str = (a) => JSON.stringify(a);
const int = (a) => {
  switch (type(a)) {
    case "number":
      return floor(a);
    case "string":
      return parseInt(a);
    default:
      throw new TypeError("Cannot parse as int.");
  }
};
const float = (a) => {
  switch (type(a)) {
    case "number":
      return a;
    case "string":
      return parseFloat(a);
    default:
      throw new TypeError("Cannot parse as float.");
  }
};
String.prototype.lower = String.prototype.toLowerCase;
String.prototype.upper = String.prototype.toUpperCase;
const Import = (module, as = module.toLowerCase(), ...imports) => {
  try {
    if (imports.length == 0) {
      init(as, eval(`new (new MODULES().${module})()`));
    } else if (imports[0] == "*") {
      for (let i of Object.getOwnPropertyNames(
        eval(`new (new MODULES().${module})()`)
      )) {
        init(i, eval(`new (new MODULES().${module})()`)[i]);
      }
    } else {
      iter((i) => {
        init(i, eval(`new (new MODULES().${module})().${i}`));
      }, imports);
    }
  } catch (err) {
    throw err instanceof TypeError
      ? new ReferenceError(
          "Module Import Error: Module '" + module + "' not found."
        )
      : new ReferenceError(
          "Methods/Properties " +
            imports +
            " were not found in module '" +
            module +
            "'."
        );
  }
};
class MODULES {
  constructor() {
    class M {
      constructor() {
        let obj = {};
        for (let i of Object.getOwnPropertyNames(Math)) {
          obj[i.toLowerCase()] = Math[i];
        }
        return obj;
      }
    }
    class Random {
      constructor() {
        function randint(min, max) {
          return Math.round(Math.random() * (max - min) + min);
        }
        function randfloat(min, max) {
          return Math.random() * (max - min) + min;
        }
        return {
          randint: randint,
          randfloat: randfloat,
          rand: Math.random,
        };
      }
    }
    class HtmlGUI {
      constructor() {
        let html = document.createElement("div");
        function title() {
          let p = document.createElement("title");
          p.content = (content) => {
            p.innerHTML = content;
          };
          p.load = () => html.appendChild(p);
          return p;
        }
        function text() {
          let p = document.createElement("p");
          p.content = (content) => (p.innerHTML = content);
          p.load = () => html.appendChild(p);
          return p;
        }
        function header(importance = 1) {
          let h = document.createElement("h" + importance);
          h.content = (content) => (h.innerHTML = content);
          h.load = () => html.appendChild(h);
          return h;
        }
        function input() {
          let p = document.createElement("input");
          p.mode = (mode) => (p.type = mode);
          p.get = () => p.value;
          p.load = () => html.appendChild(p);
          return p;
        }
        function button(func) {
          let p = document.createElement("button");
          p.onclick = func;
          p.content = (content) => (p.innerHTML = content);
          // p.function = (func) => (p.onclick = func);
          p.load = () => html.appendChild(p);
          return p;
        }
        function run() {
          let w = window.open("about:blank");
          w.document.write(html.innerHTML);
        }
        return {
          text: text,
          header: header,
          title: title,
          input: input,
          button: button,
          run: run,
        };
      }
    }
    class Stats {
      constructor() {
        function mean(array) {
          let x = 0;
          iter((i) => (x += i), array);
          return x / array.length;
        }
        function geometric_mean(array) {
          let x = 1;
          iter((i) => (x *= i), array);
          return x ** (1 / array.length);
        }
        function stdev(array) {
          let x = mean(array);
          let s = 0;
          iter((i) => (s += (i - x) ** 2), array);
          return (s / (array.length - 1)) ** 0.5;
        }
        function sterr(array) {
          return stdev(array) / array.length ** 0.5;
        }
        function CI95(array) {
          let x = mean(array);
          let err = sterr(array);
          return { min: x - 2 * err, max: x + 2 * err };
        }
        function CI68(array) {
          let x = mean(array);
          let err = sterr(array);
          return { min: x - err, max: x + err };
        }
        function CI99(array) {
          let x = mean(array);
          let err = sterr(array);
          return { min: x - 3 * err, max: x + 3 * err };
        }
        return {
          mean: mean,
          geoMean: geometric_mean,
          stdev: stdev,
          sterr: sterr,
          CI: { 68: CI68, 95: CI95, 99: CI99 },
        };
      }
    }
    class CoordinateSystem {
      constructor() {
        function i(x_min, x_max, y_min, y_max, step = 1) {
          let coordinates = {};
          For(
            (x) => {
              For(
                (y) => {
                  let X = Math.round(x / step) * step;
                  let Y = Math.round(y / step) * step;
                  coordinates[tuple(X, Y)] = tuple(X, Y);
                },
                y_min,
                y_max + step,
                step
              );
            },
            x_min,
            x_max + step,
            step
          );
          return coordinates;
        }
        function gcd(coordinateSystem, coords) {
          let coordinates = coordinateSystem;
          if (type(coords) == "tuple") {
            return coordinates[coords];
          } else {
            throw new TypeError(
              "Coordinate Error: Target coordinates must be of type 'tuple'. Entered coordinates were of type '" +
                type(coords) +
                "'."
            );
          }
        }
        function scd(coordinateSystem, coords, data) {
          let coordinates = coordinateSystem;
          if (type(coords) == "tuple") {
            coordinates[coords] = data;
          } else {
            throw new TypeError(
              "Coordinate Error: Target coordinates must be of type 'tuple'. Entered coordinates were of type '" +
                type(coords) +
                "'."
            );
          }
        }
        return {
          initialize: i,
          getCoordinateData: gcd,
          setCoordinateData: scd
        };
      }
    }
    class fs {
      constructor() {
        let textFile = null;
        const makeTextFile = function (text) {
          let data = new Blob([text], { type: "text/plain" });
          if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
          }
          textFile = window.URL.createObjectURL(data);
          return textFile;
        };
        let f;
        let d;
        function append(data) {
          d += data;
          f = makeTextFile(d);
        }
        function write(data) {
          f = makeTextFile(data);
          d = data;
        }
        function read() {
          return d;
        }
        let w;
        function open() {
          w = window.open(f);
        }
        function close() {
          w.close();
          f = null;
          d = null;
        }
        return {
          open: open,
          read: read,
          append: append,
          write: write,
          close: close,
        };
      }
    }
    class Time {
      constructor() {
        function sleep(seconds) {
          setTimeout(void 0, seconds * 1000);
        }
        return {
          sleep: sleep,
        };
      }
    }
    class Turtle {
      constructor() {
        let html =
          "<canvas></canvas><script>let canvas = document.querySelector('canvas'); let ctx = canvas.getContext('2d');";
        let win = window.open("about:blank");
        let width;
        let height;
        function screen(w = 500, h = 300, color) {
          width = w;
          height = h;
          html += `canvas.width = ${w};
          canvas.height = ${h};
          ctx.fillStyle = "${color}";
          ctx.fillRect(0, 0, ${w}, ${h});`;
        }
        function clear() {
          html += `ctx.clearRect(0, 0, ${width}, ${height})`;
        }
        function circle(x, y, rad, color) {
          html += `ctx.beginPath(); ctx.fillStyle = '${color}'; ctx.arc(${x}, ${y}, ${rad}, 0, Math.PI*2); ctx.fill();`;
        }
        function rect(x, y, w, h, color) {
          html += `ctx.fillStyle = '${color}'; ctx.fillRect(${x - w / 2}, ${
            y - h / 2
          }, ${w}, ${h});`;
        }
        function square(x, y, size, color) {
          html += `ctx.fillStyle = '${color}'; ctx.fillRect(${x - size / 2}, ${
            y - size / 2
          }, ${size}, ${size});`;
        }
        function load() {
          win.document.write(html + "</script>");
        }
        return {
          screen: screen,
          load: load,
          circle: circle,
          clear: clear,
          rect: rect,
          square: square,
        };
      }
    }
    class Keyboard {
      constructor() {
        let l;
        let pinged = false;
        let lastKey = "";
        let win = open("about:blank");
        function listen(response_function, ...keys) {
          if (keys.length > 0) {
            if (type(keys[0])) keys = keys[0];
            l = win.document.body.addEventListener("keydown", (e) => {
              if (keys.indexOf(e.key) > -1) {
                lastKey = e.key;
                pinged = true;
                response_function();
              }
            });
          } else {
            l = win.document.body.addEventListener("keydown", (e) => {
              lastKey = e.key;
              pinged = true;
              response_function();
            });
          }
          addEventListener("keyup", () => {
            pinged = false;
          });
        }
        function lkp() {
          return lastKey;
        }
        function stopListen() {
          win.document.body.removeEventListener(l);
        }
        return {
          listen: listen,
          stopListening: stopListen,
          lastKeyPressed: lkp,
        };
      }
    }
    return {
      Math: M,
      HtmlGUI: HtmlGUI,
      Random: Random,
      Stats: Stats,
      CoordinateSystem: CoordinateSystem,
      FS: fs,
      Time: Time,
      Turtle: Turtle,
      Keyboard: Keyboard,
    };
  }
}
String.prototype.capitalize = function () {
  return this.charAt(0).upper() + this.substring(1, this.length);
};
Object.prototype.addProperty = function (property, value) {
  this[property] = value;
  return this;
};
Number.prototype.e = function (n) {
  return this * 10 ** n;
};
const reversed = (a) => {
  let x;
  switch (type(a)) {
    case "array":
      x = [];
      For((i) => x.push(a[a.length - 1 - i]), 0, a.length);
      return x;
    case "string":
      x = "";
      For((i) => (x += a.charAt(a.length - 1 - i)), 0, a.length);
      return x;
    default:
      throw new TypeError("Reversal Error: Cannot reverse unordered data.");
  }
};
const range = (min, max) => {
  let x = [];
  For((i) => x.push(i), min, max);
  return x;
};
const tuple = (...data) => new Tuple(data);
class Tuple extends Array {
  constructor(...args) {
    return Object.seal(args);
  }
}
const list = (...data) => new Array(data);
class Char extends String {
  constructor(value = "") {
    super(value);
    if (value.length == 1) {
      return new String(value);
    } else {
      throw new TypeError("Character must be of length 1.");
    }
  }
}
const char = (a) => new Char(a);