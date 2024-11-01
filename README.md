# Dirt Soup
Dirt Soup is a Python-like programming language with JavaScript syntax, which combines the best of both worlds: OOP with easy web application.

## Documentation
### Implementation
Implement Dirt Soup by linking DirtSoup.js in the `<body>` of your document.
Your main file must be named `main.ds`, and your initializer file must be named `init.ds`.
All other Dirt Soup files you're linking must be linked in `init.ds` through `linkScript(name of file, without the .ds extension, which is automatically added when linking)`. `main.ds` is automatically linked, so you don't link it in `init.js`.

### Basic functionalities
Just like in Python, the `print()` function can be used to log to the console.
Defining variables will be in JavaScript syntax, using either `let` or `const`.

### Control Flow
#### Repetition
For `for` loops, you can use 1 of 3 functions: repeat(), For(), and iter().
To simply repeat a function `n` amount of times, use `repeat()`:
```
repeat(() => print("Hello World!"), 100) // prints "Hello World!" 100 times
```
For regular `for` loops, you can either use `iter()` or `For()`, depending on the case. If it is either iterating through an object/array, or going through a range of numbers with a step of 1, use `iter()`:
```
iter(i => print(i), range(1, 101)) // prints the integers from 1-100
iter(i => print(i), [1, 2, 4, 6]) // prints each item in that array
```
When using a step that isn't 1, such as skipping every odd number, use `For()`:
```
For(i => print(i), 0, 101, 2) // prints every even number from 0-100
```

To do a `while` loop, just use JavaScript syntax, with either the regular `while()` loop or `do {} while ()` syntax.

#### Logic
All logical statements are written in regular JS syntax, but many logic operators have been written for convenience, such as `OR`, `AND`, `XOR`, and more:
```
XOR(1 + 1 == 2, 2 * 3 == 6) // false
OR(1 + 1 == 2, 2 * 3 == 5) // true
AND(1 + 1 == 2, 2 * 3 == 5) // false
NOT(1 + 1 == 3) // true
NOR(1 + 1 == 3, 2 * 3 == 6) // false
```

### Data Types
Other than pre-existing JS data types, new ones have been added, along with a `type()` function that works better than the `typeof` keyword.
The now existing data types are:
- tuple
- array
- object (aka dictionary in Python)
- char
- string
- number
Functions for casting and converting between data types have also been added:
```
tuple(1, 2) // returns [1, 2], but you cannot change the length of the tuple
list(1, 2, 3) // returns [1, 2, 3]
char('s') // returns 's' (NOTE: If you pass in a string without a length of 1, aka a character, it will return an error)
str(4) // returns '4'
float('4.5') // returns 4.5
int(4.5 or '4.5') // returns 4
set(1, 2, 3, 2, 3, 1, 4) // returns [1, 2, 3, 4]
```
Data type methods have also been added:
```
("Hello WORld").lower() // returns "hello world"
("Hello WORld").upper() // returns "HELLO WORLD"
("Hello WORld").capitalize() // returns "Hello world"
({a: 1, b: 2}).addProperty('c', 3) // adds the property c: 3, and returns the object {a: 1, b: 2, c: 3}
(1.2).e(3) // returns 1200 (.e() is for scientific notation values)
```
To find the length of some data, such as a string or array, use `len()`:
```
len([1, 2, 3]) // returns 3
len("hello") // returns 5
```
To reverse something ordered, such as a string or array, use `reversed()`:
```
reversed([1, 2, 3]) // returns [3, 2, 1]
reversed("hello") // returns "olleh"
```
To find the data type of some data, use `type()`:
```
type(1) // number
type([1, 2, 3]) // array
type(tuple(1, 2)) // tuple
type('A') // char
type("hello") // string
```

### Modules
To import a built-in module, use `Import()`:
```
Import("Time") // globalizes "time" to have the properties and methods of the Time module.
Import("Time", "t") // globalizes the Time module as "t"
Import("Time", null, "now", "timestamp", "elapsedTime") // Globalizes the functions 'now()', 'timestamp()', and 'elapsedTime()'
Import("Time", null, "*") // Globalizes every method in the Time module
```
###### Available modules as of 11/1/2024
- Math
- Time
- Color
- CoordinateSystem
- Random
- Stats
- Keyboard
- HtmlGUI
###### Update - 10/30
You can now use `shuffleArray()` to shuffle an array, as the name suggests:
```
shuffleArray([1, 2, 3, 4, 5]) // returns a shuffled array, such as [2, 3, 1, 5, 4]
```
The `iter()` function now supports string inputs, by iterating through each individual character of the string.
The new `iterable()` function returns whether the inputted data is iterable, as a boolean.
```
iterable([1, 2, 3]) // true
iterable(145) // false
```
###### Update - 11/1
Under the case where a function needs to be spontaneous, just name your function `$`, and it will be automatically called, without you needing to call it. Reserve `$()` for this use only.
```
function $() {
  print("Hello World");
} // this is automatically called, and "Hello World" is printed to the console
```

The `HtmlGUI` library is now available in the built-in modules (accessible with `Import()`), with features such as text, canvas graphics, easy stylesheet writing, and more.
