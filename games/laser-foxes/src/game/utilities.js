function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

function l2(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
}

function l2dist(a, b) {
    var d1 = a[0] - b[0];
    var d2 = a[1] - b[1];
    return Math.sqrt(d1 * d1 + d2 * d2);
}

function angle(a, b) {
    return Math.acos(dot(a, b) / (l2(a) * l2(b)));
}

var seed = 12250616;

function rand() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function randunif(a, b) {
    return rand() * (b - a) + a;
}

function randchoice(arr) {
    return arr[Math.floor(randunif(0, arr.length))];
}

function randchoice_w(arr, weight) {
    var r = randunif(0, 1);
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += weight[i];
        if (r <= sum)
            return arr[i];
    }

    alert("Weighted random number incorrect.");
}

function randint(a, b) { // doesn't include b
    return Math.floor(rand() * (b - a)) + a;
}

function randn_bm() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function end_time(t) {
    t.stop();
}

function format_time(s) {
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
}

function linspace(a, b, n, int) {
    if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
    if (typeof int === "undefined") int = false;
    if (n < 2) {
        return n === 1 ? [a] : [];
    }
    var i, ret = Array(n);
    n--;
    if (int) {
        for (i = n; i >= 0; i--) {
            ret[i] = parseInt((i * b + (n - i) * a) / n);
        }
    } else {
        for (i = n; i >= 0; i--) {
            ret[i] = (i * b + (n - i) * a) / n;
        }
    }
    return ret;
}

function product() {
    var args = [].slice.call(arguments)
        , end = args.length - 1;

    var result = [];

    function addTo(curr, start) {
        var first = args[start], last = (start === end);

        for (var i = 0; i < first.length; ++i) {
            var copy = curr.slice();
            copy.push(first[i]);

            if (last) {
                result.push(copy)
            } else {
                addTo(copy, start + 1)
            }
        }
    }

    if (args.length) {
        addTo([], 0)
    } else {
        result.push([])
    }
    return result;
}

function sum(arr1, arr2) {
    var sum = []; // we assume that lengths are the same..
    for (var i = 0; i < arr1.length; i++) {
        sum.push(arr2[i] + arr1[i]);
    }
    return sum;
}

function subtract(arr1, arr2) {
    var sub = []; // we assume that lengths are the same..
    for (var i = 0; i < arr1.length; i++) {
        sub.push(arr1[i] - arr2[i]);
    }
    return sub;
}

function add(a, b) {
    return a + b;
}

exports.dot = dot;
exports.l2 = l2;
exports.l2dist = l2dist;
exports.angle = angle;
exports.rand = rand;
exports.randunif = randunif;
exports.randchoice = randchoice;
exports.randchoice_w = randchoice_w;
exports.randint = randint;
exports.end_time = end_time;
exports.format_time = format_time;
exports.linspace = linspace;
exports.product = product;
exports.sum = sum;
exports.subtract = subtract;
exports.add = add;
exports.randn_bm = randn_bm;
exports.seed = seed;