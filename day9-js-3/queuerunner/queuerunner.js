function QueueRunner(exec) {
    this.queue = [];
    this.isPaused = false;
    this.isRunning = false;

    this.onfinish = function (err) {
        var currentTask = this.queue.shift();
        currentTask.onFinish(err);
        if (this.queue.length != 0) {
            exec(this.queue[0].data, this.onfinish);
        }
    }.bind(this);

    this.push = function (task) {
        this.queue.push(task);
        if (!this.isRunning) {
            this.isRunning = true;
            exec(task.data, this.onfinish);
        }
    }.bind(this);

    this.pause = function () {
        this.isPaused = true;
    }.bind(this);
    
    this.resume = function () {
        this.isPaused = false;
    }.bind(this);
    
    this.cleanup = function () {
        this.isRunning = false;
    }.bind(this);
}







//----------------------------------------------------------------------------------


var qr = new QueueRunner(function exec(data, onfinish){
    setTimeout(onfinish, data);
});

var callback = function (err) {
    console.log((err) ? err : 'ok!');
}

qr.push({data: 1000, onFinish: callback});
qr.push({data: 2000, onFinish: callback});
qr.push({data: 500, onFinish: callback});

console.log('some text');