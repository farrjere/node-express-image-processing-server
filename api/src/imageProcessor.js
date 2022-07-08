const path = require("path");
const wt = require("worker_threads");
const isMainThread = wt.isMainThread;
const pathToResizeWorker = path.resolve(__dirname, 'resizeWorker.js');
const pathToMonochromeWorker = path.resolve(__dirname, 'monochromeWorker.js');
module.exports = imageProcessor;

function imageProcessor(filename){
    const sourcePath = uploadPathResolver(filename);
    const resizedDestination = uploadPathResolver('resized-'+filename);
    const monochromeDestination = uploadPathResolver('monochrome-'+filename);
    let resizeWorkerFinished = false;
    let monochromeWorkerFinished = false;

    return new Promise(
        function(resolve, reject){
        if(!isMainThread){
            reject(new Error("not on main thread"));
        }
        try{
            console.log(sourcePath);
            const resizeWorker = new Worker(pathToResizeWorker, {"workerData": {"source": sourcePath, "destination": resizedDestination}});
            const monochromeWorker = new Worker(pathToMonochromeWorker, {"workerData": {"source": sourcePath, "destination": monochromeDestination}});
            resizeWorker.on('message', function(message){
                resizeWorkerFinished = true;
                if(monochromeWorkerFinished){
                    resolve("resizeWorker finished processing");
                }
            });
            resizeWorker.on('error', function(error){
                reject(new Error(error.message));
            });
            resizeWorker.on("exit", function(code){
                if(code !== 0){
                    reject(new Error('Exited with status code '+code));
                }
            });

            monochromeWorker.on('message', function(message){
                monochromeWorkerFinished = true;
                if(resizeWorkerFinished){
                    resolve("monochromeWorker finished processing");
                }
            });
            monochromeWorker.on('error', function(error){
                reject(new Error(error.message));
            });
            monochromeWorker.on("exit", function(code){
                if(code !== 0){
                    reject(new Error('Exited with status code '+code));
                }
            });
        }catch(e){
            reject(e);
        }
        
    });
}

function uploadPathResolver(filename){
    return path.resolve(__dirname, '../uploads', filename);
}