Import("CoordinateSystem", "cs")
class Matrix {
    #matrix;
    constructor(rows, columns) {
        this.rows = rows;
        this.cols = columns;
        this.#matrix = cs.initialize(0, this.cols, 0, this.rows);
    }
    setItem(r, c, value) {
        cs.setCoordinateData(this.#matrix, tuple(c, r), value);
    }
    getItem(r, c) {
        return cs.getCoordinateData(this.#matrix, tuple(c, r));
    }
    getMatrix() {
        let matrix = "| ";
        For(r => {
            For(c => {
                matrix += this.getItem(r, c) + " ";
            }, 0, this.cols)
            matrix += "|\n| "
        }, 0, this.rows)
        return matrix.slice(0, -3);
    }
}
