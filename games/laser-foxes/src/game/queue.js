function Queue() {
    var a = [], b = 0;

    this.getLength = function () {
        return a.length - b
    };

    this.empty = function () {
        return 0 == a.length
    };

    this.put = function (b) {
        a.push(b)
    };

    this.remove = function () {
        if (0 != a.length) {
            var c = a[b];
            2 * ++b >= a.length && (a = a.slice(b), b = 0);
            return c
        }
    };

    this.peek = function () {
        return 0 < a.length ? a[b] : void 0
    }
};

exports.Queue = Queue;