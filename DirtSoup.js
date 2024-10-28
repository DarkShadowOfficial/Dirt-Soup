const print = console.log;
function For(action, start, end, step = 1) {
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
  let s = new Set(a).forEach((x) => arr.push(x));
  return arr;
};
const str = (a) => JSON.stringify(a);
const int = (a) => {
  switch (type(a)) {
    case "number":
      return Math.floor(a);
    case "string":
      return parseInt(a);
    default:
      throw "Cannot parse as int.";
  }
};
const float = (a) => {
  switch (type(a)) {
    case "number":
      return a;
    case "string":
      return parseFloat(a);
    default:
      throw "Cannot parse as float.";
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
      ? "Module Import Error: Module '" + module + "' not found."
      : "Methods/Properties " +
          imports +
          " were not found in module '" +
          module +
          "'.";
  }
};
class MODULES {
  constructor() {
    class C {
      constructor() {
        const RED = { r: 1, g: 0, b: 0 };
        const GREEN = { r: 0, g: 1, b: 0 };
        const CYAN = { r: 0, g: 1, b: 1 };
        const MAGENTA = { r: 1, g: 0, b: 1 };
        const YELLOW = { r: 1, g: 1, b: 0 };
        const BLUE = { r: 0, g: 0, b: 1 };
        class Color {
          constructor(r, g, b) {
            function rgb() {
              return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
            }
            function hex() {
              let key = {
                10: "a",
                11: "b",
                12: "c",
                13: "d",
                14: "e",
                15: "f",
              };
              iter((i) => {
                key[i] = str(i);
              }, range(0, 10));
              let r1 = key[Math.floor((r * 255) / 16)];
              let r2 = key[int(r * 255) % 16];
              let b1 = key[Math.floor((b * 255) / 16)];
              let b2 = key[int(b * 255) % 16];
              let g1 = key[Math.floor((g * 255) / 16)];
              let g2 = key[int(g * 255) % 16];
              return `#${r1}${r2}${g1}${g2}${b1}${b2}`;
            }
            function comp() {
              let sum = r + g + b;
              return {
                r: float(((r / sum) * 100).toFixed(2)),
                g: float(((g / sum) * 100).toFixed(2)),
                b: float(((b / sum) * 100).toFixed(2)),
              };
            }
            return {
              r: r,
              g: g,
              b: b,
              toRGB: rgb,
              toHex: hex,
              getComposition: comp,
            };
          }
        }
        return {
          RED: RED,
          GREEN: GREEN,
          CYAN: CYAN,
          MAGENTA: MAGENTA,
          YELLOW: YELLOW,
          BLUE: BLUE,
          Color: Color,
        };
      }
    }
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
            throw (
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
            throw (
              "Coordinate Error: Target coordinates must be of type 'tuple'. Entered coordinates were of type '" +
              type(coords) +
              "'."
            );
          }
        }
        return {
          initialize: i,
          getCoordinateData: gcd,
          setCoordinateData: scd,
        };
      }
    }
    // fs Module is still under development
    // class fs {
    //   constructor() {
    //     let textFile = null;
    //     const makeTextFile = function (text) {
    //       let data = new Blob([text], { type: "text/plain" });
    //       if (textFile !== null) {
    //         window.URL.revokeObjectURL(textFile);
    //       }
    //       textFile = window.URL.createObjectURL(data);
    //       return textFile;
    //     };
    //     let f;
    //     let d;
    //     function append(data) {
    //       d += data;
    //       f = makeTextFile(d);
    //     }
    //     function write(data) {
    //       f = makeTextFile(data);
    //       d = data;
    //     }
    //     function read() {
    //       return d;
    //     }
    //     let w;
    //     function open() {
    //       w = window.open(f);
    //     }
    //     function close() {
    //       w.close();
    //       f = null;
    //       d = null;
    //     }
    //     return {
    //       open: open,
    //       read: read,
    //       append: append,
    //       write: write,
    //       close: close,
    //     };
    //   }
    // }
    class Time {
      constructor() {
        function sleep(seconds) {
          var dt = new Date();
          while (new Date() - dt <= seconds * 1000) {}
        }
        let tstamp;
        function timestamp() {
          tstamp = Date.now();
          return tstamp;
        }
        function deleteTimestamp() {
          tstamp = null;
        }
        function elapsed() {
          if (tstamp == null)
            throw "Timestamp Error: Cannot use inactive timestamp.";
          return Date.now() - tstamp;
        }
        function now() {
          let monthsA = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          let days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          let n = new Date().toString();
          return {
            hrs:
              new Date().getHours() % 12 == 0 ? 12 : new Date().getHours() % 12,
            hrsMT: new Date().getHours(),
            min: new Date().getMinutes(),
            sec: new Date().getSeconds(),
            ms: new Date().getMilliseconds(),
            year: new Date().getFullYear(),
            monthI: new Date().getMonth() + 1,
            monthAbbr: monthsA[new Date().getMonth()],
            month: months[new Date().getMonth()],
            date: new Date().getDate(),
            day: days[new Date().getDay()],
            timezone: n.split("(")[1].replace(")", ""),
          };
        }
        return {
          sleep: sleep,
          now: now,
          timestamp: timestamp,
          deleteTimestamp: deleteTimestamp,
          elapsedTime: elapsed,
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
      Random: Random,
      Stats: Stats,
      CoordinateSystem: CoordinateSystem,
      Time: Time,
      Keyboard: Keyboard,
      Color: C,
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
      throw "Reversal Error: Cannot reverse unordered data.";
  }
};
const range = (min, max) => {
  let x = [];
  For((i) => x.push(i), min, max);
  return x;
};
const input = prompt;
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
      throw "Character must be of length 1.";
    }
  }
}
const char = (a) => new Char(a);
const len = (data) => data.length;
