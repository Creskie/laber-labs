
//compute the euclidean distance between two vectors
//function assumes vectors are arrays of equal length
var dist = function(v1,v2){
  var sum = 0;
  v1.forEach(function(val,index){
    sum += Math.pow(val - v2[index],2);
  });
  return Math.sqrt(sum);
};

var updateMax = function(val,arr){
    var max = 0;
    arr.forEach(function(obj){
        max = Math.max(max,obj.d);
    });
    return max;
};

function mode(store){
  var frequency = {};  // array of frequency.
  var max = 0;  // holds the max frequency.
  var result;   // holds the max frequency element.
  for(var v in store) {
          frequency[store[v]]=(frequency[store[v]] || 0)+1; // increment frequency.
          if(frequency[store[v]] > max) { // is this frequency > max so far ?
                  max = frequency[store[v]];  // update max.
                  result = store[v];          // update result.
          }
  }
    return result;
}


function kNear(k){
  this.training = [];
  this.k = k;
  this.principalPoints = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
}

kNear.prototype.learn = function(vector, label){
  cluster = 0;
  shortDist = 9999999;
  for (p = 0; p < this.principalPoints.length; p++){
    newDist = dist(vector, this.principalPoints[p]);
    if (newDist < shortDist){
      shortDist = newDist;
      cluster = p;
    };
  };
  var obj = {v:vector, lab: label, cl: cluster};
  this.training.push(obj);
};

kNear.prototype.updateClusters = function(){
  var currCenters = this.principalPoints;
  this.training.forEach(function(obj){
    shortDist = 9999999;
    for (p = 0; p < numPrinPoints; p++){
      newDist = dist(obj.v, currCenters[p]);
      if (newDist < shortDist){
        shortDist = newDist;
        obj.cl = p;
      };
    };
  });
};

kNear.prototype.classify = function(v, canBoost, canPara){
  var voteBloc = [];
  var maxD = 0;
  vectorCl = 0;
  shortDist = 9999999;
  for (p = 0; p < this.principalPoints.length; p++){
    newDist = dist(v, this.principalPoints[p]);
    if (newDist < shortDist){
      shortDist = newDist;
      vectorCl = p;
    };
  };
  this.training.forEach(function(obj){
    if (obj.cl == vectorCl){
      if ((!((obj.lab == 2)&(!canBoost)))& (!((obj.lab == 3)&(!canPara)))){
        var o = {d:dist(v,obj.v), vote:obj.lab};
        if (voteBloc.length < this.k){
          voteBloc.push(o);
          maxD = updateMax(maxD,voteBloc);
        } else {
          if (o.d < maxD){
            var bool = true;
            var count = 0;
            while (bool){
              if (Number(voteBloc[count].d) === maxD){
                voteBloc.splice(count,1,o);
                maxD = updateMax(maxD,voteBloc);
                bool = false;
              }
              else{
                if(count < voteBloc.length-1){
                  count++;
                }
                else{
                  bool = false;
                }
              }
            }
          }
        };
      };
    };
  });
  var votes = [];
  voteBloc.forEach(function(el){
    votes.push(el.vote);
  });
  return mode(votes);
};

kNear.prototype.nearest = function(v, canBoost, canPara){
  var near = [];
  var voteBloc = [];
  var maxD = 0;
  vectorCl = 0;
  shortDist = 9999999;
  for (p = 0; p < this.principalPoints.length; p++){
    newDist = dist(v, this.principalPoints[p]);
    if (newDist < shortDist){
      shortDist = newDist;
      vectorCl = p;
    };
  };
  this.training.forEach(function(obj){
    if (obj.cl == vectorCl){
      if ((!((obj.lab == 2)&(!canBoost)))&(!((obj.lab == 3)&(!canPara)))){
        var o = {d:dist(v,obj.v), vote:obj.lab};
        if (voteBloc.length < this.k){
            near.push(obj);
            voteBloc.push(o);
            maxD = updateMax(maxD,voteBloc);
        }
        else {
          if (o.d < maxD){
            var bool = true;
            var count = 0;
            while (bool){
              if (Number(voteBloc[count].d) === maxD){
                  voteBloc.splice(count,1,o);
                  near.splice(count,1,obj);
                  maxD = updateMax(maxD,voteBloc);
                  bool = false;
              }
              else{
                if(count < voteBloc.length-1){
                  count++;
                }
                else{
                  bool = false;
                }
              }
            }
          }
        }
      };
    };
  });
  //console.log(near);
  return near;
};



// kNear.prototype.setK = function(k){
//   this.k = k;
// }

// kNear.prototype.getK = function(){
//   return this.k;
// };

// kNear.prototype.clean = function(){
//   toClean = [];
//   //console.log(X);
//   //console.log("Length:" + X.length);
//   for (i = 1; i < X.length; i++){
//       prevXVel =  X[i-1][1];
//       currXVel = X[i][1];
//       if (currXVel - prevXVel < -5){
//         toClean.push(i);
//       }
//    }
//    console.log(toClean);
//   // for (i = 1; i < this.training.length; i++){
//   //    prevXVel = this.training[i-1].v[1];
//   //    currXVel = this.training[i].v[1];
//   //    if (currXVel - prevXVel < -5){
//   //      toClean.push(i);
//   //    }
//   //  }
//   for (i = toClean.length-1; i > -1; i--){
//     delNum = toClean[i] - toClean[i-1];
//     if (delNum > 60){
//       delNum = 60;
//     }
//     //console.log(X)
//     //X.splice(toClean[i] - delNum + 1, delNum);
//     console.log('DelNum: '+ delNum);
//     console.log('toClean: '+ toClean[i]);
//     console.log(this.training);
//     removed = this.training.splice(toClean[i] - delNum + 1, delNum);
//     console.log(removed);
//     console.log(this.training);
//   };
// };

// kNear.prototype.delete = function(toClean){
//   console.log("First " + testArray);
//
//   var testArray = [1, 2, 3, [4, 5], [6,7]];
//
//   console.log(testArray);
//   var removed = testArray.splice(2,2);
//   console.log("Third " + testArray);
//   console.log(removed);
  // for (i = toClean.length-1; i > -1; i--){
  //   newX = X;
  //   delNum = toClean[i] - toClean[i-1];
  //   if (delNum > 60){
  //     delNum = 60;
  //   }
  //   console.log(X);
  //   console.log(delNum);
  //   console.log(toClean[i] - delNum);
  //   //X.splice(toClean[i] - delNum + 1, delNum);
  //   console.log(newX);
  // };
  // console.log(newX);
//};

// function isArray(x) {
//     return x.constructor.toString().indexOf("Array") > -1;
// }
