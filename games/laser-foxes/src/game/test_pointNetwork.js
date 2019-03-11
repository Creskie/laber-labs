var pn = require("./pointNetwork");
var players = require("./players");
var util = require("./utilities");
var a = new pn.PointNetwork();

a.generate(3,3,[],30,30);

var v = a.closestNodeTo(1,0);

console.assert(v.xy[0] == 0);
console.assert(v.xy[1] == 0);



var a = new pn.PointNetwork();
var nX = 100;
var nY = 80;
var maxX = players.Player.prototype.maxX;
var maxY = players.Player.prototype.maxY;
a.generate(nX,nY,[],maxX,maxY,10);

console.log("splits");
console.log(a.split["nodes"]);
console.log(a.split);

console.log("checks");

var sX = 100;
var sY = 100;
for(var i = 0; i <= sX; i++) {
    for(var j = 0; j <= sY; j++) {
        var xi = maxX*parseFloat(i)/parseFloat(sX);
        var yj = maxY*parseFloat(j)/parseFloat(sY);

        var bruteMinNode = undefined;
        var minDist = Infinity;
        for(var n in a.vs) {
            var dist = util.l2dist(a.vs[n].xy,[xi,yj]);
            if (dist < minDist) {
                minDist = dist;
                bruteMinNode = a.vs[n];
            }
        }

        var algMinNode = a.closestNodeTo(xi,yj);

        console.log("----------");
        console.log(algMinNode.index + ", " + bruteMinNode.index);
        console.log(xi + ", " + yj);
        var algMinDist = util.l2dist([xi,yj],algMinNode.xy);
        var bruteMinDist = util.l2dist([xi,yj],bruteMinNode.xy);
        console.log(algMinDist);
        console.log(bruteMinDist);
        console.assert(Math.abs(algMinDist - bruteMinDist) < 1e-10);
    }
}


// var xi = 2132;
// var yj = 1400;

// var bruteMinNode = undefined;
// var minDist = Infinity;
// for(var n in a.vs) {
//     var dist = util.l2dist(a.vs[n].xy,[xi,yj]);
//     if (dist < minDist) {
//         minDist = dist;
//         bruteMinNode = a.vs[n];
//     }
// }

// console.log("start");
// var algMinNode = a.closestNodeTo(xi,yj);
// console.log("done");

// var algMinDist = util.l2dist([xi,yj],algMinNode.xy);
// var bruteMinDist = util.l2dist([xi,yj],bruteMinNode.xy);

// console.log("----------");
// console.log(algMinNode.index + ", " + bruteMinNode.index);
// console.log(xi + ", " + yj);
// console.log(algMinDist);
// console.log(bruteMinDist);

// console.log("----------");
// console.log(a.vs[3199]);
// var rect = pn.getSplit(a.split,a.vs[3199].xy[0],a.vs[3199].xy[1])["rect"];
// console.log("Rect: " + rect.left + ", " + rect.right + ", "
//             + rect.top + ", " + rect.bottom);
// var nodeInds = pn.nodesInSplit(a.split,a.vs[3199].xy[0],a.vs[3199].xy[1]);
// var nodes = new Array();
// for(var i in nodeInds) {
//     nodes.push(a.vs[nodeInds[i]].index);
// }
// console.log(nodes);

// console.log("----------");
// console.log(a.vs[3279]);
// var rect = pn.getSplit(a.split,a.vs[3279].xy[0],a.vs[3279].xy[1])["rect"];
// console.log("Rect: " + rect.left + ", " + rect.right + ", "
//             + rect.top + ", " + rect.bottom);
// var nodeInds = pn.nodesInSplit(a.split,a.vs[3279].xy[0],a.vs[3279].xy[1]);
// var nodes = new Array();
// for(var i in nodeInds) {
//     nodes.push(a.vs[nodeInds[i]].index);
// }
// console.log(nodes);

// console.log("----------");
// console.log(a.vs[3278]);
// var rect = pn.getSplit(a.split,a.vs[3278].xy[0],a.vs[3278].xy[1])["rect"];
// console.log("Rect: " + rect.left + ", " + rect.right + ", "
//             + rect.top + ", " + rect.bottom);
// var nodeInds = pn.nodesInSplit(a.split,a.vs[3278].xy[0],a.vs[3278].xy[1]);
// var nodes = new Array();
// for(var i in nodeInds) {
//     nodes.push(a.vs[nodeInds[i]].index);
// }
// console.log(nodes);


// console.assert(Math.abs(algMinDist - bruteMinDist) < 1e-10);
