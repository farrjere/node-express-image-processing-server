const gm = require('gm');
const wt = require('worker_threads');
const workerData = wt.workerData;
const parentPort = wt.parentPort;
gm(workerData.source).monochrome().write(workerData.destination, function(error){
    if(error){
        throw error;
    }
    parentPort.postMessage({"monochrome": true});
});