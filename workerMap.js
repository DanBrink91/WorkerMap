// workerMap.js
function workerMap(workerCount) {
	this.workerCount = workerCount;
	this.completed = 0;
}

workerMap.prototype.map = function(array, fn) {
	var self = this;
	var workerSource = "onmessage=function(e){ postMessage(("+fn.toString()+")(e.data));}"
	var blobURL = URL.createObjectURL(new Blob([workerSource], 
	 {type: 'application/javascript'})
	);
	this.sections = Math.floor(array.length / this.workerCount);
	this.leftOver = array.length % this.workerCount;
	this.results = new Array(this.workerCount);

	var lastSection = 0;
	for(var i = 0; i < this.workerCount; i++) {
		var worker = new Worker(blobURL);
		// closure to preserve i
		worker.onmessage = (function(index){ 
			return function(e) {
				self.completed++;
				if(self.ondata) {
					self.ondata(e);
				}
				self.results[index] = e.data; 
				if(self.completed >= self.workerCount) {
					self.complete();
				}
			};
		})(i);

		var addLeftover =  this.leftOver > i ? 1: 0;
		var section_data = array.slice(lastSection, lastSection + this.sections + addLeftover);
		lastSection = lastSection + this.sections + addLeftover;

		worker.postMessage(section_data);
	}
	URL.revokeObjectURL(blobURL);	
}

workerMap.prototype.complete = function() {
	var data = [];
	if (this.results[0] instanceof Array) {
		data = data.concat.apply(data, this.results);
	}
	else {
		data = this.results;
	}
	if(this.oncomplete) {
		this.oncomplete(data);
	}
	}