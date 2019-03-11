var rects = require("./rects.js");
var players = require("./players.js");
var util = require("./utilities.js");


var linspace = function (start, end, num) {
    if (num < 2) {
        throw "num must be at least 2";
    }

    var sep = (end - start) / (num - 1);
    var points = new Array();
    for (var i = 0; i < (num - 1); i++) {
        points.push(start + i * sep);
    }

    points.push(end);
    return points;
};


var PointNetwork = function () {
};


PointNetwork.prototype.generate = function (nx, ny, obstacles,
                                            maxX, maxY, depth) {
    if (maxX == undefined) {
        var xVals = linspace(0, (players.Player.prototype.maxX -
                                 players.Player.prototype.width),
                             nx);
    } else {
        var xVals = linspace(0, maxX, nx);
    }

    if (maxY == undefined) {
        var yVals = linspace(0, (players.Player.prototype.maxY -
                                 players.Player.prototype.height),
                             ny);
    } else {
        var yVals = linspace(0, maxY, ny);
    }

    var arena = new rects.Rect(0, 0, players.Player.prototype.maxX,
        players.Player.prototype.maxY);

    this.vs = new Array();

    for (var ix = 0; ix < nx; ix++) {
        for (var iy = 0; iy < ny; iy++) {
            this.vs.push({
                index: ix * ny + iy,
                neigh: new Array(),
                xy: [xVals[ix], yVals[iy]],
                active: true,
                nCovers: 0,
                pnVertex: undefined
            });
        }
    }


    var bufferX = players.Player.prototype.width*0.1;
    var bufferY = players.Player.prototype.height*0.1;
    for (var i = 0; i < (nx * ny); i++) {
        var v = this.vs[i];
        // var r = new rects.Rect(v.xy[0] - bufferX, v.xy[1] - bufferY,
        //     players.Player.prototype.width + 2*bufferX,
        //     players.Player.prototype.height + 2*bufferY);

        if (v.index != i) {
            throw "index is not i";
        }

        // node to the left
        if (v.index >= ny) {
            this.addEdge(v.index, v.index - ny);
        }

        // node above
        if (v.index % ny > 0) {
            this.addEdge(v.index, v.index - 1);
        }

        // node to left and below
        if (v.index >= ny && (v.index+1) % ny > 0) {
            this.addEdge(v.index, v.index - ny + 1);
        }

        // node to left and above
        if (v.index >= ny && v.index % ny > 0) {
            this.addEdge(v.index, v.index - ny - 1);
        }

        // var inArena = arena.collide(r);

        // for (var obsInd in obstacles) {
        //     var obs = obstacles[obsInd];
        //     if (r.collide(obs.rect())) {
        //         this.vs[i].active = false;
        //         break;
        //     }
        // }
    }

    var maxXVals = Math.max.apply(null, xVals);
    var maxYVals = Math.max.apply(null, yVals);

    if (depth == undefined) {
        this.depth = 4;
    } else {
        this.depth = depth;
    }

    this.split = splitNodes(this.vs,
                            new rects.Rect(-10,-10,
                                           maxX+20,
                                           maxY+20),
                            this.depth);

    this.corners = new Array();
    this.corners.push(this.closestNodeTo(0, 0).index);
    this.corners.push(this.closestNodeTo(0, maxYVals).index);
    this.corners.push(this.closestNodeTo(maxXVals, 0).index);
    this.corners.push(this.closestNodeTo(maxXVals, maxYVals).index);
};


PointNetwork.prototype.addEdge = function (a, b) {
    var aV = this.vs[a];
    var bV = this.vs[b];
    if (aV.neigh.indexOf(b) < 0 && bV.neigh.indexOf(a)) {
        aV.neigh.push(b);
        bV.neigh.push(a);
    }
    else if (aV.neigh.indexOf(b) < 0) {
        throw "b is neighbor of a, but a is not neighbor of b";
    }
    else if (bV.neigh.indexOf(a) < 0) {
        throw "a is neighbor of b, but b is not neighbor of a";
    }
    else {
        throw "a and b are already neighbors";
    }
};


PointNetwork.prototype.occupy = function(r) {
    var bufferX = players.Player.prototype.width*0.15;
    var bufferY = players.Player.prototype.height*0.15;

    var padR = new rects.Rect(r.left - bufferX - players.Player.prototype.width,
                              r.top - bufferY - players.Player.prototype.height,
                              r.right + bufferX,
                              r.bottom + bufferY);

    // get splits for corners of box
    var topleftSplit = getSplit(this.split,padR.topleft);
    var toprightSplit = getSplit(this.split,padR.topright);
    var bottomleftSplit = getSplit(this.split,padR.bottomleft);
    var bottomrightSplit = getSplit(this.split,padR.bottomright);

    var nOccupied = 0;
    // occupy the active nodes
    for(var i in topleftSplit["nodes"]) {
        var n = topleftSplit["nodes"][i];
        var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                       n.xy[1] - bufferY,
                                       players.Player.prototype.width
                                       + 2*bufferX,
                                       players.Player.prototype.height
                                       + 2*bufferY);
        if(r.collide(padPlayer)) {
            n.active = false;
            ++n.nCovers;
            ++nOccupied;
        }
    }

    if(topleftSplit != toprightSplit) {
        for(var i in toprightSplit["nodes"]) {
            var n = toprightSplit["nodes"][i];
            var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                           n.xy[1] - bufferY,
                                           players.Player.prototype.width
                                           + 2*bufferX,
                                           players.Player.prototype.height
                                           + 2*bufferY);
            if(r.collide(padPlayer)) {
                n.active = false;
                ++n.nCovers;
                ++nOccupied;
            }
        }
    }

    if(bottomrightSplit != toprightSplit &&
       bottomrightSplit != topleftSplit) {
        for(var i in bottomrightSplit["nodes"]) {
            var n = bottomrightSplit["nodes"][i];
            var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                           n.xy[1] - bufferY,
                                           players.Player.prototype.width
                                           + 2*bufferX,
                                           players.Player.prototype.height
                                           + 2*bufferY);
            if(r.collide(padPlayer)) {
                n.active = false;
                ++n.nCovers;
                ++nOccupied;
            }
        }
    }

    if(bottomleftSplit != toprightSplit &&
       bottomleftSplit != topleftSplit &&
       bottomleftSplit != bottomrightSplit) {
        for(var i in bottomleftSplit["nodes"]) {
            var n = bottomleftSplit["nodes"][i];
            var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                           n.xy[1] - bufferY,
                                           players.Player.prototype.width
                                           + 2*bufferX,
                                           players.Player.prototype.height
                                           + 2*bufferY);
            if(r.collide(padPlayer)) {
                n.active = false;
                ++n.nCovers;
                ++nOccupied;
            }
        }
    }
    // console.log("number occupied: " + nOccupied);
};


PointNetwork.prototype.release = function(r) {
    var bufferX = players.Player.prototype.width*0.15;
    var bufferY = players.Player.prototype.height*0.15;

    var padR = new rects.Rect(r.left - bufferX - players.Player.prototype.width,
                              r.top - bufferY - players.Player.prototype.height,
                              r.right + bufferX,
                              r.bottom + bufferY);

    // get splits for corners of box
    var topleftSplit = getSplit(this.split,padR.topleft);
    var toprightSplit = getSplit(this.split,padR.topright);
    var bottomleftSplit = getSplit(this.split,padR.bottomleft);
    var bottomrightSplit = getSplit(this.split,padR.bottomright);

    var nReleased = 0;
    // occupy the active nodes
    for(var i in topleftSplit["nodes"]) {
        var n = topleftSplit["nodes"][i];
        var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                       n.xy[1] - bufferY,
                                       players.Player.prototype.width
                                       + 2*bufferX,
                                       players.Player.prototype.height
                                       + 2*bufferY);
        if(r.collide(padPlayer)) {
            --n.nCovers;
            if(n.nCovers == 0) {
                n.active = true;
                ++nReleased;
            } else if(n.nCovers < 0) {
                alert("vertex is released too many times");
            }
        }
    }

    if(topleftSplit != toprightSplit) {
        for(var i in toprightSplit["nodes"]) {
            var n = toprightSplit["nodes"][i];
            var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                           n.xy[1] - bufferY,
                                           players.Player.prototype.width
                                           + 2*bufferX,
                                           players.Player.prototype.height
                                           + 2*bufferY);
            if(r.collide(padPlayer)) {
                --n.nCovers;
                if(n.nCovers == 0) {
                    n.active = true;
                    ++nReleased;
                } else if(n.nCovers < 0) {
                    alert("vertex is released too many times");
                }
            }
        }
    }

    if(bottomrightSplit != toprightSplit &&
       bottomrightSplit != topleftSplit) {
        for(var i in bottomrightSplit["nodes"]) {
            var n = bottomrightSplit["nodes"][i];
            var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                           n.xy[1] - bufferY,
                                           players.Player.prototype.width
                                           + 2*bufferX,
                                           players.Player.prototype.height
                                           + 2*bufferY);
            if(r.collide(padPlayer)) {
                --n.nCovers;
                if(n.nCovers == 0) {
                    n.active = true;
                    ++nReleased;
                } else if(n.nCovers < 0) {
                    alert("vertex is released too many times");
                }
            }
        }
    }

    if(bottomleftSplit != toprightSplit &&
       bottomleftSplit != topleftSplit &&
       bottomleftSplit != bottomrightSplit) {
        for(var i in bottomleftSplit["nodes"]) {
            var n = bottomleftSplit["nodes"][i];
            var padPlayer = new rects.Rect(n.xy[0] - bufferX,
                                           n.xy[1] - bufferY,
                                           players.Player.prototype.width
                                           + 2*bufferX,
                                           players.Player.prototype.height
                                           + 2*bufferY);
            if(r.collide(padPlayer)) {
                --n.nCovers;
                if(n.nCovers == 0) {
                    n.active = true;
                    ++nReleased;
                } else if(n.nCovers < 0) {
                    alert("vertex is released too many times");
                }
            }
        }
    }
    // console.log("number released: " + nReleased);
};


// PointNetwork.prototype.delVertex = function (index) {
//     for (var i in this.vs) {
//         if (i > index) {
//             this.vs[i].index--;
//         }

//         var removed = 0;
//         for (var j in this.vs[i].neigh) {
//             if (this.vs[i].neigh[j] == index) {
//                 removed++;
//                 var replace = this.vs[i].neigh.length - removed;
//                 this.vs[i].neigh[j] = this.vs[i].neigh[replace];
//             }

//             if (this.vs[i].neigh[j] > index) {
//                 this.vs[i].neigh[j]--;
//             }
//         }

//         var start = this.vs[i].neigh.length - removed;
//         this.vs[i].neigh.splice(start, removed);
//     }

//     this.vs.splice(index, 1);
// };


// PointNetwork.prototype.delVertices = function (vertices) {
//     vertices.sort();
//     for (var i in vertices) {
//         this.delVertex(vertices[vertices.length - 1 - i]);
//     }
// };


PointNetwork.prototype.plot = function (plotly) {
    var xVals = new Array();
    var yVals = new Array();
    for (var i in this.vs) {
        xVals.push(this.vs[i].xy[0]);
        yVals.push(this.vs[i].xy[1]);
    }

    var traces = [{
        x: xVals,
        y: yVals,
        mode: "markers",
        type: "scatter"
    }];

    for (var i in this.es) {
        var e = this.es[i];
        traces.push({
            x: [this.vs[e[0]].xy[0], this.vs[e[1]].xy[0]],
            y: [this.vs[e[0]].xy[1], this.vs[e[1]].xy[1]],
            mode: "lines",
            type: "scatter"
        });
    }


    plotly.plot(traces, {
            filename: "test",
            showlegend: false
        },
        function (err, msg) {
            console.log(msg);
            console.log(err);
        });
};


// PointNetwork.prototype.shortestPathDijkstra = function (start, end) {
//     var dist = {};
//     var prev = {};
//     var Q = {};
//     var Qkeys = this.vs.length;
//     for (var i in this.vs) {
//         dist[i] = Infinity;
//         prev[i] = Infinity;
//         Q[i] = this.vs[i];
//     }

//     dist[start] = 0;
//     while (Qkeys > 0) {
//         var minDist = Infinity;
//         var minIndex = null;
//         for (var i in Q) {
//             if (dist[i] < minDist) {
//                 minDist = dist[i];
//                 minIndex = parseInt(i);
//             }
//         }

//         if (minIndex == end)
//             break;

//         delete Q[minIndex];
//         Qkeys--;

//         for (var i in this.vs[minIndex].neigh) {
//             var n = this.vs[minIndex].neigh[i];
//             if ((dist[minIndex] + 1) < dist[n]) {
//                 dist[n] = dist[minIndex] + 1;
//                 prev[n] = minIndex;
//             }
//         }

//     }
//     var Q = new Array();
//     var u = end;
//     while (prev[u] != undefined) {
//         Q.push(u);
//         u = prev[u];
//     }
//     return (Q.reverse());
// };


PointNetwork.prototype.shortestPathBestFirst = function (start, end) {
    var prev = {};
    var dist = {};
    var open = {};
    var closed = {};

    var openKeys = 0;
    for(var i in this.vs[start].neigh) {
        var ind = this.vs[start].neigh[i];
        if(this.vs[ind].active) {
            open[ind] = null;
            dist[ind] = util.l2dist(this.vs[ind].xy,this.vs[end].xy);
            prev[ind] = parseInt(start);
            openKeys++;
        }
    }

    while (openKeys > 0) {
        var nInd = undefined;
        var minDist = Infinity;
        for(var i in open) {
            console.assert(this.vs[i].active);
            if(dist[i] < minDist) {
                minDist = dist[i];
                nInd = i;
            }
        }

        delete open[nInd];
        openKeys--;
        if (nInd == end)
            break;

        closed[nInd] = this.vs[nInd];
        for(var i in this.vs[nInd].neigh) {
            var ind = this.vs[nInd].neigh[i];
            if(this.vs[ind].active &&
               !(closed.hasOwnProperty(ind) || open.hasOwnProperty(ind))){
                open[ind] = null;
                dist[ind] = util.l2dist(this.vs[ind].xy,this.vs[end].xy);
                prev[ind] = parseInt(nInd);
                openKeys++;
            }
        }
    }

    var Q = new Array();
    var u = nInd; // nInd is end if there is a valid path to end from start
    while (u != start) {
        Q.push(u);
        u = prev[u];
    }
    Q.push(start);
    return (Q.reverse());
};

PointNetwork.prototype.shortestPath =
    PointNetwork.prototype.shortestPathBestFirst;


var splitNodes = function (nodes, rect, depth, onX) {

    // default argument
    if (onX == undefined)
        onX = true;

    if (depth == 0) {
        return {"rect": rect,
                "oneRect": null,
                "twoRect": null,
                "oneSplit": null,
                "twoSplit": null,
                "nodes":nodes
               }
    }
    else {
        var oneRect = null;
        var twoRect = null;
        if (onX) {
            var xM = parseInt(rect.centerx);
            oneRect = new rects.Rect(rect.left,rect.top,
                                     xM-rect.left,rect.h);
            twoRect = new rects.Rect(xM,rect.top,
                                     rect.right-xM,rect.h);
        }
        else {
            var yM = parseInt(rect.centery);
            oneRect = new rects.Rect(rect.left,rect.top,
                                     rect.w,yM-rect.top);
            twoRect = new rects.Rect(rect.left,yM,
                                     rect.w,rect.bottom-yM);
        }

        var oneNodes = new Array();
        var twoNodes = new Array();

        for(var i in nodes){
            var n = nodes[i];
            if(oneRect.collidepoint(n.xy)) {
                oneNodes.push(n);
            } else {
                twoNodes.push(n);
            }
        }

        if(oneRect.h < 1 || oneRect.w < 1
           || twoRect.h < 1 || twoRect.w < 1
           || nodes.length < 10
           || oneNodes.length == 0
           || twoNodes.length == 0) {
            var split = {"rect": rect,
                         "oneRect": null,
                         "twoRect": null,
                         "oneSplit": null,
                         "twoSplit": null,
                         "nodes":nodes
                        }
        }
        else{
            var split = {"rect": rect,
                         "oneRect": oneRect,
                         "twoRect": twoRect,
                         "oneSplit": null,
                         "twoSplit": null,
                         "nodes":nodes
                        }

            split["oneSplit"] = splitNodes(oneNodes,oneRect,depth-1,!onX);
            split["twoSplit"] = splitNodes(twoNodes,twoRect,depth-1,!onX);
        }

        return (split);
    }
};


var getSplit = function (split, x, y) {
    var xAdj = Math.max(Math.min(x,players.Player.prototype.maxX),0);
    var yAdj = Math.max(Math.min(y,players.Player.prototype.maxY),0);
    var current = split;
    while(current["oneSplit"] != null && current["twoSplit"] != null) {
        // console.log("Rect: " + current["rect"].left + ", "
        //             + current["rect"].right + ", "
        //             + current["rect"].top + ", "
        //             + current["rect"].bottom);
        if(current["oneRect"].collidepoint([xAdj,yAdj])) {
            current = current.oneSplit;
        } else {
            current = current.twoSplit;
        }
    }
    // var extractInds = new Array();
    // for(var i in current["nodes"]) {
    //     extractInds.push(current["nodes"][i].index);
    // }
    // console.log(extractInds);
    return current;
};

var nodesInSplit = function (split, x, y) {
    var xySplit = getSplit(split,x,y);

    var nodeInds = new Array();
    for(var i in xySplit["nodes"]) {
        var n = xySplit["nodes"][i];
        if(n.active) {
            nodeInds.push(n.index);
        }
    }
    return nodeInds;
}


var closest = function (vs, split, x, y, depth) {
    var nodeInds = nodesInSplit(split, x, y, depth);
    console.assert(nodeInds.length > 0);

    var minTimes = 0;
    if (nodeInds.length == 0 || minTimes > 0) {
        // always branch out once
        // get split that x,y is in
        var xySplit = getSplit(split,x,y);

        // console.log("initial");
        // var rect = xySplit["rect"];
        // console.log("Rect: " + rect.left + ", "
        //             + rect.right + ", "
        //             + rect.top + ", " + rect.bottom);
        var wScale = Math.max(0.5*xySplit["rect"].w,1);
        var hScale = Math.max(0.5*xySplit["rect"].h,1);

        // keep spreading out until it finds a non empty split
        var maxScale = 0;
        while (nodeInds.length == 0 || minTimes > 0) {
            minTimes --;
            maxScale ++;

            for(var scale = -maxScale; scale <= maxScale; scale++) {
                { // across the top
                    // console.log("top");
                    var newX = x + scale*wScale;
                    var newY = y - maxScale*hScale;
                    // console.log("(" + newX + ", " + newY + ")");
                    // var rect = getSplit(split,newX,newY)["rect"];
                    // console.log("Rect: " + rect.left + ", "
                    //             + rect.right + ", "
                    //             + rect.top + ", " + rect.bottom);
                    nodeInds = nodeInds.concat(nodesInSplit(split,newX,newY));
                }
                { // across bottom
                    // console.log("bottom");
                    var newX = x + scale*wScale;
                    var newY = y + maxScale*hScale;
                    // console.log("(" + newX + ", " + newY + ")");
                    // var rect = getSplit(split,newX,newY)["rect"];
                    // console.log("Rect: " + rect.left + ", "
                    //             + rect.right + ", "
                    //             + rect.top + ", " + rect.bottom);
                    nodeInds = nodeInds.concat(nodesInSplit(split,newX,newY));
                }
                { // down left
                    // console.log("left");
                    // avoid double counting corners
                    if(scale != -maxScale && scale != maxScale) {
                        var newX = x - maxScale*wScale;
                        var newY = y + scale*hScale;
                        // console.log("(" + newX + ", " + newY + ")");
                        // var rect = getSplit(split,newX,newY)["rect"];
                        // console.log("Rect: " + rect.left + ", "
                        //             + rect.right + ", "
                        //             + rect.top + ", " + rect.bottom);
                        nodeInds = nodeInds.concat(nodesInSplit(split,newX,
                                                                newY));
                    }
                }
                { // down right
                    // console.log("right");
                    // avoid double counting corners
                    if(scale != -maxScale && scale != maxScale) {
                        var newX = x + maxScale*wScale;
                        var newY = y + scale*hScale;
                        // console.log("(" + newX + ", " + newY + ")");
                        // var rect = getSplit(split,newX,newY)["rect"];
                        // console.log("Rect: " + rect.left + ", "
                        //             + rect.right + ", "
                        //             + rect.top + ", " + rect.bottom);
                        nodeInds = nodeInds.concat(nodesInSplit(split,newX,
                                                                newY));
                    }
                }
            }
        }
    }

    // nodeInds.sort()
    // console.log(nodeInds);

    var minDist = Infinity;
    var minNodeInd = null;
    for (var i in nodeInds) {
        var d = util.l2dist(vs[nodeInds[i]].xy, [x, y])
        if (d < minDist) {
            minDist = d;
            minNodeInd = nodeInds[i];
        }
    }
    return (minNodeInd);
};


PointNetwork.prototype.closestNodeTo = function (x, y) {
    return this.vs[closest(this.vs, this.split, x, y, this.depth)];
};


PointNetwork.prototype.furthestNodeTo = function (x, y) {
    var maxDist = -1;
    var maxIndex = null;
    for (var i in this.corners) {
        var d = util.l2dist(this.vs[this.corners[i]].xy, [x, y]);
        if (d > maxDist) {
            maxDist = d;
            maxIndex = this.corners[i];
        }
    }
    return (this.vs[maxIndex]);
};


exports.linspace = linspace;
exports.PointNetwork = PointNetwork;
exports.splitNodes = splitNodes;
exports.nodesInSplit = nodesInSplit;
exports.getSplit = getSplit;
