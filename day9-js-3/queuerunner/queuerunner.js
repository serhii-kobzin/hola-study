function QueueRunner(exec) {
    this.queue = [];
    this.pauseFlag = false;
    this.cleanupFlag = false;

    this.onfinish = function (err) {
        var currentTask = this.queue.shift();
        currentTask.onFinish(err);
        if (this.cleanupFlag) {
            while (this.queue.length != 0) {
                currentTask = this.queue.shift();
                currentTask.onFinish('CANCELED');
            }
            this.cleanupFlag = false;
            return;
        }
        if ((this.queue.length != 0) && (!this.pauseFlag)) {
            exec(this.queue[0].data, this.onfinish);
        }
    }.bind(this);

    this.push = function (task) {
        this.queue.push(task);
        if ((this.queue.length == 1) && (!this.pauseFlag) && (!this.cleanupFlag)) {
            exec(task.data, this.onfinish);
        }
    }.bind(this);

    this.pause = function () {
        this.pauseFlag = true;
    }.bind(this);
    
    this.resume = function () {
        this.pauseFlag = false;
        // if ((this.queue.length != 0) && (!this.pauseFlag) && (!this.cleanupFlag)) {
        //     exec(task.data, this.onfinish);
        // }
    }.bind(this);
    
    this.cleanup = function () {
        this.cleanupFlag = true;
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
qr.pause();
qr.push({data: 1000, onFinish: callback});
qr.push({data: 2000, onFinish: callback});
qr.push({data: 3000, onFinish: callback});
qr.resume();
qr.push({data: 4000, onFinish: callback});
qr.push({data: 5000, onFinish: callback});
qr.cleanup();
qr.push({data: 6000, onFinish: callback});

console.log('some text');