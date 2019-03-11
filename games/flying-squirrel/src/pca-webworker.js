importScripts('/src/numeric-1.2.6.min.js');

var data = [],
    framesSinceLastUpdate = 0,
    framesSinceLastUpdateMax = 300,
    dataTrimLength = 8000,
    k = 5,
    prevDataLength = 0;

onmessage = function onData(e) {
  var msg = e.data;

  if (msg.type == 'trim') {
    data = trim(data);

    framesSinceLastUpdate = 0;
  } else if (msg.type == 'data') {
    data.push(msg.data);
    framesSinceLastUpdate += 1;

    if (framesSinceLastUpdate >= framesSinceLastUpdateMax) {
      framesSinceLastUpdate = 0;
      var pComp = pca(data);
      postMessage(pComp);
    }
  } else {
    // error?
    console.log('[pca-worker]: received unhandled message type: ' + msg.type);
  }
};

function pca(x) {
  var sigma = numeric.div(
    numeric.dot(numeric.transpose(x), x),
    x.length
  );
  var U = numeric.svd(sigma).U;
  return U.map(function (row) {
    return row.slice(0, k);
  });
}

function trim(x) {
  var toClean = [];

  for (var i = 1 + prevDataLength; i < x.length; i++) {
    var prevVel = x[i-1][1],
        currVel = x[i][1];

    if (currVel - prevVel < -0.5) {
      toClean.push(i);
    }
  }

  var newData = [];

  for (var i = 0, j = x.length; i < j; i++) {
    var toInclude = true;
    for (var l = 0; l < toClean.length; l++) {
      if ((i + 60 > toClean[l]) && (i < toClean[l])) {
        toInclude = false;
      }
    }

    if (toInclude) {
      newData.push(x[i]);
    }
  }

  if (newData.length > dataTrimLength) {
    newData.splice(newData.length - 8000, 8000);
  }

  return newData;
}
