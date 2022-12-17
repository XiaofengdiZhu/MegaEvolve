var intervals = {};
let lastDone = true;
function fastTick(period) {
    if(lastDone) {
        lastDone = false;
        self.postMessage('fast');}
    intervals['main_loop'] = setTimeout(() => fastTick(period), period<1?0:period);
}

self.addEventListener('message', function (e) {
    var data = e.data;
    switch (data.loop) {
        case 'short':
            lastDone = true;
            intervals['main_loop'] = fastTick(data.period);
            break;
        case 'mid':
            intervals['mid_loop'] = null;
            break;
        case 'long':
            intervals['long_loop'] = null;
            break;
        case 'clear':
            clearTimeout(intervals['main_loop']);
            break;
        case "done":
            lastDone = true;
            break;
    }
    ;
}, false);
