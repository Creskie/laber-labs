var cluster = require('cluster');
var train = require("./train.js");
var fs = require("fs");

// set up jobs to run
var counters = train.genCounters(10000);
var jobFn = train.runRep;
var jobs = new Array();

var faces = ["forager", "aggressor", "camper", "evader"];

var numReps = 25;

var data = {};
for (var i = 0; i < faces.length; i++) {
    var face = faces[i];
    data[face] = new Array();
    for (var j = 0; j < counters.length; j++) {
        var counter = counters[j];
        data[face].push({counter: counter,
                         values: new Array()});
        for (var rep = 0; rep < numReps; rep++) {
            data[face][j]["values"].push(undefined);
            jobs.push({type: "job",
                       face: face,
                       counter: j,
                       rep: rep,
                       args: [face, counter, rep]});
        }
    }
}

if(cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    // keep track of which job is next to be assigned
    var nextJob = 0

    // assign a job to the worker if there is a job left, otherwise
    // shut down the worker
    function assignJob(worker) {
        if (nextJob < jobs.length) {
            // if there are jobs left, assign a job
            console.log("assigning job " + nextJob + " out of " + jobs.length
                        + " to worker " + worker.process.pid);
            var j = jobs[nextJob];
            j.number = nextJob;
            worker.send(j);

            ++nextJob;
        } else {
            // no jobs left, shutdown worker
            console.log("shutting down worker " + worker.process.pid);
            worker.send({type: "shutdown"});
        }
    }

    // start workers
    for(var i = 0; i < numWorkers; i++) {
        var worker = cluster.fork();
        worker.on('message', function(message) {
            // check the message type
            switch(message.type) {
            case "result":
                // if message is a result, do something with it, then
                // proceed to next case (i.e., no break)
                console.log("job completed with result: " + message.result);
                data[message.face][message.counter]["values"][message.rep] =
                    message.result;
            case "start":
                // if a worker wants to start a job, then assign them a job
                assignJob(this);
            }
        });
    }

    cluster.on('online', function(worker) {
        // message to notify that a worker has spawned
        console.log("worker " + worker.process.pid + " is online");
    });

    cluster.on('exit', function(worker, code, signal) {
        // message to notify that a worker has exited
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code
                    + ', and signal: ' + signal);
        --numWorkers;
        if (numWorkers == 0) {
            var str = JSON.stringify(data);
            fs.writeFile("train.json", str, "utf-8", function(err) {
                if (err) throw err;
                console.log("Done!");
            });
        }
    });

} else {
    var app = require('express')();

    process.on('message', function(message) {
        switch(message.type) {
        case "job":
            // notify that the job was received, compute the result,
            // and send back the result
            console.log("received job number " + message.number);
            process.send({type: "result",
                          face: message.face,
                          counter: message.counter,
                          rep: message.rep,
                          result: jobFn.apply(this, message.args)});
            break;
        case "shutdown":
            // shutdown the worker
            console.log("received shutdown job");
            process.exit();
            break;
        }
    });

    var server = app.listen(8000, function() {
        // tell the master to start assigning jobs
        process.send({type: "start"});
    });
}
