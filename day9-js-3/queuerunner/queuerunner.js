function QueueRunner(exec) {
    var queue = [];

    this.onfinish = function (err) {
        var currentTask = queue.shift();
        currentTask.onFinish(err);
        if (queue.length > 0) {
            exec(task.data, this.onfinish);
        }
    };

    this.push = function (task) {
        queue.push(task);
        if (queue.length == 1) {
            exec(task.data, this.onfinish);
        }
    };

    this.pause = function () {
        
    };
    
    this.resume = function () {
        
    };
    
    this.cleanup = function () {

    };
}







//----------------------------------------------------------------------------------


var qr = new QueueRunner(function exec(data, onfinish){
    setTimeout(onfinish, data);
});
qr.push({data: 1000, onFinish: function (err) {
    if (err) {
        console.log('error!');
    }  else {
        console.log('ok!');
    }
}});
console.log('some text');