/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Unit = (function () {
    function Unit(board, alive, x, y, ticks_per_spot) {
        this.board = board;
        this.alive = alive;
        this.x = x;
        this.y = y;
        this.update_spot();
        this.dest_spot = -1;
        this.action = -1;
        this.motion = -1;
        this.ticks_per_spot = ticks_per_spot;
        this.move_eps = (1 / this.ticks_per_spot) * 0.1;
    }
    Unit.prototype.is_alive = function () {
        return this.alive;
    };
    Unit.prototype.update_spot = function () {
        if (this.alive) {
            var tile_x = Math.floor(this.x);
            var tile_y = Math.floor(this.y);
            var tile = tile_y * this.board.num_tiles_x + tile_x;
            this.spot = this.board.get_dot(tile, false).spot;
        }
        else {
            this.spot = -1;
        }
    };
    Unit.prototype.update_motion = function () {
        if (this.action < 0) {
            this.motion = -1;
            this.dest_spot = -1;
        }
        else {
            var dot = this.board.get_dot(this.spot, true);
            var neigh_action_tile = dot.get_neighbor(this.action);
            var neigh_motion_tile;
            neigh_motion_tile =
                this.motion < 0 ? -1 : dot.get_neighbor(this.motion);
            if (neigh_action_tile >= 0) {
                this.motion = this.action;
                this.dest_spot = this.board.tile_to_spot[neigh_action_tile];
            }
            else if (neigh_motion_tile >= 0) {
                this.dest_spot = this.board.tile_to_spot[neigh_motion_tile];
            }
            else {
                this.dest_spot = this.spot;
            }
        }
    };
    Unit.prototype.set_action = function (new_action) {
        if (new_action == 0 || new_action == 1
            || new_action == 2 || new_action == 3) {
            this.action = new_action;
        }
    };
    Unit.prototype.move = function () {
        if (this.is_alive()) {
            this.alive_move();
        }
        else {
            this.dead_move();
        }
    };
    Unit.prototype.dead_move = function () {
    };
    Unit.prototype.alive_move = function () {
        if (this.dest_spot >= 0) {
            var dist_to_move = 1.0 / this.ticks_per_spot;
            var dot = this.board.get_dot(this.spot, true);
            var spot_tl_x = (dot.tile % this.board.num_tiles_x);
            var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);
            var dest = this.board.get_dot(this.dest_spot, true);
            var dest_tl_x = (dest.tile % this.board.num_tiles_x);
            var dest_tl_y = Math.floor(dest.tile / this.board.num_tiles_x);
            var dist_to_dest;
            var new_y = this.y;
            var new_x = this.x;
            if (this.motion == 0 || this.motion == 1) {
                dist_to_dest = Math.abs(dest_tl_y + 0.5 - this.y);
                if (this.motion == 0) {
                    new_y = this.y - dist_to_move;
                }
                else {
                    new_y = this.y + dist_to_move;
                }
            }
            else if (this.motion == 2 || this.motion == 3) {
                dist_to_dest = Math.abs(dest_tl_x + 0.5 - this.x);
                if (this.motion == 2) {
                    new_x = this.x - dist_to_move;
                }
                else {
                    new_x = this.x + dist_to_move;
                }
            }
            else {
                console.log("motion");
                console.log(this.motion);
                throw new Error("Motion must be in {0, 1, 2, 3}");
            }
            if (dist_to_move + this.move_eps > dist_to_dest) {
                this.x = dest_tl_x + 0.5;
                this.y = dest_tl_y + 0.5;
                this.update_spot();
                this.update_motion();
            }
            else if (this.motion == 0 && new_y < spot_tl_y) {
                this.y = dest_tl_y + 1.0 - (spot_tl_y - new_y);
                this.update_spot();
            }
            else if (this.motion == 1 && new_y >= (spot_tl_y + 1.0)) {
                this.y = dest_tl_y + (new_y - (spot_tl_y + 1.0));
                this.update_spot();
            }
            else if (this.motion == 2 && new_x < spot_tl_x) {
                this.x = dest_tl_x + 1.0 - (spot_tl_x - new_x);
                this.update_spot();
            }
            else if (this.motion == 3 && new_x >= (spot_tl_x + 1.0)) {
                this.x = dest_tl_x + (new_x - (spot_tl_x + 1.0));
                this.update_spot();
            }
            else {
                this.x = new_x;
                this.y = new_y;
            }
        }
        else {
            this.update_motion();
        }
    };
    return Unit;
}());
exports.Unit = Unit;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Controller = (function () {
    function Controller(units, board) {
        this.units = units;
        this.num_units = this.units.length;
        this.board = board;
    }
    Controller.prototype.assign_actions = function (actions) {
        if (actions.length != this.num_units) {
            throw new Error("Incorrect number of actions: "
                + actions.length + " vs. " + this.num_units);
        }
        for (var i = 0; i < this.num_units; ++i) {
            this.units[i].set_action(actions[i]);
        }
    };
    return Controller;
}());
exports.Controller = Controller;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ProbAssign = (function () {
    function ProbAssign(board, ghosts, probs) {
        this.board = board;
        this.ghosts = ghosts;
        this.probs = new Array(this.board.dots.length);
        for (var i = 0; i < this.board.dots.length; i++) {
            this.probs[i] = probs[i];
        }
    }
    ProbAssign.prototype.bestProbs = function () {
        var best_spots = new Array();
        var best_spot;
        for (var j = 0; j < this.ghosts.length; j++) {
            var best_prob = 0;
            var target_spot = 0;
            for (var i = 0; i < this.probs.length; i++) {
                if (this.probs[i] > best_prob) {
                    target_spot = i;
                    best_prob = this.probs[i];
                }
            }
            if (j === 0) {
                best_spot = target_spot;
            }
            if (best_prob > 0) {
                best_spots.push(target_spot);
            }
            else {
                best_spots.push(best_spot);
            }
            this.probs[target_spot] = 0;
        }
        return best_spots;
    };
    ProbAssign.prototype.probAssign = function () {
        var permute = this.permutator(this.bestProbs());
        console.log(" ");
        var best_dist = Infinity;
        var best_assign;
        for (var i = 0; i < permute.length; i++) {
            var dist = 0;
            for (var j = 0; j < this.ghosts.length; j++) {
                if (permute[i][j] >= 0 || permute[i][j] <= 1000) {
                }
                else {
                    console.log("i: " + i);
                    console.log("j: " + j);
                }
                var dot = this.board.get_dot(permute[i][j], true);
                var tile = dot.tile;
                var x = tile % this.board.num_tiles_x;
                var y = Math.floor(tile
                    / this.board.num_tiles_x);
                dist += this.board.dist(this.ghosts[j].x, this.ghosts[j].y, x, y);
            }
            if (dist < best_dist) {
                best_dist = dist;
                best_assign = permute[i];
            }
        }
        return best_assign;
    };
    ProbAssign.prototype.permutator = function (inputArr) {
        var result = [];
        function permute(arr, m) {
            if (m === void 0) { m = []; }
            if (arr.length === 0) {
                result.push(m);
            }
            else {
                for (var i = 0; i < arr.length; i++) {
                    var curr = arr.slice();
                    var next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next));
                }
            }
        }
        permute(inputArr);
        return result;
    };
    return ProbAssign;
}());
exports.ProbAssign = ProbAssign;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Post = (function () {
    function Post() {
    }
    return Post;
}());
exports.Post = Post;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wall_1 = __webpack_require__(6);
var dot_1 = __webpack_require__(7);
var viewer_1 = __webpack_require__(8);
window.onload = function () {
    var walls = new Array();
    walls.push(new wall_1.Wall([448, 449, 450, 451, 452, 453,
        425, 397, 369, 341,
        340, 339, 338, 337, 336,
        308, 280, 252, 224, 196, 168, 140, 112, 84,
        85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
        125, 153, 181, 209,
        210,
        182, 154, 126, 98,
        99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
        139, 167, 195, 223, 251, 279, 307, 335, 363,
        362, 361, 360, 359, 358,
        386, 414, 442, 470,
        471, 472, 473, 474, 475
    ], false));
    walls.push(new wall_1.Wall([
        504, 505, 506, 507, 508, 509, 537, 565, 593, 621, 620, 619, 618, 617,
        616, 644, 672, 700, 728, 756, 757, 758, 786, 785, 784, 812, 840, 868,
        896, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936,
        937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950,
        951, 923, 895, 867, 839, 811, 810, 809, 781, 782, 783, 755, 727, 699,
        671, 643, 642, 641, 640, 639, 638, 610, 582, 554, 526, 527, 528, 529,
        530, 531
    ], false));
    walls.push(new wall_1.Wall([
        142, 143, 144, 145,
        173, 201,
        200, 199, 198
    ], true));
    walls.push(new wall_1.Wall([
        147, 148, 149, 150, 151,
        179, 207,
        206, 205, 204, 203,
        175
    ], true));
    walls.push(new wall_1.Wall([
        156, 157, 158, 159, 160, 188, 216, 215, 214, 213, 212, 184
    ], true));
    walls.push(new wall_1.Wall([
        162, 163, 164, 165, 193, 221, 220, 219, 218, 190
    ], true));
    walls.push(new wall_1.Wall([
        254, 255, 256, 257, 285, 284, 283, 282
    ], true));
    walls.push(new wall_1.Wall([
        259, 260, 288, 316, 344, 345, 346, 347, 375, 374, 373, 372, 400,
        428, 456, 455, 427, 399, 371, 343, 315, 287
    ], true));
    walls.push(new wall_1.Wall([
        262, 263, 264, 265, 266, 267, 268, 269, 297, 296, 295, 294, 322,
        350, 378, 377, 349, 321, 293, 292, 291, 290
    ], true));
    walls.push(new wall_1.Wall([
        271, 272, 300, 328, 356, 384, 412, 440, 468, 467, 439, 411, 383,
        382, 381, 380, 352, 353, 354, 355, 327, 299
    ], true));
    walls.push(new wall_1.Wall([
        274, 275, 276, 277, 305, 304, 303, 302
    ], true));
    walls.push(new wall_1.Wall([
        511, 512, 540, 568, 596, 624, 623, 595, 567, 539
    ], true));
    walls.push(new wall_1.Wall([
        598, 599, 600, 601, 602, 603, 604, 605, 633, 632, 631, 630, 658,
        686, 714, 713, 685, 657, 629, 628, 627, 626
    ], true));
    walls.push(new wall_1.Wall([
        523, 524, 552, 580, 608, 636, 635, 607, 579, 551
    ], true));
    walls.push(new wall_1.Wall([
        674, 675, 676, 677, 705, 733, 761, 789, 788, 760, 732, 704, 703, 702
    ], true));
    walls.push(new wall_1.Wall([
        679, 680, 681, 682, 683, 711, 710, 709, 708, 707
    ], true));
    walls.push(new wall_1.Wall([
        688, 689, 690, 691, 692, 720, 719, 718, 717, 716
    ], true));
    walls.push(new wall_1.Wall([
        694, 695, 696, 697, 725, 724, 723, 751, 779, 807, 806, 778, 750, 722
    ], true));
    walls.push(new wall_1.Wall([
        842, 843, 844, 845, 846, 847, 819, 791, 763, 764, 792, 820, 848,
        849, 850, 851, 879, 878, 877, 876, 875, 874, 873, 872, 871, 870
    ], true));
    walls.push(new wall_1.Wall([
        766, 767, 768, 769, 770, 771, 772, 773, 801, 800, 799, 798, 826,
        854, 882, 881, 853, 825, 797, 796, 795, 794
    ], true));
    walls.push(new wall_1.Wall([
        856, 857, 858, 859, 831, 803, 775, 776, 804, 832, 860, 861, 862,
        863, 864, 865, 893, 892, 891, 890, 889, 888, 887, 886, 885, 884
    ], true));
    var dots = new Array();
    dots.push(new dot_1.Dot(0, 113, 1, -1, 141, -1, 114));
    dots.push(new dot_1.Dot(1, 114, 1, -1, -1, 113, 115));
    dots.push(new dot_1.Dot(2, 115, 1, -1, -1, 114, 116));
    dots.push(new dot_1.Dot(3, 116, 1, -1, -1, 115, 117));
    dots.push(new dot_1.Dot(4, 117, 1, -1, -1, 116, 118));
    dots.push(new dot_1.Dot(5, 118, 1, -1, 146, 117, 119));
    dots.push(new dot_1.Dot(6, 119, 1, -1, -1, 118, 120));
    dots.push(new dot_1.Dot(7, 120, 1, -1, -1, 119, 121));
    dots.push(new dot_1.Dot(8, 121, 1, -1, -1, 120, 122));
    dots.push(new dot_1.Dot(9, 122, 1, -1, -1, 121, 123));
    dots.push(new dot_1.Dot(10, 123, 1, -1, -1, 122, 124));
    dots.push(new dot_1.Dot(11, 124, 1, -1, 152, 123, -1));
    dots.push(new dot_1.Dot(12, 127, 1, -1, 155, -1, 128));
    dots.push(new dot_1.Dot(13, 128, 1, -1, -1, 127, 129));
    dots.push(new dot_1.Dot(14, 129, 1, -1, -1, 128, 130));
    dots.push(new dot_1.Dot(15, 130, 1, -1, -1, 129, 131));
    dots.push(new dot_1.Dot(16, 131, 1, -1, -1, 130, 132));
    dots.push(new dot_1.Dot(17, 132, 1, -1, -1, 131, 133));
    dots.push(new dot_1.Dot(18, 133, 1, -1, 161, 132, 134));
    dots.push(new dot_1.Dot(19, 134, 1, -1, -1, 133, 135));
    dots.push(new dot_1.Dot(20, 135, 1, -1, -1, 134, 136));
    dots.push(new dot_1.Dot(21, 136, 1, -1, -1, 135, 137));
    dots.push(new dot_1.Dot(22, 137, 1, -1, -1, 136, 138));
    dots.push(new dot_1.Dot(23, 138, 1, -1, 166, 137, -1));
    dots.push(new dot_1.Dot(24, 141, 1, 113, 169, -1, -1));
    dots.push(new dot_1.Dot(25, 146, 1, 118, 174, -1, -1));
    dots.push(new dot_1.Dot(26, 152, 1, 124, 180, -1, -1));
    dots.push(new dot_1.Dot(27, 155, 1, 127, 183, -1, -1));
    dots.push(new dot_1.Dot(28, 161, 1, 133, 189, -1, -1));
    dots.push(new dot_1.Dot(29, 166, 1, 138, 194, -1, -1));
    dots.push(new dot_1.Dot(30, 169, 2, 141, 197, -1, -1));
    dots.push(new dot_1.Dot(31, 174, 1, 146, 202, -1, -1));
    dots.push(new dot_1.Dot(32, 180, 1, 152, 208, -1, -1));
    dots.push(new dot_1.Dot(33, 183, 1, 155, 211, -1, -1));
    dots.push(new dot_1.Dot(34, 189, 1, 161, 217, -1, -1));
    dots.push(new dot_1.Dot(35, 194, 2, 166, 222, -1, -1));
    dots.push(new dot_1.Dot(36, 197, 1, 169, 225, -1, -1));
    dots.push(new dot_1.Dot(37, 202, 1, 174, 230, -1, -1));
    dots.push(new dot_1.Dot(38, 208, 1, 180, 236, -1, -1));
    dots.push(new dot_1.Dot(39, 211, 1, 183, 239, -1, -1));
    dots.push(new dot_1.Dot(40, 217, 1, 189, 245, -1, -1));
    dots.push(new dot_1.Dot(41, 222, 1, 194, 250, -1, -1));
    dots.push(new dot_1.Dot(42, 225, 1, 197, 253, -1, 226));
    dots.push(new dot_1.Dot(43, 226, 1, -1, -1, 225, 227));
    dots.push(new dot_1.Dot(44, 227, 1, -1, -1, 226, 228));
    dots.push(new dot_1.Dot(45, 228, 1, -1, -1, 227, 229));
    dots.push(new dot_1.Dot(46, 229, 1, -1, -1, 228, 230));
    dots.push(new dot_1.Dot(47, 230, 1, 202, 258, 229, 231));
    dots.push(new dot_1.Dot(48, 231, 1, -1, -1, 230, 232));
    dots.push(new dot_1.Dot(49, 232, 1, -1, -1, 231, 233));
    dots.push(new dot_1.Dot(50, 233, 1, -1, 261, 232, 234));
    dots.push(new dot_1.Dot(51, 234, 1, -1, -1, 233, 235));
    dots.push(new dot_1.Dot(52, 235, 1, -1, -1, 234, 236));
    dots.push(new dot_1.Dot(53, 236, 1, 208, -1, 235, 237));
    dots.push(new dot_1.Dot(54, 237, 1, -1, -1, 236, 238));
    dots.push(new dot_1.Dot(55, 238, 1, -1, -1, 237, 239));
    dots.push(new dot_1.Dot(56, 239, 1, 211, -1, 238, 240));
    dots.push(new dot_1.Dot(57, 240, 1, -1, -1, 239, 241));
    dots.push(new dot_1.Dot(58, 241, 1, -1, -1, 240, 242));
    dots.push(new dot_1.Dot(59, 242, 1, -1, 270, 241, 243));
    dots.push(new dot_1.Dot(60, 243, 1, -1, -1, 242, 244));
    dots.push(new dot_1.Dot(61, 244, 1, -1, -1, 243, 245));
    dots.push(new dot_1.Dot(62, 245, 1, 217, 273, 244, 246));
    dots.push(new dot_1.Dot(63, 246, 1, -1, -1, 245, 247));
    dots.push(new dot_1.Dot(64, 247, 1, -1, -1, 246, 248));
    dots.push(new dot_1.Dot(65, 248, 1, -1, -1, 247, 249));
    dots.push(new dot_1.Dot(66, 249, 1, -1, -1, 248, 250));
    dots.push(new dot_1.Dot(67, 250, 1, 222, 278, 249, -1));
    dots.push(new dot_1.Dot(68, 253, 1, 225, 281, -1, -1));
    dots.push(new dot_1.Dot(69, 258, 1, 230, 286, -1, -1));
    dots.push(new dot_1.Dot(70, 261, 1, 233, 289, -1, -1));
    dots.push(new dot_1.Dot(71, 270, 1, 242, 298, -1, -1));
    dots.push(new dot_1.Dot(72, 273, 1, 245, 301, -1, -1));
    dots.push(new dot_1.Dot(73, 278, 1, 250, 306, -1, -1));
    dots.push(new dot_1.Dot(74, 281, 1, 253, 309, -1, -1));
    dots.push(new dot_1.Dot(75, 286, 1, 258, 314, -1, -1));
    dots.push(new dot_1.Dot(76, 289, 1, 261, 317, -1, -1));
    dots.push(new dot_1.Dot(77, 298, 1, 270, 326, -1, -1));
    dots.push(new dot_1.Dot(78, 301, 1, 273, 329, -1, -1));
    dots.push(new dot_1.Dot(79, 306, 1, 278, 334, -1, -1));
    dots.push(new dot_1.Dot(80, 309, 1, 281, -1, -1, 310));
    dots.push(new dot_1.Dot(81, 310, 1, -1, -1, 309, 311));
    dots.push(new dot_1.Dot(82, 311, 1, -1, -1, 310, 312));
    dots.push(new dot_1.Dot(83, 312, 1, -1, -1, 311, 313));
    dots.push(new dot_1.Dot(84, 313, 1, -1, -1, 312, 314));
    dots.push(new dot_1.Dot(85, 314, 1, 286, 342, 313, -1));
    dots.push(new dot_1.Dot(86, 317, 1, 289, -1, -1, 318));
    dots.push(new dot_1.Dot(87, 318, 1, -1, -1, 317, 319));
    dots.push(new dot_1.Dot(88, 319, 1, -1, -1, 318, 320));
    dots.push(new dot_1.Dot(89, 320, 1, -1, 348, 319, -1));
    dots.push(new dot_1.Dot(90, 323, 1, -1, 351, -1, 324));
    dots.push(new dot_1.Dot(91, 324, 1, -1, -1, 323, 325));
    dots.push(new dot_1.Dot(92, 325, 1, -1, -1, 324, 326));
    dots.push(new dot_1.Dot(93, 326, 1, 298, -1, 325, -1));
    dots.push(new dot_1.Dot(94, 329, 1, 301, 357, -1, 330));
    dots.push(new dot_1.Dot(95, 330, 1, -1, -1, 329, 331));
    dots.push(new dot_1.Dot(96, 331, 1, -1, -1, 330, 332));
    dots.push(new dot_1.Dot(97, 332, 1, -1, -1, 331, 333));
    dots.push(new dot_1.Dot(98, 333, 1, -1, -1, 332, 334));
    dots.push(new dot_1.Dot(99, 334, 1, 306, -1, 333, -1));
    dots.push(new dot_1.Dot(100, 342, 1, 314, 370, -1, -1));
    dots.push(new dot_1.Dot(101, 348, 0, 320, 376, -1, -1));
    dots.push(new dot_1.Dot(102, 351, 0, 323, 379, -1, -1));
    dots.push(new dot_1.Dot(103, 357, 1, 329, 385, -1, -1));
    dots.push(new dot_1.Dot(104, 370, 1, 342, 398, -1, -1));
    dots.push(new dot_1.Dot(105, 376, 0, 348, 404, -1, -1));
    dots.push(new dot_1.Dot(106, 379, 0, 351, 407, -1, -1));
    dots.push(new dot_1.Dot(107, 385, 1, 357, 413, -1, -1));
    dots.push(new dot_1.Dot(108, 398, 1, 370, 426, -1, -1));
    dots.push(new dot_1.Dot(109, 401, 0, -1, 429, -1, 402));
    dots.push(new dot_1.Dot(110, 402, 0, -1, -1, 401, 403));
    dots.push(new dot_1.Dot(111, 403, 0, -1, -1, 402, 404));
    dots.push(new dot_1.Dot(112, 404, 0, 376, -1, 403, 405));
    dots.push(new dot_1.Dot(113, 405, 0, -1, -1, 404, 406));
    dots.push(new dot_1.Dot(114, 406, 0, -1, -1, 405, 407));
    dots.push(new dot_1.Dot(115, 407, 0, 379, -1, 406, 408));
    dots.push(new dot_1.Dot(116, 408, 0, -1, -1, 407, 409));
    dots.push(new dot_1.Dot(117, 409, 0, -1, -1, 408, 410));
    dots.push(new dot_1.Dot(118, 410, 0, -1, 438, 409, -1));
    dots.push(new dot_1.Dot(119, 413, 1, 385, 441, -1, -1));
    dots.push(new dot_1.Dot(120, 426, 1, 398, 454, -1, -1));
    dots.push(new dot_1.Dot(121, 429, 0, 401, 457, -1, -1));
    dots.push(new dot_1.Dot(122, 438, 0, 410, 466, -1, -1));
    dots.push(new dot_1.Dot(123, 441, 1, 413, 469, -1, -1));
    dots.push(new dot_1.Dot(124, 454, 1, 426, 482, -1, -1));
    dots.push(new dot_1.Dot(125, 457, 0, 429, 485, -1, -1));
    dots.push(new dot_1.Dot(126, 466, 0, 438, 494, -1, -1));
    dots.push(new dot_1.Dot(127, 469, 1, 441, 497, -1, -1));
    dots.push(new dot_1.Dot(128, 476, 0, -1, -1, 503, 477));
    dots.push(new dot_1.Dot(129, 477, 0, -1, -1, 476, 478));
    dots.push(new dot_1.Dot(130, 478, 0, -1, -1, 477, 479));
    dots.push(new dot_1.Dot(131, 479, 0, -1, -1, 478, 480));
    dots.push(new dot_1.Dot(132, 480, 0, -1, -1, 479, 481));
    dots.push(new dot_1.Dot(133, 481, 0, -1, -1, 480, 482));
    dots.push(new dot_1.Dot(134, 482, 1, 454, 510, 481, 483));
    dots.push(new dot_1.Dot(135, 483, 0, -1, -1, 482, 484));
    dots.push(new dot_1.Dot(136, 484, 0, -1, -1, 483, 485));
    dots.push(new dot_1.Dot(137, 485, 0, 457, 513, 484, -1));
    dots.push(new dot_1.Dot(138, 494, 0, 466, 522, -1, 495));
    dots.push(new dot_1.Dot(139, 495, 0, -1, -1, 494, 496));
    dots.push(new dot_1.Dot(140, 496, 0, -1, -1, 495, 497));
    dots.push(new dot_1.Dot(141, 497, 1, 469, 525, 496, 498));
    dots.push(new dot_1.Dot(142, 498, 0, -1, -1, 497, 499));
    dots.push(new dot_1.Dot(143, 499, 0, -1, -1, 498, 500));
    dots.push(new dot_1.Dot(144, 500, 0, -1, -1, 499, 501));
    dots.push(new dot_1.Dot(145, 501, 0, -1, -1, 500, 502));
    dots.push(new dot_1.Dot(146, 502, 0, -1, -1, 501, 503));
    dots.push(new dot_1.Dot(147, 503, 0, -1, -1, 502, 476));
    dots.push(new dot_1.Dot(148, 510, 1, 482, 538, -1, -1));
    dots.push(new dot_1.Dot(149, 513, 0, 485, 541, -1, -1));
    dots.push(new dot_1.Dot(150, 522, 0, 494, 550, -1, -1));
    dots.push(new dot_1.Dot(151, 525, 1, 497, 553, -1, -1));
    dots.push(new dot_1.Dot(152, 538, 1, 510, 566, -1, -1));
    dots.push(new dot_1.Dot(153, 541, 0, 513, 569, -1, -1));
    dots.push(new dot_1.Dot(154, 550, 0, 522, 578, -1, -1));
    dots.push(new dot_1.Dot(155, 553, 1, 525, 581, -1, -1));
    dots.push(new dot_1.Dot(156, 566, 1, 538, 594, -1, -1));
    dots.push(new dot_1.Dot(157, 569, 0, 541, 597, -1, 570));
    dots.push(new dot_1.Dot(158, 570, 0, -1, -1, 569, 571));
    dots.push(new dot_1.Dot(159, 571, 0, -1, -1, 570, 572));
    dots.push(new dot_1.Dot(160, 572, 0, -1, -1, 571, 573));
    dots.push(new dot_1.Dot(161, 573, 0, -1, -1, 572, 574));
    dots.push(new dot_1.Dot(162, 574, 0, -1, -1, 573, 575));
    dots.push(new dot_1.Dot(163, 575, 0, -1, -1, 574, 576));
    dots.push(new dot_1.Dot(164, 576, 0, -1, -1, 575, 577));
    dots.push(new dot_1.Dot(165, 577, 0, -1, -1, 576, 578));
    dots.push(new dot_1.Dot(166, 578, 0, 550, 606, 577, -1));
    dots.push(new dot_1.Dot(167, 581, 1, 553, 609, -1, -1));
    dots.push(new dot_1.Dot(168, 594, 1, 566, 622, -1, -1));
    dots.push(new dot_1.Dot(169, 597, 0, 569, 625, -1, -1));
    dots.push(new dot_1.Dot(170, 606, 0, 578, 634, -1, -1));
    dots.push(new dot_1.Dot(171, 609, 1, 581, 637, -1, -1));
    dots.push(new dot_1.Dot(172, 622, 1, 594, 650, -1, -1));
    dots.push(new dot_1.Dot(173, 625, 0, 597, 653, -1, -1));
    dots.push(new dot_1.Dot(174, 634, 0, 606, 662, -1, -1));
    dots.push(new dot_1.Dot(175, 637, 1, 609, 665, -1, -1));
    dots.push(new dot_1.Dot(176, 645, 1, -1, 673, -1, 646));
    dots.push(new dot_1.Dot(177, 646, 1, -1, -1, 645, 647));
    dots.push(new dot_1.Dot(178, 647, 1, -1, -1, 646, 648));
    dots.push(new dot_1.Dot(179, 648, 1, -1, -1, 647, 649));
    dots.push(new dot_1.Dot(180, 649, 1, -1, -1, 648, 650));
    dots.push(new dot_1.Dot(181, 650, 1, 622, 678, 649, 651));
    dots.push(new dot_1.Dot(182, 651, 1, -1, -1, 650, 652));
    dots.push(new dot_1.Dot(183, 652, 1, -1, -1, 651, 653));
    dots.push(new dot_1.Dot(184, 653, 1, 625, -1, 652, 654));
    dots.push(new dot_1.Dot(185, 654, 1, -1, -1, 653, 655));
    dots.push(new dot_1.Dot(186, 655, 1, -1, -1, 654, 656));
    dots.push(new dot_1.Dot(187, 656, 1, -1, 684, 655, -1));
    dots.push(new dot_1.Dot(188, 659, 1, -1, 687, -1, 660));
    dots.push(new dot_1.Dot(189, 660, 1, -1, -1, 659, 661));
    dots.push(new dot_1.Dot(190, 661, 1, -1, -1, 660, 662));
    dots.push(new dot_1.Dot(191, 662, 1, 634, -1, 661, 663));
    dots.push(new dot_1.Dot(192, 663, 1, -1, -1, 662, 664));
    dots.push(new dot_1.Dot(193, 664, 1, -1, -1, 663, 665));
    dots.push(new dot_1.Dot(194, 665, 1, 637, 693, 664, 666));
    dots.push(new dot_1.Dot(195, 666, 1, -1, -1, 665, 667));
    dots.push(new dot_1.Dot(196, 667, 1, -1, -1, 666, 668));
    dots.push(new dot_1.Dot(197, 668, 1, -1, -1, 667, 669));
    dots.push(new dot_1.Dot(198, 669, 1, -1, -1, 668, 670));
    dots.push(new dot_1.Dot(199, 670, 1, -1, 698, 669, -1));
    dots.push(new dot_1.Dot(200, 673, 1, 645, 701, -1, -1));
    dots.push(new dot_1.Dot(201, 678, 1, 650, 706, -1, -1));
    dots.push(new dot_1.Dot(202, 684, 1, 656, 712, -1, -1));
    dots.push(new dot_1.Dot(203, 687, 1, 659, 715, -1, -1));
    dots.push(new dot_1.Dot(204, 693, 1, 665, 721, -1, -1));
    dots.push(new dot_1.Dot(205, 698, 1, 670, 726, -1, -1));
    dots.push(new dot_1.Dot(206, 701, 1, 673, 729, -1, -1));
    dots.push(new dot_1.Dot(207, 706, 1, 678, 734, -1, -1));
    dots.push(new dot_1.Dot(208, 712, 1, 684, 740, -1, -1));
    dots.push(new dot_1.Dot(209, 715, 1, 687, 743, -1, -1));
    dots.push(new dot_1.Dot(210, 721, 1, 693, 749, -1, -1));
    dots.push(new dot_1.Dot(211, 726, 1, 698, 754, -1, -1));
    dots.push(new dot_1.Dot(212, 729, 2, 701, -1, -1, 730));
    dots.push(new dot_1.Dot(213, 730, 1, -1, -1, 729, 731));
    dots.push(new dot_1.Dot(214, 731, 1, -1, 759, 730, -1));
    dots.push(new dot_1.Dot(215, 734, 1, 706, 762, -1, 735));
    dots.push(new dot_1.Dot(216, 735, 1, -1, -1, 734, 736));
    dots.push(new dot_1.Dot(217, 736, 1, -1, -1, 735, 737));
    dots.push(new dot_1.Dot(218, 737, 1, -1, 765, 736, 738));
    dots.push(new dot_1.Dot(219, 738, 1, -1, -1, 737, 739));
    dots.push(new dot_1.Dot(220, 739, 1, -1, -1, 738, 740));
    dots.push(new dot_1.Dot(221, 740, 1, 712, -1, 739, 741));
    dots.push(new dot_1.Dot(222, 741, 0, -1, -1, 740, 742));
    dots.push(new dot_1.Dot(223, 742, 0, -1, -1, 741, 743));
    dots.push(new dot_1.Dot(224, 743, 1, 715, -1, 742, 744));
    dots.push(new dot_1.Dot(225, 744, 1, -1, -1, 743, 745));
    dots.push(new dot_1.Dot(226, 745, 1, -1, -1, 744, 746));
    dots.push(new dot_1.Dot(227, 746, 1, -1, 774, 745, 747));
    dots.push(new dot_1.Dot(228, 747, 1, -1, -1, 746, 748));
    dots.push(new dot_1.Dot(229, 748, 1, -1, -1, 747, 749));
    dots.push(new dot_1.Dot(230, 749, 1, 721, 777, 748, -1));
    dots.push(new dot_1.Dot(231, 752, 1, -1, 780, -1, 753));
    dots.push(new dot_1.Dot(232, 753, 1, -1, -1, 752, 754));
    dots.push(new dot_1.Dot(233, 754, 2, 726, -1, 753, -1));
    dots.push(new dot_1.Dot(234, 759, 1, 731, 787, -1, -1));
    dots.push(new dot_1.Dot(235, 762, 1, 734, 790, -1, -1));
    dots.push(new dot_1.Dot(236, 765, 1, 737, 793, -1, -1));
    dots.push(new dot_1.Dot(237, 774, 1, 746, 802, -1, -1));
    dots.push(new dot_1.Dot(238, 777, 1, 749, 805, -1, -1));
    dots.push(new dot_1.Dot(239, 780, 1, 752, 808, -1, -1));
    dots.push(new dot_1.Dot(240, 787, 1, 759, 815, -1, -1));
    dots.push(new dot_1.Dot(241, 790, 1, 762, 818, -1, -1));
    dots.push(new dot_1.Dot(242, 793, 1, 765, 821, -1, -1));
    dots.push(new dot_1.Dot(243, 802, 1, 774, 830, -1, -1));
    dots.push(new dot_1.Dot(244, 805, 1, 777, 833, -1, -1));
    dots.push(new dot_1.Dot(245, 808, 1, 780, 836, -1, -1));
    dots.push(new dot_1.Dot(246, 813, 1, -1, 841, -1, 814));
    dots.push(new dot_1.Dot(247, 814, 1, -1, -1, 813, 815));
    dots.push(new dot_1.Dot(248, 815, 1, 787, -1, 814, 816));
    dots.push(new dot_1.Dot(249, 816, 1, -1, -1, 815, 817));
    dots.push(new dot_1.Dot(250, 817, 1, -1, -1, 816, 818));
    dots.push(new dot_1.Dot(251, 818, 1, 790, -1, 817, -1));
    dots.push(new dot_1.Dot(252, 821, 1, 793, -1, -1, 822));
    dots.push(new dot_1.Dot(253, 822, 1, -1, -1, 821, 823));
    dots.push(new dot_1.Dot(254, 823, 1, -1, -1, 822, 824));
    dots.push(new dot_1.Dot(255, 824, 1, -1, 852, 823, -1));
    dots.push(new dot_1.Dot(256, 827, 1, -1, 855, -1, 828));
    dots.push(new dot_1.Dot(257, 828, 1, -1, -1, 827, 829));
    dots.push(new dot_1.Dot(258, 829, 1, -1, -1, 828, 830));
    dots.push(new dot_1.Dot(259, 830, 1, 802, -1, 829, -1));
    dots.push(new dot_1.Dot(260, 833, 1, 805, -1, -1, 834));
    dots.push(new dot_1.Dot(261, 834, 1, -1, -1, 833, 835));
    dots.push(new dot_1.Dot(262, 835, 1, -1, -1, 834, 836));
    dots.push(new dot_1.Dot(263, 836, 1, 808, -1, 835, 837));
    dots.push(new dot_1.Dot(264, 837, 1, -1, -1, 836, 838));
    dots.push(new dot_1.Dot(265, 838, 1, -1, 866, 837, -1));
    dots.push(new dot_1.Dot(266, 841, 1, 813, 869, -1, -1));
    dots.push(new dot_1.Dot(267, 852, 1, 824, 880, -1, -1));
    dots.push(new dot_1.Dot(268, 855, 1, 827, 883, -1, -1));
    dots.push(new dot_1.Dot(269, 866, 1, 838, 894, -1, -1));
    dots.push(new dot_1.Dot(270, 869, 1, 841, 897, -1, -1));
    dots.push(new dot_1.Dot(271, 880, 1, 852, 908, -1, -1));
    dots.push(new dot_1.Dot(272, 883, 1, 855, 911, -1, -1));
    dots.push(new dot_1.Dot(273, 894, 1, 866, 922, -1, -1));
    dots.push(new dot_1.Dot(274, 897, 1, 869, -1, -1, 898));
    dots.push(new dot_1.Dot(275, 898, 1, -1, -1, 897, 899));
    dots.push(new dot_1.Dot(276, 899, 1, -1, -1, 898, 900));
    dots.push(new dot_1.Dot(277, 900, 1, -1, -1, 899, 901));
    dots.push(new dot_1.Dot(278, 901, 1, -1, -1, 900, 902));
    dots.push(new dot_1.Dot(279, 902, 1, -1, -1, 901, 903));
    dots.push(new dot_1.Dot(280, 903, 1, -1, -1, 902, 904));
    dots.push(new dot_1.Dot(281, 904, 1, -1, -1, 903, 905));
    dots.push(new dot_1.Dot(282, 905, 1, -1, -1, 904, 906));
    dots.push(new dot_1.Dot(283, 906, 1, -1, -1, 905, 907));
    dots.push(new dot_1.Dot(284, 907, 1, -1, -1, 906, 908));
    dots.push(new dot_1.Dot(285, 908, 1, 880, -1, 907, 909));
    dots.push(new dot_1.Dot(286, 909, 1, -1, -1, 908, 910));
    dots.push(new dot_1.Dot(287, 910, 1, -1, -1, 909, 911));
    dots.push(new dot_1.Dot(288, 911, 1, 883, -1, 910, 912));
    dots.push(new dot_1.Dot(289, 912, 1, -1, -1, 911, 913));
    dots.push(new dot_1.Dot(290, 913, 1, -1, -1, 912, 914));
    dots.push(new dot_1.Dot(291, 914, 1, -1, -1, 913, 915));
    dots.push(new dot_1.Dot(292, 915, 1, -1, -1, 914, 916));
    dots.push(new dot_1.Dot(293, 916, 1, -1, -1, 915, 917));
    dots.push(new dot_1.Dot(294, 917, 1, -1, -1, 916, 918));
    dots.push(new dot_1.Dot(295, 918, 1, -1, -1, 917, 919));
    dots.push(new dot_1.Dot(296, 919, 1, -1, -1, 918, 920));
    dots.push(new dot_1.Dot(297, 920, 1, -1, -1, 919, 921));
    dots.push(new dot_1.Dot(298, 921, 1, -1, -1, 920, 922));
    dots.push(new dot_1.Dot(299, 922, 1, 894, -1, 921, -1));
    var game = new viewer_1.PePacmanGame(28, 36, 16, walls, dots);
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Wall = (function () {
    function Wall(tiles, closed) {
        this.tiles = tiles;
        this.closed = closed;
    }
    return Wall;
}());
exports.Wall = Wall;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dot = (function () {
    function Dot(spot, tile, kind, up, down, left, right) {
        this.spot = spot;
        this.tile = tile;
        this.kind = kind;
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.alive = true;
    }
    Dot.prototype.is_alive = function () {
        return this.alive;
    };
    Dot.prototype.pick_up = function () {
        this.alive = false;
    };
    Dot.prototype.get_neighbor = function (dir) {
        if (dir == 0) {
            return this.up;
        }
        else if (dir == 1) {
            return this.down;
        }
        else if (dir == 2) {
            return this.left;
        }
        else if (dir == 3) {
            return this.right;
        }
        else {
            throw new Error("Direction must be in {0, 1, 2, 3}");
        }
    };
    return Dot;
}());
exports.Dot = Dot;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = __webpack_require__(9);
var pacman_1 = __webpack_require__(10);
var ghost_1 = __webpack_require__(11);
var dynamics_1 = __webpack_require__(12);
var pacman_sprite_1 = __webpack_require__(13);
var wall_sprite_1 = __webpack_require__(14);
var dot_sprite_1 = __webpack_require__(16);
var ghost_box_1 = __webpack_require__(17);
var ghost_box_sprite_1 = __webpack_require__(18);
var ghost_sprite_1 = __webpack_require__(19);
var keyboard_controller_1 = __webpack_require__(20);
var red_ghost_controller_1 = __webpack_require__(21);
var pacman_post_1 = __webpack_require__(22);
var prob_sprite_1 = __webpack_require__(23);
var assign_prob_1 = __webpack_require__(2);
var closest_rwPacman_post_1 = __webpack_require__(24);
var PePacmanGame = (function (_super) {
    __extends(PePacmanGame, _super);
    function PePacmanGame(num_tiles_x, num_tiles_y, tile_dim, walls, dots) {
        var _this = this;
        var state = new PePacmanState(num_tiles_x, num_tiles_y, tile_dim, walls, dots);
        _this = _super.call(this, num_tiles_x * tile_dim, num_tiles_y * tile_dim, Phaser.AUTO, 'pe-pacman-game', state) || this;
        return _this;
    }
    return PePacmanGame;
}(Phaser.Game));
exports.PePacmanGame = PePacmanGame;
var PePacmanState = (function (_super) {
    __extends(PePacmanState, _super);
    function PePacmanState(num_tiles_x, num_tiles_y, tile_dim, walls, dots) {
        var _this = _super.call(this) || this;
        _this.num_tiles_x = num_tiles_x;
        _this.num_tiles_y = num_tiles_y;
        _this.tile_dim = tile_dim;
        _this.walls = walls;
        _this.dots = dots;
        _this.score = 0;
        _this.restart = false;
        _this.dotCount = 0;
        _this.win = true;
        return _this;
    }
    PePacmanState.prototype.preload = function () {
        this.game.load.image('RedUp', 'red-up.png');
        this.game.load.image('RedDown', 'red-down.png');
        this.game.load.image('RedLeft', 'red-left.png');
        this.game.load.image('RedRight', 'red-right.png');
        this.game.load.image('PinkUp', 'pink-up.png');
        this.game.load.image('PinkDown', 'pink-down.png');
        this.game.load.image('PinkLeft', 'pink-left.png');
        this.game.load.image('PinkRight', 'pink-right.png');
        this.game.load.image('BlueUp', 'blue-up.png');
        this.game.load.image('BlueDown', 'blue-down.png');
        this.game.load.image('BlueLeft', 'blue-left.png');
        this.game.load.image('BlueRight', 'blue-right.png');
        this.game.load.image('OrangeUp', 'orange-up.png');
        this.game.load.image('OrangeDown', 'orange-down.png');
        this.game.load.image('OrangeLeft', 'orange-left.png');
        this.game.load.image('OrangeRight', 'orange-right.png');
        this.game.load.image('VulnerableGhost', 'vulnerable-ghost.png');
        this.game.load.spritesheet('Pacman', 'Pacman.png', 32, 32, 49);
        this.game.load.spritesheet('Death', 'death.png', 32, 32, 54);
    };
    PePacmanState.prototype.create = function () {
        this.load.start();
        this.game.time.slowMotion = 20.0;
        this.overText = this.game.add.text(180, 20, 'Game Over', { font: '16px Arial', fill: '#fff' });
        this.overText.visible = false;
        this.powerText = this.game.add.text(100, 0, 'Power time:' + 0, { font: '16px Arial', fill: '#fff' });
        this.powerText.visible = true;
        this.scoreText = this.game.add.text(0, 0, 'Score:', { font: '16px Arial', fill: '#fff' });
        this.scoreText.visible = true;
        this.winText = this.game.add.text(180, 20, 'You win!!!', { font: '16px Arial', fill: '#fff' });
        this.winText.visible = false;
        this.timeText = this.game.add.text(300, 0, 'Time:' + 0, { font: '16px Arial', fill: '#fff' });
        this.timeText.visible = true;
        this.board = new board_1.Board(this.num_tiles_x, this.num_tiles_y, this.dots);
        this.pacman = new pacman_1.Pacman(this.board, 14.5, 26.5, 1);
        this.box = new ghost_box_1.GhostBox(this.board, 10, 15, 8, 5, [new ghost_box_1.Slot(12, 17, 12, 17.5, 12, 18), new ghost_box_1.Slot(14, 17, 14, 17.5, 14, 18), new ghost_box_1.Slot(16, 17, 16, 17.5, 16, 18)]);
        this.ghosts = new Array();
        for (var i = 0; i < 4; i++) {
            if (i != 3) {
                this.ghosts.push(new ghost_1.Ghost(this.board, false, null, null, 1, this.box));
            }
            else {
                this.ghosts.push(new ghost_1.Ghost(this.board, true, 14, 14.5, 1, this.box));
            }
        }
        this.ghost_controllers = new red_ghost_controller_1.RedGhostController(this.ghosts, this.board);
        var test = JSON.parse(localStorage.getItem('param_list'));
        for (var k = 0; k < 256; k++) {
            console.log('test' + k + ': ' + test[1][k]);
        }
        this.pacman_controller = new keyboard_controller_1.KeyboardController(this.game.input.keyboard, this.pacman, this.board);
        this.posts = new Array();
        this.posts.push(new pacman_post_1.RwPacmanPost(this.board, this.ghosts, this.pacman, [this.pacman.spot], 5));
        this.posts.push(new closest_rwPacman_post_1.ClosestRwPacmanPost(this.board, this.ghosts, this.pacman, [this.pacman.spot], 5, 0.1));
        for (var b = 0; b < this.posts.length; b++) {
            this.posts[b].update(-1);
            this.posts[b].num_points = 0;
        }
        this.dynamics = new dynamics_1.Dynamics(this.pacman, this.ghosts, this.board, this.pacman_controller, this.ghost_controllers, this.posts, this);
        this.tick = 0;
        this.wall_sprites = new Array();
        this.dot_sprites = new Array();
        this.pacman_sprite = new pacman_sprite_1.PacmanSprite(this.game, this.dynamics.board, this.tile_dim, this.dynamics.pacman);
        this.pacman_sprite.loadTexture('Pacman');
        this.pacman_sprite.width = this.pacman_sprite.tile_dim * 1.5;
        this.pacman_sprite.height = this.pacman_sprite.tile_dim * 1.5;
        this.pacman_sprite.frame = 42;
        this.pacman_sprite.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 14, true);
        this.pacman_sprite.animations.add('down', [14, 15, 16, 17, 18, 19, 20], 14, true);
        this.pacman_sprite.animations.add('left', [28, 29, 30, 31, 32, 33, 34], 14, true);
        this.pacman_sprite.animations.add('up', [42, 43, 44, 45, 46, 47, 48], 14, true);
        this.pacman_sprite.animations.play('up');
        this.ghost_sprites = new Array();
        var c = 0;
        for (var _i = 0, _a = this.ghosts; _i < _a.length; _i++) {
            var g = _a[_i];
            var GS = new ghost_sprite_1.GhostSprite(this.game, this.dynamics.board, this.tile_dim, g);
            if (c == 0) {
                GS.loadTexture('RedUp');
            }
            if (c == 1) {
                GS.loadTexture('PinkDown');
            }
            if (c == 2) {
                GS.loadTexture('BlueUp');
            }
            if (c == 3) {
                GS.loadTexture('OrangeDown');
            }
            c++;
            GS.width = GS.tile_dim * 1.5;
            GS.height = GS.tile_dim * 1.5;
            this.ghost_sprites.push(GS);
        }
        var target_spots = (new assign_prob_1.ProbAssign(this.board, this.ghosts, this.posts[0].probs)).bestProbs();
        this.prob_sprites = new Array();
        for (var i = 0; i < this.ghosts.length; i++) {
            this.prob_sprites.push(new prob_sprite_1.ProbSprite(this.game, this.dynamics.board, this.tile_dim, target_spots[i]));
        }
        for (var i = 0; i < this.ghosts.length; i++) {
            this.prob_sprites[i].visible = false;
        }
        for (var _b = 0, _c = this.walls; _b < _c.length; _b++) {
            var wall = _c[_b];
            this.wall_sprites.push(new wall_sprite_1.WallSprite(this.game, this.dynamics.board, this.tile_dim, wall));
        }
        for (var _d = 0, _e = this.dynamics.board.dots; _d < _e.length; _d++) {
            var dot = _e[_d];
            this.dot_sprites.push(new dot_sprite_1.DotSprite(this.game, this.dynamics.board, this.tile_dim, dot));
        }
        this.box_sprite = new ghost_box_sprite_1.GhostBoxSprite(this.game, this.dynamics.board, this.tile_dim, this.box);
    };
    PePacmanState.prototype.update = function () {
        if (this.restart == false) {
            var x = this.dynamics.pacman.x;
            this.dynamics.update();
            var c = 0;
            for (var _i = 0, _a = this.ghost_sprites; _i < _a.length; _i++) {
                var gs = _a[_i];
                if (c == 0) {
                    if (this.dynamics.power_time == 0) {
                        if (gs.ghost.action == 0) {
                            gs.loadTexture('RedUp');
                        }
                        if (gs.ghost.action == 1) {
                            gs.loadTexture('RedDown');
                        }
                        if (gs.ghost.action == 2) {
                            gs.loadTexture('RedLeft');
                        }
                        if (gs.ghost.action == 3) {
                            gs.loadTexture('RedRight');
                        }
                    }
                    else {
                        gs.loadTexture('VulnerableGhost');
                    }
                }
                if (c == 1) {
                    if (this.dynamics.power_time == 0) {
                        if (gs.ghost.action == 0) {
                            gs.loadTexture('PinkUp');
                        }
                        if (gs.ghost.action == 1) {
                            gs.loadTexture('PinkDown');
                        }
                        if (gs.ghost.action == 2) {
                            gs.loadTexture('PinkLeft');
                        }
                        if (gs.ghost.action == 3) {
                            gs.loadTexture('PinkRight');
                        }
                    }
                    else {
                        gs.loadTexture('VulnerableGhost');
                    }
                }
                if (c == 2) {
                    if (this.dynamics.power_time == 0) {
                        if (gs.ghost.action == 0) {
                            gs.loadTexture('BlueUp');
                        }
                        if (gs.ghost.action == 1) {
                            gs.loadTexture('BlueDown');
                        }
                        if (gs.ghost.action == 2) {
                            gs.loadTexture('BlueLeft');
                        }
                        if (gs.ghost.action == 3) {
                            gs.loadTexture('BlueRight');
                        }
                    }
                    else {
                        gs.loadTexture('VulnerableGhost');
                    }
                }
                if (c == 3) {
                    if (this.dynamics.power_time == 0) {
                        if (gs.ghost.action == 0) {
                            gs.loadTexture('OrangeUp');
                        }
                        if (gs.ghost.action == 1) {
                            gs.loadTexture('OrangeDown');
                        }
                        if (gs.ghost.action == 2) {
                            gs.loadTexture('OrangeLeft');
                        }
                        if (gs.ghost.action == 3) {
                            gs.loadTexture('OrangeRight');
                        }
                    }
                    else {
                        gs.loadTexture('VulnerableGhost');
                    }
                }
                c++;
            }
            if (this.pacman_sprite.pacman.action == 0) {
                this.pacman_sprite.animations.play('up');
            }
            if (this.pacman_sprite.pacman.action == 1) {
                this.pacman_sprite.animations.play('down');
            }
            if (this.pacman_sprite.pacman.action == 2) {
                this.pacman_sprite.animations.play('left');
            }
            if (this.pacman_sprite.pacman.action == 3) {
                this.pacman_sprite.animations.play('right');
            }
        }
        else {
            for (var _b = 0, _c = this.prob_sprites; _b < _c.length; _b++) {
                var ps = _c[_b];
                ps.visible = false;
            }
            if (this.win === false) {
                this.pacman_sprite.visible = false;
            }
            else {
                this.game.paused = true;
            }
        }
    };
    PePacmanState.prototype.render = function () {
    };
    return PePacmanState;
}(Phaser.State));
exports.PePacmanState = PePacmanState;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Board = (function () {
    function Board(num_tiles_x, num_tiles_y, dots) {
        this.num_tiles_x = num_tiles_x;
        this.num_tiles_y = num_tiles_y;
        this.dots = dots;
        this.tile_to_spot = new Array();
        for (var _i = 0, _a = this.dots; _i < _a.length; _i++) {
            var dot_1 = _a[_i];
            this.tile_to_spot[dot_1.tile] = dot_1.spot;
        }
        this.trans_mat_random = new Array(this.dots.length);
        for (var i = 0; i < this.dots.length; i++) {
            this.trans_mat_random[i] = new Array(this.dots.length);
            var dot = this.get_dot(i, true);
            var walkable_spots = new Array();
            if (dot.up >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.up]);
            }
            if (dot.down >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.down]);
            }
            if (dot.left >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.left]);
            }
            if (dot.right >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.right]);
            }
            var prob = 1 / walkable_spots.length;
            for (var j = 0; j < this.dots.length; j++) {
                if (walkable_spots.indexOf(j) >= 0) {
                    this.trans_mat_random[i][j] = prob;
                }
                else {
                    this.trans_mat_random[i][j] = 0;
                }
            }
        }
        this.trans_mat_random_new = new Array(this.dots.length);
        for (var i = 0; i < this.dots.length; i++) {
            this.trans_mat_random_new[i] = new Array(this.dots.length);
            var dot = this.get_dot(i, true);
            var walkable_spots = new Array();
            if (dot.up >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.up]);
            }
            if (dot.down >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.down]);
            }
            if (dot.left >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.left]);
            }
            if (dot.right >= 0) {
                walkable_spots.push(this.tile_to_spot[dot.right]);
            }
            for (var j = 0; j < this.dots.length; j++) {
                if (walkable_spots.indexOf(j) >= 0) {
                    this.trans_mat_random_new[i][j] = 1 / 4;
                }
                else if (j === i) {
                    this.trans_mat_random_new[i][j] = (4 - walkable_spots.length) / 4;
                }
                else {
                    this.trans_mat_random_new[i][j] = 0;
                }
            }
        }
    }
    Board.prototype.get_dot = function (index, is_spot) {
        if (is_spot) {
            if (index < this.dots.length) {
                return this.dots[index];
            }
            else {
                throw new RangeError("index " + index
                    + " is larget than walkable dots");
            }
        }
        else {
            var converted = this.tile_to_spot[index];
            if (converted === undefined) {
                throw new RangeError("index " + index
                    + " returns an invalid "
                    + "walkable index");
            }
            else {
                return this.dots[converted];
            }
        }
    };
    Board.prototype.dist = function (x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };
    return Board;
}());
exports.Board = Board;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var unit_1 = __webpack_require__(0);
var Pacman = (function (_super) {
    __extends(Pacman, _super);
    function Pacman(board, x, y, ticks_per_spot) {
        return _super.call(this, board, true, x, y, ticks_per_spot) || this;
    }
    return Pacman;
}(unit_1.Unit));
exports.Pacman = Pacman;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var unit_1 = __webpack_require__(0);
var Ghost = (function (_super) {
    __extends(Ghost, _super);
    function Ghost(board, alive, x, y, ticks_per_spot, box) {
        var _this = _super.call(this, board, alive, x, y, ticks_per_spot) || this;
        _this.box = box;
        if (!_this.is_alive()) {
            _this.route = _this.box.assign_slot();
            _this.x = _this.route.dest_x;
            _this.y = _this.route.dest_y;
            _this.route_counts = 0;
        }
        return _this;
    }
    Ghost.prototype.dead_move = function () {
        if (this.route.dest_type == 5) {
            this.alive = true;
            var tile = Math.floor(this.y) * this.board.num_tiles_x +
                Math.floor(this.x);
            this.spot = this.board.get_dot(tile, false).spot;
            this.dest_spot = this.spot;
            this.motion = 0;
        }
        else {
            var dist_to_move = 1.0 / this.ticks_per_spot;
            var dist_to_dest = Math.sqrt((this.x - this.route.dest_x) * (this.x - this.route.dest_x)
                + (this.y - this.route.dest_y) * (this.y - this.route.dest_y));
            if (dist_to_move + this.move_eps > dist_to_dest) {
                this.x = this.route.dest_x;
                this.y = this.route.dest_y;
                ++this.route_counts;
                if (this.route_counts > 6) {
                    this.route = this.box.update_route(this.route, true);
                }
                else {
                    this.route = this.box.update_route(this.route, false);
                }
            }
            else {
                var alpha = dist_to_move / dist_to_dest;
                this.x = this.x * (1.0 - alpha) + this.route.dest_x * alpha;
                this.y = this.y * (1.0 - alpha) + this.route.dest_y * alpha;
            }
        }
    };
    return Ghost;
}(unit_1.Unit));
exports.Ghost = Ghost;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dynamics = (function () {
    function Dynamics(pacman, ghosts, board, pacman_controller, ghost_controllers, posts, state) {
        this.pacman = pacman;
        this.ghosts = ghosts;
        this.board = board;
        this.pacman_controller = pacman_controller;
        this.ghost_controllers = ghost_controllers;
        this.posts = posts;
        this.state = state;
        this.power_time = 0;
        this.memory_dots = new Array();
        this.memory_energy_dots = new Array();
        this.informant = -1;
    }
    Dynamics.prototype.update = function () {
        this.state.tick += 1;
        this.state.timeText.text = 'Time:' + this.state.tick;
        if (this.pacman.is_alive()) {
            this.pacman_controller.assign_actions(this.pacman_controller.select_actions(this.pacman, this.ghosts, this.posts));
        }
        this.ghost_controllers.assign_actions(this.ghost_controllers.select_actions(this.pacman, this.ghosts, this.posts));
        for (var i = 0; i < this.ghosts.length; i++) {
            this.state.prob_sprites[i].target_spot = this.ghost_controllers.target_spots[i];
            this.state.prob_sprites[i].update();
        }
        this.pacman.move();
        for (var _i = 0, _a = this.ghosts; _i < _a.length; _i++) {
            var g = _a[_i];
            g.move();
        }
        this.informant = -1;
        var dot = this.board.get_dot(this.pacman.spot, true);
        if (dot.is_alive()) {
            dot.pick_up();
            if (dot.kind === 1) {
                this.state.score += 10;
                this.informant = this.pacman.spot;
                this.state.dotCount += 1;
            }
            if (dot.kind === 2) {
                this.power_time += 10;
                this.state.score += 50;
                this.informant = this.pacman.spot;
                this.state.dotCount += 1;
            }
            if (this.state.dotCount === 236) {
                this.state.restart = true;
                this.state.winText.visible = true;
            }
        }
        for (var b = 0; b < this.posts.length; b++) {
            this.posts[b].update(this.informant);
        }
        this.state.powerText.text = 'Power time:' + this.power_time;
        this.state.scoreText.text = 'Score:' + this.state.score;
        if (this.power_time > 0) {
            for (var _b = 0, _c = this.ghosts; _b < _c.length; _b++) {
                var g = _c[_b];
                g.ticks_per_spot = 10;
                if (this.pacman.x >= g.x - 1 && this.pacman.x <= g.x + 1 &&
                    this.pacman.y >= g.y - 1 && this.pacman.y <= g.y + 1) {
                    g.alive = false;
                    g.route = g.box.assign_slot();
                    g.x = g.route.dest_x;
                    g.y = g.route.dest_y;
                    g.route_counts = 0;
                    this.state.score += 50;
                    this.state.scoreText.text = 'Score:' + this.state.score;
                }
            }
            this.power_time--;
        }
        else {
            for (var _d = 0, _e = this.ghosts; _d < _e.length; _d++) {
                var g = _e[_d];
                g.ticks_per_spot = 1;
                if (this.pacman.x >= g.x - 1 && this.pacman.x <= g.x + 1 &&
                    this.pacman.y >= g.y - 1 && this.pacman.y <= g.y + 1) {
                    var death = this.state.game.add.sprite((this.pacman.x - 0.5) * this.state.tile_dim, (this.pacman.y - 1) * this.state.tile_dim, 'Death');
                    death.width = this.state.tile_dim * 1.5;
                    death.height = this.state.tile_dim * 1.5;
                    death.frame = 51;
                    death.animations.add('ani', [51, 42, 43, 44], 2, false);
                    death.animations.play('ani');
                    this.state.overText.visible = true;
                    this.state.win = false;
                    this.state.restart = true;
                }
            }
        }
    };
    Dynamics.prototype.restart = function () {
        this.state.overText.visible = true;
        this.state.game.state.restart();
        this.state.restart = false;
    };
    return Dynamics;
}());
exports.Dynamics = Dynamics;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PacmanSprite = (function (_super) {
    __extends(PacmanSprite, _super);
    function PacmanSprite(viewer, board, tile_dim, pacman) {
        var _this = _super.call(this, viewer, 0, 0) || this;
        _this.board = board;
        _this.pacman = pacman;
        _this.tile_dim = tile_dim;
        _this.anchor.x = 0.5;
        _this.anchor.y = 0.5;
        _this.position.x = _this.pacman.x * tile_dim;
        _this.position.y = _this.pacman.y * tile_dim;
        viewer.add.existing(_this);
        return _this;
    }
    PacmanSprite.prototype.update = function () {
        this.position.x = this.pacman.x * this.tile_dim;
        this.position.y = this.pacman.y * this.tile_dim;
    };
    return PacmanSprite;
}(Phaser.Sprite));
exports.PacmanSprite = PacmanSprite;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var coord_1 = __webpack_require__(15);
var WallSprite = (function (_super) {
    __extends(WallSprite, _super);
    function WallSprite(viewer, board, tile_dim, wall) {
        var _this = this;
        var start_c = coord_1.Coord.from_tile(wall.tiles[0], board.num_tiles_x, board.num_tiles_y, tile_dim);
        var min_x = Infinity;
        var max_x = -Infinity;
        var min_y = Infinity;
        var max_y = -Infinity;
        for (var _i = 0, _a = wall.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            var c = coord_1.Coord.from_tile(tile, board.num_tiles_x, board.num_tiles_y, tile_dim);
            min_x = Math.min(min_x, c.x);
            max_x = Math.max(max_x, c.x + tile_dim);
            min_y = Math.min(min_y, c.y);
            max_y = Math.max(max_y, c.y + tile_dim);
        }
        var width = max_x - min_x;
        var height = max_y - min_y;
        var g = new Phaser.Graphics(viewer, 0, 0);
        g.lineStyle(0.25 * tile_dim, 0x0000ff, 1);
        g.moveTo(start_c.x - min_x + tile_dim * 0.5, start_c.y - min_y + tile_dim * 0.5);
        for (var _b = 0, _c = wall.tiles; _b < _c.length; _b++) {
            var tile = _c[_b];
            var c = coord_1.Coord.from_tile(tile, board.num_tiles_x, board.num_tiles_y, tile_dim);
            var x = c.x - min_x + tile_dim * 0.5;
            var y = c.y - min_y + tile_dim * 0.5;
            g.lineTo(x, y);
        }
        if (wall.closed) {
            var x = start_c.x - min_x + tile_dim * 0.5;
            var y = start_c.y - min_y + tile_dim * 0.5;
            g.lineTo(x, y);
        }
        g.endFill();
        _this = _super.call(this, viewer, min_x + tile_dim * 0.25, min_y + tile_dim * 0.25, g.generateTexture()) || this;
        viewer.add.existing(_this);
        return _this;
    }
    return WallSprite;
}(Phaser.Sprite));
exports.WallSprite = WallSprite;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Coord = (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    Coord.from_tile = function (tile, num_tiles_x, num_tiles_y, tile_dim) {
        var tile_x = tile % num_tiles_x;
        var tile_y = Math.floor(tile / num_tiles_x);
        var x = tile_x * tile_dim;
        var y = tile_y * tile_dim;
        return new Coord(x, y);
    };
    return Coord;
}());
exports.Coord = Coord;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DotSprite = (function (_super) {
    __extends(DotSprite, _super);
    function DotSprite(viewer, board, tile_dim, dot) {
        var _this = this;
        var g = new Phaser.Graphics(viewer, 0, 0);
        var x = (dot.tile % board.num_tiles_x) * tile_dim;
        var y = Math.floor(dot.tile / board.num_tiles_x) * tile_dim;
        g.beginFill(0xF5CBA7);
        if (dot.kind == 1) {
            g.drawCircle(0, 0, tile_dim * 0.3);
            x += tile_dim * 0.7 / 2;
            y += tile_dim * 0.7 / 2;
        }
        else if (dot.kind == 2) {
            g.drawCircle(0, 0, tile_dim);
        }
        g.endFill();
        _this = _super.call(this, viewer, x, y, g.generateTexture()) || this;
        _this.dot = dot;
        viewer.add.existing(_this);
        return _this;
    }
    DotSprite.prototype.update = function () {
        if (!this.dot.is_alive()) {
            this.kill();
        }
    };
    return DotSprite;
}(Phaser.Sprite));
exports.DotSprite = DotSprite;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GhostBox = (function () {
    function GhostBox(board, x, y, width, height, slots) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.slots = slots;
        this.num_slots = this.slots.length;
        this.occupants = new Array();
        for (var i = 0; i < this.num_slots; ++i) {
            this.occupants[i] = 0;
        }
    }
    GhostBox.prototype.assign_slot = function () {
        var best_slot = 0;
        var best_occ = Infinity;
        for (var i = 0; i < this.num_slots; ++i) {
            if (this.occupants[i] < best_occ) {
                best_slot = i;
                best_occ = this.occupants[i];
            }
        }
        this.occupants[best_slot]++;
        var sr = new SlotRoute(best_slot, 1, 0, this.slots[best_slot].center_x, this.slots[best_slot].center_y);
        return sr;
    };
    GhostBox.prototype.update_route = function (curr_sr, done) {
        if (curr_sr.dest_type == 0 && curr_sr.motion == 0) {
            return new SlotRoute(curr_sr.index, 1, 1, this.slots[curr_sr.index].center_x, this.slots[curr_sr.index].center_y);
        }
        else if (curr_sr.dest_type == 1 && curr_sr.motion == 0 && !done) {
            return new SlotRoute(curr_sr.index, 0, 0, this.slots[curr_sr.index].top_x, this.slots[curr_sr.index].top_y);
        }
        else if (curr_sr.dest_type == 1 && curr_sr.motion == 1 && !done) {
            return new SlotRoute(curr_sr.index, 2, 1, this.slots[curr_sr.index].bottom_x, this.slots[curr_sr.index].bottom_y);
        }
        else if (curr_sr.dest_type == 2 && curr_sr.motion == 1) {
            return new SlotRoute(curr_sr.index, 1, 0, this.slots[curr_sr.index].center_x, this.slots[curr_sr.index].center_y);
        }
        else if (curr_sr.dest_type == 1 && curr_sr.motion == 0 && done) {
            --this.occupants[curr_sr.index];
            return new SlotRoute(null, 3, null, this.x + 0.5 * this.width, this.y + 0.5 * this.height);
        }
        else if (curr_sr.dest_type == 1 && curr_sr.motion == 1 && done) {
            --this.occupants[curr_sr.index];
            return new SlotRoute(null, 3, null, this.x + 0.5 * this.width, this.y + 0.5 * this.height);
        }
        else if (curr_sr.dest_type == 3) {
            return new SlotRoute(null, 4, null, this.x + 0.5 * this.width, this.y - 0.5);
        }
        else if (curr_sr.dest_type == 4) {
            return new SlotRoute(null, 5, null, null, null);
        }
        else {
            throw new Error("Invalid combination of "
                + "dest type " + curr_sr.dest_type + ", "
                + "motion " + curr_sr.motion + ", and"
                + "done status " + done);
        }
    };
    return GhostBox;
}());
exports.GhostBox = GhostBox;
var Slot = (function () {
    function Slot(top_x, top_y, center_x, center_y, bottom_x, bottom_y) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.top_x = top_x;
        this.top_y = top_y;
        this.bottom_x = bottom_x;
        this.bottom_y = bottom_y;
    }
    return Slot;
}());
exports.Slot = Slot;
var SlotRoute = (function () {
    function SlotRoute(index, dest_type, motion, dest_x, dest_y) {
        this.index = index;
        this.dest_type = dest_type;
        this.motion = motion;
        this.dest_x = dest_x;
        this.dest_y = dest_y;
    }
    return SlotRoute;
}());
exports.SlotRoute = SlotRoute;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GhostBoxSprite = (function (_super) {
    __extends(GhostBoxSprite, _super);
    function GhostBoxSprite(viewer, board, tile_dim, box) {
        var _this = this;
        var g = new Phaser.Graphics(viewer, 0, 0);
        g.lineStyle(0.25 * tile_dim, 0x0000ff, 1);
        g.drawRect(0, 0, (box.width - 1.125) * tile_dim, (box.height - 1.125) * tile_dim);
        g.lineStyle(0.35 * tile_dim, 0xF5CBA7, 1);
        g.moveTo(((box.width - 1.125) * tile_dim) * 1.0 / 3.0, 0);
        g.lineTo(((box.width - 1.125) * tile_dim) * 2.0 / 3.0, 0);
        g.endFill();
        _this = _super.call(this, viewer, (box.x + 0.375) * tile_dim, (box.y + 0.375) * tile_dim, g.generateTexture()) || this;
        viewer.add.existing(_this);
        _this.board = board;
        _this.box = box;
        return _this;
    }
    return GhostBoxSprite;
}(Phaser.Sprite));
exports.GhostBoxSprite = GhostBoxSprite;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GhostSprite = (function (_super) {
    __extends(GhostSprite, _super);
    function GhostSprite(viewer, board, tile_dim, ghost) {
        var _this = _super.call(this, viewer, 0, 0) || this;
        _this.board = board;
        _this.ghost = ghost;
        _this.tile_dim = tile_dim;
        _this.anchor.x = 0.5;
        _this.anchor.y = 0.5;
        _this.position.x = _this.ghost.x * tile_dim;
        _this.position.y = _this.ghost.y * tile_dim;
        viewer.add.existing(_this);
        return _this;
    }
    GhostSprite.prototype.update = function () {
        this.position.x = this.ghost.x * this.tile_dim;
        this.position.y = this.ghost.y * this.tile_dim;
    };
    return GhostSprite;
}(Phaser.Sprite));
exports.GhostSprite = GhostSprite;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = __webpack_require__(1);
var KeyboardController = (function (_super) {
    __extends(KeyboardController, _super);
    function KeyboardController(keyboard, unit, board) {
        var _this = _super.call(this, [unit], board) || this;
        _this.last_press = -1;
        _this.upKey = keyboard.addKey(Phaser.Keyboard.UP);
        _this.upKey.onDown.add(function () {
            _this.last_press = 0;
        }, _this);
        _this.downKey = keyboard.addKey(Phaser.Keyboard.DOWN);
        _this.downKey.onDown.add(function () {
            _this.last_press = 1;
        }, _this);
        _this.leftKey = keyboard.addKey(Phaser.Keyboard.LEFT);
        _this.leftKey.onDown.add(function () {
            _this.last_press = 2;
        }, _this);
        _this.rightKey = keyboard.addKey(Phaser.Keyboard.RIGHT);
        _this.rightKey.onDown.add(function () {
            _this.last_press = 3;
        }, _this);
        return _this;
    }
    KeyboardController.prototype.select_actions = function (pacman, ghosts, posts) {
        if (posts === void 0) { posts = null; }
        return [this.last_press];
    };
    return KeyboardController;
}(controller_1.Controller));
exports.KeyboardController = KeyboardController;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = __webpack_require__(1);
var assign_prob_1 = __webpack_require__(2);
var RedGhostController = (function (_super) {
    __extends(RedGhostController, _super);
    function RedGhostController(units, board) {
        return _super.call(this, units, board) || this;
    }
    RedGhostController.prototype.select_actions = function (pacman, ghosts, posts, target_spot) {
        if (posts === void 0) { posts = null; }
        if (target_spot === void 0) { target_spot = null; }
        var best_motions = new Array(this.units.length);
        var prob_assign = new assign_prob_1.ProbAssign(this.board, ghosts, posts[0].probs);
        this.target_spots = prob_assign.probAssign();
        for (var i = 0; i < ghosts.length; i++) {
            if (this.units[i].is_alive()) {
                var target_dot = this.board.get_dot(pacman.spot, true);
                var target_x = target_dot.tile % this.board.num_tiles_x;
                var target_y = Math.floor(target_dot.tile
                    / this.board.num_tiles_x);
                var dest_dot;
                if (this.units[i].dest_spot === -1) {
                    dest_dot = this.board.get_dot(this.units[i].spot, true);
                }
                else {
                    dest_dot = this.board.get_dot(this.units[i].dest_spot, true);
                }
                var motion = this.units[i].motion;
                var best_motion = new Array();
                var second_best_motion = -1;
                var best_dist = Infinity;
                var x = dest_dot.tile % this.board.num_tiles_x;
                var y = Math.floor(dest_dot.tile / this.board.num_tiles_x);
                var dist = (target_x - x) * (target_x - x)
                    + (target_y - y) * (target_y - y);
                if (dest_dot.up >= 0 && motion != 1) {
                    var next_x = dest_dot.up % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.up / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(0);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 0;
                    }
                }
                if (dest_dot.left >= 0 && motion != 3) {
                    var next_x = dest_dot.left % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.left / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(2);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 2;
                    }
                }
                if (dest_dot.down >= 0 && motion != 0) {
                    var next_x = dest_dot.down % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.down / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(1);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 1;
                    }
                }
                if (dest_dot.right >= 0 && motion != 2) {
                    var next_x = dest_dot.right % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.right / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(3);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 3;
                    }
                }
                if (second_best_motion < 0) {
                    throw new Error("Did not find a valid move");
                }
                if (best_motion.length > 0) {
                    best_motions[i] = best_motion[Math.floor(Math.random() * best_motion.length)];
                }
                else {
                    best_motions[i] = second_best_motion;
                }
            }
        }
        return best_motions;
    };
    return RedGhostController;
}(controller_1.Controller));
exports.RedGhostController = RedGhostController;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var post_1 = __webpack_require__(3);
var RwPacmanPost = (function (_super) {
    __extends(RwPacmanPost, _super);
    function RwPacmanPost(board, ghosts, pacman, starting_loc_choices, ghost_vision_limit) {
        var _this = _super.call(this) || this;
        _this.board = board;
        _this.ghosts = ghosts;
        _this.pacman = pacman;
        _this.probs = new Array(_this.board.dots.length);
        _this.probs_new = new Array(_this.board.dots.length);
        _this.num_points = 0;
        _this.starting_loc_choices = starting_loc_choices;
        _this.ghost_vision_limit = ghost_vision_limit;
        _this.K = 1;
        _this.trans_mat = _this.board.trans_mat_random_new;
        console.log("transition matrix: " + _this.board.trans_mat_random[227][237]);
        return _this;
    }
    RwPacmanPost.prototype.update = function (informant) {
        var sum = 0;
        if (this.num_points === 0) {
            for (var i = 0; i < this.board.dots.length; i++) {
                if (this.starting_loc_choices.indexOf(i) >= 0) {
                    this.probs_new[i] = 1 / this.starting_loc_choices.length;
                }
                else {
                    this.probs_new[i] = 0;
                }
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                this.probs[i] = this.probs_new[i];
            }
            var end = 0;
            var prob_info = 1;
            var record = new Array();
            if (informant >= 0) {
                for (var i = 0; i < this.board.dots.length; i++) {
                    this.probs[i] = 0;
                }
                this.probs[this.pacman.spot] = 1;
                this.K *= this.probs_new[this.pacman.spot];
                end = 1;
            }
            else {
                for (var _i = 0, _a = this.board.dots; _i < _a.length; _i++) {
                    var dot_1 = _a[_i];
                    if (dot_1.is_alive() && dot_1.kind != 0) {
                        this.probs[dot_1.spot] = 0;
                        prob_info -= this.probs_new[dot_1.spot];
                        record.push(dot_1.spot);
                    }
                }
            }
            if (end === 0) {
                for (var _b = 0, _c = this.ghosts; _b < _c.length; _b++) {
                    var g = _c[_b];
                    if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                        this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                        this.pacman.y <= g.y + this.ghost_vision_limit) {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            this.probs[i] = 0;
                        }
                        this.probs[this.pacman.spot] = 1;
                        this.K *= this.probs_new[this.pacman.spot];
                        break;
                    }
                    else {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            var dot = this.board.get_dot(i, true);
                            var spot_tl_x = (dot.tile % this.board.num_tiles_x);
                            var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);
                            if (spot_tl_x >= g.x - this.ghost_vision_limit && spot_tl_x <=
                                g.x + this.ghost_vision_limit - 0.5 && spot_tl_y >= g.y -
                                this.ghost_vision_limit && spot_tl_y <= g.y + this.ghost_vision_limit - 0.5) {
                                if (record.indexOf(i) < 0) {
                                    this.probs[i] = 0;
                                    prob_info -= this.probs_new[i];
                                    record.push(i);
                                }
                            }
                        }
                    }
                }
                this.K *= prob_info;
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                sum += this.probs[i];
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                this.probs[i] = this.probs[i] / sum;
            }
        }
        else {
            for (var j = 0; j < this.board.dots.length; j++) {
                this.probs_new[j] = 0;
                for (var i = 0; i < this.board.dots.length; i++) {
                    this.probs_new[j] += this.probs[i] * this.trans_mat[i][j];
                }
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                this.probs[i] = this.probs_new[i];
            }
            var end = 0;
            var prob_info = 1;
            var record = new Array();
            if (informant >= 0) {
                for (var i = 0; i < this.board.dots.length; i++) {
                    this.probs[i] = 0;
                }
                this.probs[this.pacman.spot] = 1;
                this.K *= this.probs_new[this.pacman.spot];
                end = 1;
            }
            else {
                for (var _d = 0, _e = this.board.dots; _d < _e.length; _d++) {
                    var dot_2 = _e[_d];
                    if (dot_2.is_alive() && dot_2.kind != 0) {
                        this.probs[dot_2.spot] = 0;
                        prob_info -= this.probs_new[dot_2.spot];
                        record.push(dot_2.spot);
                    }
                }
            }
            if (end === 0) {
                for (var _f = 0, _g = this.ghosts; _f < _g.length; _f++) {
                    var g = _g[_f];
                    if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                        this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                        this.pacman.y <= g.y + this.ghost_vision_limit) {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            this.probs[i] = 0;
                        }
                        this.probs[this.pacman.spot] = 1;
                        this.K *= this.probs_new[this.pacman.spot];
                        break;
                    }
                    else {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            var dot = this.board.get_dot(i, true);
                            var spot_tl_x = (dot.tile % this.board.num_tiles_x);
                            var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);
                            if (spot_tl_x >= g.x - this.ghost_vision_limit && spot_tl_x <=
                                g.x + this.ghost_vision_limit - 0.5 && spot_tl_y >= g.y -
                                this.ghost_vision_limit && spot_tl_y <= g.y + this.ghost_vision_limit - 0.5) {
                                if (record.indexOf(i) < 0) {
                                    this.probs[i] = 0;
                                    prob_info -= this.probs_new[i];
                                    record.push(i);
                                }
                            }
                        }
                    }
                }
                this.K *= prob_info;
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                sum += this.probs[i];
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                this.probs[i] = this.probs[i] / sum;
            }
        }
        ++this.num_points;
    };
    return RwPacmanPost;
}(post_1.Post));
exports.RwPacmanPost = RwPacmanPost;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ProbSprite = (function (_super) {
    __extends(ProbSprite, _super);
    function ProbSprite(viewer, board, tile_dim, target_spot) {
        var _this = this;
        var g = new Phaser.Graphics(viewer, 0, 0);
        g.beginFill(0xFFE733);
        g.drawCircle(0, 0, tile_dim * 1);
        g.endFill();
        _this = _super.call(this, viewer, 0, 0, g.generateTexture()) || this;
        _this.board = board;
        _this.target_spot = target_spot;
        _this.tile_dim = tile_dim;
        _this.anchor.x = 0.5;
        _this.anchor.y = 0.5;
        var target_dot = _this.board.get_dot(target_spot, true);
        var target_x = target_dot.tile % _this.board.num_tiles_x;
        var target_y = Math.floor(target_dot.tile
            / _this.board.num_tiles_x);
        _this.position.x = target_x * tile_dim;
        _this.position.y = target_y * tile_dim;
        viewer.add.existing(_this);
        return _this;
    }
    ProbSprite.prototype.update = function () {
        var target_dot = this.board.get_dot(this.target_spot, true);
        var target_x = target_dot.tile % this.board.num_tiles_x;
        var target_y = Math.floor(target_dot.tile
            / this.board.num_tiles_x);
        this.position.x = target_x * this.tile_dim;
        this.position.y = target_y * this.tile_dim;
    };
    return ProbSprite;
}(Phaser.Sprite));
exports.ProbSprite = ProbSprite;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var post_1 = __webpack_require__(3);
var ClosestRwPacmanPost = (function (_super) {
    __extends(ClosestRwPacmanPost, _super);
    function ClosestRwPacmanPost(board, ghosts, pacman, starting_loc_choices, ghost_vision_limit, w) {
        var _this = _super.call(this) || this;
        _this.board = board;
        _this.ghosts = ghosts;
        _this.pacman = pacman;
        _this.probs = new Array(_this.board.dots.length);
        _this.probs_new = new Array(_this.board.dots.length);
        _this.num_points = 0;
        _this.starting_loc_choices = starting_loc_choices;
        _this.ghost_vision_limit = ghost_vision_limit;
        _this.K = 1;
        _this.w = w;
        _this.trans_mat = new Array(_this.board.dots.length);
        for (var i = 0; i < _this.board.dots.length; i++) {
            _this.trans_mat[i] = new Array(_this.board.dots.length);
            for (var j = 0; j < _this.board.dots.length; j++) {
                _this.trans_mat[i][j] = 0;
            }
        }
        _this.largest_prob = -Infinity;
        return _this;
    }
    ClosestRwPacmanPost.prototype.update = function (informant) {
        var sum = 0;
        if (this.num_points === 0) {
            for (var i = 0; i < this.board.dots.length; i++) {
                for (var j = 0; j < this.board.dots.length; j++) {
                    this.trans_mat[i][j] = 0;
                }
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                if (this.starting_loc_choices.indexOf(i) >= 0) {
                    this.probs_new[i] = 1 / this.starting_loc_choices.length;
                }
                else {
                    this.probs_new[i] = 0;
                }
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                this.probs[i] = this.probs_new[i];
            }
            var end = 0;
            var prob_info = 1;
            var record = new Array();
            if (informant >= 0) {
                for (var i = 0; i < this.board.dots.length; i++) {
                    this.probs[i] = 0;
                }
                this.probs[this.pacman.spot] = 1;
                this.K *= this.probs_new[this.pacman.spot];
                end = 1;
            }
            else {
                for (var _i = 0, _a = this.board.dots; _i < _a.length; _i++) {
                    var dot_1 = _a[_i];
                    if (dot_1.is_alive() && dot_1.kind != 0) {
                        this.probs[dot_1.spot] = 0;
                        prob_info -= this.probs_new[dot_1.spot];
                        record.push(dot_1.spot);
                    }
                }
            }
            if (end === 0) {
                for (var _b = 0, _c = this.ghosts; _b < _c.length; _b++) {
                    var g = _c[_b];
                    if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                        this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                        this.pacman.y <= g.y + this.ghost_vision_limit) {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            this.probs[i] = 0;
                        }
                        this.probs[this.pacman.spot] = 1;
                        this.K *= this.probs_new[this.pacman.spot];
                        break;
                    }
                    else {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            var dot = this.board.get_dot(i, true);
                            var spot_tl_x = (dot.tile % this.board.num_tiles_x);
                            var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);
                            if (spot_tl_x >= g.x - this.ghost_vision_limit && spot_tl_x <=
                                g.x + this.ghost_vision_limit - 0.5 && spot_tl_y >= g.y -
                                this.ghost_vision_limit && spot_tl_y <= g.y + this.ghost_vision_limit - 0.5) {
                                if (record.indexOf(i) < 0) {
                                    this.probs[i] = 0;
                                    prob_info -= this.probs_new[i];
                                    record.push(i);
                                }
                            }
                        }
                    }
                }
                this.K *= prob_info;
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                sum += this.probs[i];
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                if (sum === 0) {
                    this.probs[i] = 0;
                }
                else {
                    this.probs[i] = this.probs[i] / sum;
                }
            }
        }
        else {
            for (var j = 0; j < this.board.dots.length; j++) {
                this.probs_new[j] = 0;
                for (var i = 0; i < this.board.dots.length; i++) {
                    this.probs_new[j] += this.probs[i] * this.trans_mat[i][j];
                }
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                this.probs[i] = this.probs_new[i];
            }
            var end = 0;
            var prob_info = 1;
            var record = new Array();
            if (informant >= 0) {
                for (var i = 0; i < this.board.dots.length; i++) {
                    this.probs[i] = 0;
                }
                this.probs[this.pacman.spot] = 1;
                this.K *= this.probs_new[this.pacman.spot];
                end = 1;
            }
            else {
                for (var _d = 0, _e = this.board.dots; _d < _e.length; _d++) {
                    var dot_2 = _e[_d];
                    if (dot_2.is_alive() && dot_2.kind != 0) {
                        this.probs[dot_2.spot] = 0;
                        prob_info -= this.probs_new[dot_2.spot];
                        record.push(dot_2.spot);
                    }
                }
            }
            if (end === 0) {
                for (var _f = 0, _g = this.ghosts; _f < _g.length; _f++) {
                    var g = _g[_f];
                    if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                        this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                        this.pacman.y <= g.y + this.ghost_vision_limit) {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            this.probs[i] = 0;
                        }
                        this.probs[this.pacman.spot] = 1;
                        this.K *= this.probs_new[this.pacman.spot];
                        break;
                    }
                    else {
                        for (var i = 0; i < this.board.dots.length; i++) {
                            var dot = this.board.get_dot(i, true);
                            var spot_tl_x = (dot.tile % this.board.num_tiles_x);
                            var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);
                            if (spot_tl_x >= g.x - this.ghost_vision_limit && spot_tl_x <=
                                g.x + this.ghost_vision_limit - 0.5 && spot_tl_y >= g.y -
                                this.ghost_vision_limit && spot_tl_y <= g.y + this.ghost_vision_limit - 0.5) {
                                if (record.indexOf(i) < 0) {
                                    this.probs[i] = 0;
                                    prob_info -= this.probs_new[i];
                                    record.push(i);
                                }
                            }
                        }
                    }
                }
                this.K *= prob_info;
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                sum += this.probs[i];
            }
            for (var i = 0; i < this.board.dots.length; i++) {
                if (sum === 0) {
                    this.probs[i] = 0;
                }
                else {
                    this.probs[i] = this.probs[i] / sum;
                }
            }
        }
        this.updateTransMat();
        ++this.num_points;
    };
    ClosestRwPacmanPost.prototype.updateTransMat = function () {
        for (var i = 0; i < this.board.dots.length; i++) {
            var dot = this.board.get_dot(i, true);
            var walkable_spots = new Array();
            var best_pf = -Infinity;
            var pfs = Array(4);
            var dot_x = dot.tile % this.board.num_tiles_x;
            var dot_y = Math.floor(dot.tile
                / this.board.num_tiles_x);
            var c = 0;
            for (var _i = 0, _a = this.ghosts; _i < _a.length; _i++) {
                var g = _a[_i];
                if (dot_x >= g.x - this.ghost_vision_limit && dot_x <= g.x +
                    this.ghost_vision_limit && dot_y >= g.y - this.ghost_vision_limit &&
                    dot_y <= g.y + this.ghost_vision_limit) {
                    c = 1;
                    if (dot.up >= 0) {
                        var x = dot.up % this.board.num_tiles_x;
                        var y = Math.floor(dot.up
                            / this.board.num_tiles_x);
                        var pf = 0;
                        pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);
                        pfs[0] = pf;
                        if (pf > best_pf) {
                            best_pf = pf;
                        }
                    }
                    if (dot.down >= 0) {
                        var x = dot.down % this.board.num_tiles_x;
                        var y = Math.floor(dot.down
                            / this.board.num_tiles_x);
                        var pf = 0;
                        pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);
                        pfs[1] = pf;
                        if (pf > best_pf) {
                            best_pf = pf;
                        }
                    }
                    if (dot.left >= 0) {
                        var x = dot.left % this.board.num_tiles_x;
                        var y = Math.floor(dot.left
                            / this.board.num_tiles_x);
                        var pf = 0;
                        pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);
                        pfs[2] = pf;
                        if (pf > best_pf) {
                            best_pf = pf;
                        }
                    }
                    if (dot.right >= 0) {
                        var x = dot.right % this.board.num_tiles_x;
                        var y = Math.floor(dot.right
                            / this.board.num_tiles_x);
                        var pf = 0;
                        pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);
                        pfs[3] = pf;
                        if (pf > best_pf) {
                            best_pf = pf;
                        }
                    }
                    if (dot.up >= 0 && pfs[0] === best_pf) {
                        walkable_spots.push(this.board.tile_to_spot[dot.up]);
                    }
                    if (dot.down >= 0 && pfs[1] === best_pf) {
                        walkable_spots.push(this.board.tile_to_spot[dot.down]);
                    }
                    if (dot.left >= 0 && pfs[2] === best_pf) {
                        walkable_spots.push(this.board.tile_to_spot[dot.left]);
                    }
                    if (dot.right >= 0 && pfs[3] === best_pf) {
                        walkable_spots.push(this.board.tile_to_spot[dot.right]);
                    }
                    var prob = 1 / walkable_spots.length;
                    for (var j = 0; j < this.board.dots.length; j++) {
                        if (walkable_spots.indexOf(j) >= 0) {
                            this.trans_mat[i][j] = prob;
                        }
                        else {
                            this.trans_mat[i][j] = 0;
                        }
                    }
                    break;
                }
            }
            if (c === 0) {
                var best_dist = Infinity;
                var best_dots = new Array();
                var dists = new Array(this.board.dots.length);
                for (var j = 0; j < this.board.dots.length; j++) {
                    this.trans_mat[i][j] = 0;
                }
                for (var _b = 0, _c = this.board.dots; _b < _c.length; _b++) {
                    var board_dot = _c[_b];
                    if (board_dot.is_alive() && board_dot.kind > 0) {
                        var board_dot_x = board_dot.tile % this.board.num_tiles_x;
                        var board_dot_y = Math.floor(board_dot.tile
                            / this.board.num_tiles_x);
                        var dist = (board_dot_x - dot_x) * (board_dot_x - dot_x) +
                            (board_dot_y - dot_y) * (board_dot_y - dot_y);
                        dists[board_dot.spot] = dist;
                        if (dist < best_dist && dist != 0) {
                            best_dist = dist;
                        }
                    }
                }
                for (var k = 0; k < this.board.dots.length; k++) {
                    if (dists[k] === best_dist) {
                        best_dots.push(this.board.dots[k]);
                    }
                }
                for (var k = 0; k < best_dots.length; k++) {
                    var best_dot = best_dots[k];
                    var best_loc = 0;
                    var best_dist = Infinity;
                    var best_dot_x = best_dot.tile % this.board.num_tiles_x;
                    var best_dot_y = Math.floor(best_dot.tile / this.board.num_tiles_x);
                    if (this.board.dots[i].up >= 0) {
                        var next_x = this.board.dots[i].up % this.board.num_tiles_x;
                        var next_y = Math.floor(this.board.dots[i].up / this.board.num_tiles_x);
                        var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
                            (next_y - best_dot_y) * (next_y - best_dot_y);
                        if (next_dist < best_dist) {
                            best_dist = next_dist;
                            best_loc = this.board.tile_to_spot[dot.up];
                        }
                    }
                    if (this.board.dots[i].down >= 0) {
                        var next_x = this.board.dots[i].down % this.board.num_tiles_x;
                        var next_y = Math.floor(this.board.dots[i].down / this.board.num_tiles_x);
                        var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
                            (next_y - best_dot_y) * (next_y - best_dot_y);
                        if (next_dist < best_dist) {
                            best_dist = next_dist;
                            best_loc = this.board.tile_to_spot[dot.down];
                        }
                    }
                    if (this.board.dots[i].left >= 0) {
                        var next_x = this.board.dots[i].left % this.board.num_tiles_x;
                        var next_y = Math.floor(this.board.dots[i].left / this.board.num_tiles_x);
                        var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
                            (next_y - best_dot_y) * (next_y - best_dot_y);
                        if (next_dist < best_dist) {
                            best_dist = next_dist;
                            best_loc = this.board.tile_to_spot[dot.left];
                        }
                    }
                    if (this.board.dots[i].right >= 0) {
                        var next_x = this.board.dots[i].right % this.board.num_tiles_x;
                        var next_y = Math.floor(this.board.dots[i].right / this.board.num_tiles_x);
                        var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
                            (next_y - best_dot_y) * (next_y - best_dot_y);
                        if (next_dist < best_dist) {
                            best_dist = next_dist;
                            best_loc = this.board.tile_to_spot[dot.right];
                        }
                    }
                    this.trans_mat[i][best_loc] = 1 / best_dots.length;
                }
            }
        }
        for (var i = 0; i < this.board.dots.length; i++) {
            for (var j = 0; j < this.board.dots.length; j++) {
                this.trans_mat[i][j] = (1 - this.w) * this.trans_mat[i][j] + this.w * this.board.trans_mat_random[i][j];
            }
        }
    };
    return ClosestRwPacmanPost;
}(post_1.Post));
exports.ClosestRwPacmanPost = ClosestRwPacmanPost;


/***/ })
/******/ ]);