const gm = require('gm');
const wt = require('worker_threads');
const workerData = wt.workerData;
const parentPort = wt.parentPort;
gm(workerData.source).resize(100, 100).write(workerData.destination, function(error){
    if(error){
        throw error;
    }
    parentPort.postMessage({"resized": true});
});
