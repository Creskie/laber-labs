var queue = require("./queue.js");

function EventManager() {
    this.newObj = new queue.Queue();
    this.deadObj = new queue.Queue();
}

exports.EventManager = EventManager;