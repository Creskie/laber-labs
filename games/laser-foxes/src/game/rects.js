var Rect = function (x, y, w, h) {
    this._x = null;
    this._y = null;
    this._w = null;
    this._h = null;

    // use setter functions to round and cast to int
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};

Rect.prototype = {
    get x() {
        return this._x;
    },
    set x(val) {
        this._x = parseInt(Math.round(val));
    },


    get y() {
        return this._y;
    },
    set y(val) {
        this._y = parseInt(Math.round(val));
    },


    get w() {
        return this._w;
    },
    set w(val) {
        this._w = parseInt(Math.round(val));
    },


    get h() {
        return this._h;
    },
    set h(val) {
        this._h = parseInt(Math.round(val));
    },


    get width() {
        return this._w;
    },
    set width(val) {
        console.assert(val >= 0, "Width < 0");
        this._w = parseInt(Math.round(val));
    },


    get height() {
        return this._h;
    },
    set height(val) {
        console.assert(val >= 0, "Height < 0");
        this._h = parseInt(Math.round(val));
    },


    get topleft() {
        return [this._x, this._y];
    },
    set topleft(val) {
        this._x = parseInt(Math.round(val[0]));
        this._y = parseInt(Math.round(val[1]));
    },


    get top() {
        return this._y;
    },
    set top(val) {
        this._y = parseInt(Math.round(val));
    },


    get topright() {
        return [this._x + this._w, this._y];
    },
    set topright(val) {
        this._x = parseInt(Math.round(val[0] - this._w));
        this._y = val[1];
    },


    get right() {
        return this._x + this._w;
    },
    set right(val) {
        this._x = parseInt(Math.round(val - this._w));
    },


    get bottomright() {
        return [this._x + this._w, this._y + this._h];
    },
    set bottomright(val) {
        this._x = parseInt(Math.round(val[0] - this._w));
        this._y = parseInt(Math.round(val[1] - this._h));
    },


    get bottom() {
        return this._y + this._h;
    },
    set bottom(val) {
        this._y = parseInt(Math.round(val - this._h));
    },


    get bottomleft() {
        return [this._x, this._y + this._h];
    },
    set bottomleft(val) {
        this._x = val[0];
        this._y = parseInt(Math.round(val[1] - this._h));
    },


    get left() {
        return this._x;
    },
    set left(val) {
        this._x = parseInt(Math.round(val));
    },


    get center() {
        return [this._x + 0.5 * this._w, this._y + 0.5 * this._h];
    },
    set center(val) {
        this._x = parseInt(Math.round(val[0] - 0.5 * this._w));
        this._y = parseInt(Math.round(val[1] - 0.5 * this._h));
    },


    get centerx() {
        return this._x + 0.5 * this._w;
    },
    set centerx(val) {
        this._x = parseInt(Math.round(val - 0.5 * this._w));
    },


    get centery() {
        return this._y + 0.5 * this._h;
    },
    set centery(val) {
        this._y = parseInt(Math.round(val - 0.5 * this._h));
    },


    get midtop() {
        return [this.centerx, this.top];
    },


    get midright() {
        return [this.right, this.centery];
    },

    get midbottom() {
        return [this.centerx, this.bottom];
    },

    get midleft() {
        return [this.left, this.centery];
    }
};


Rect.prototype.collide = function (other) {
    // other is really other.rect!!
    if (this.top >= other.bottom || other.top >= this.bottom) {
        return false;
    }
    else if (this.right <= other.left || other.right <= this.left) {
        return false;
    }
    else {
        return true;
    }
};

Rect.prototype.collidepoint = function (point) {
    return !(this.left >= point[0] ||
             this.right <= point[0] ||
             this.top >= point[1] ||
             this.bottom <= point[1]);
    // chained comparison not supported in js
    // (this.left <= point[0] <= this.right && this.top <= point[1] <= this.bottom);
    // return ((this.left <= point[0] && point[0] <= this.right)
    //         && (this.top <= point[1] && point[1] <= this.bottom);
    //if (this.left >= point[0] || this.right <= point[0]) {
    //    return false;
    //}
    //else if (this.top >= point[1] || this.bottom <= point[1]) {
    //    return false;
    //}
    //else {
    //    return true;
    //}
};

exports.Rect = Rect;
