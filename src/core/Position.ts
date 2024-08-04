// TODO: 그냥 x, y로만 하는게 더 나을지도?
export default class Position {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set x(value: number) {
        this._x = value;
    }

    set y(value: number) {
        this._y = value;
    }

    isSame(other: Position): boolean {
        return this._x === other.x && this._y === other.y;
    }
}