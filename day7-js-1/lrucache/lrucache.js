function createLRUCache(size) {
    return {
        size: size,
        queue: [],
        hash: {},

        getResponse: function (request) {
            // request already is in the cache
            if (request in this.hash) {
                for (var i = 0; i < this.queue.length; ++i) {
                    if (this.queue[i] == request) {
                        this.queue.splice(i, 1);
                        this.queue.push(request);
                        break;
                    }
                }
                return this.hash[request];
            }

            var response = request + " - ok"; // replace with real response's calculation

            // cache overflow
            if (this.queue.length == this.size) {
                var latestRequest = this.queue.shift();
                delete this.hash[latestRequest];
            }

            // append new request to cache
            this.hash[request] = response;
            this.queue.push(request);

            return response;
        }
    };
}

// tests part
var test = createLRUCache(4);
console.log(test);
test.getResponse('hi');
console.log(test);
test.getResponse('privet');
console.log(test);
test.getResponse('hello');
console.log(test);
test.getResponse('hi');
console.log(test);
test.getResponse('good night');
console.log(test);
test.getResponse('good day');
console.log(test);