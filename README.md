# WorkerMap
Attempts to evenly divide up the array given to a worker thread to execute the function given. Upon completetion adds it all back to one array while being mindful to keep the same order.
## Example
```html
<script src="workerMap.js"></script>
<script>
var list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function square(smallerlist) {
	return smallerlist.map(function(m) { return m*m; });
}
var wm = new workerMap(4);
wm.ondata = function(e) {
	console.log("Worker Finished: ", e.data);
}
wm.oncomplete = function(data) {
	console.log("Completed! ", data);
}
wm.map(list, square);
</script>
```
