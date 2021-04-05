const { PerformanceObserver, performance } = require('perf_hooks');
const NLP = require('./index')("TextCompletion");
const obs = new PerformanceObserver((items) => {
    console.log("Took " + items.getEntries()[0].duration + "ms to run");
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });
performance.mark("TextCorrection-start");
let v = new NLP(["stats", "menu", "xzxz"]);
// let result = v.TextCorrection({Needle: "mqnts", Threshold: 0.4, NgramsLength: 1});
// let v = new NLP(["stats", "menu"], {});
let result = v.TextCompletion("m");
console.log(result);
performance.mark("TextCorrection-end");
performance.measure("TextCorrection-TotalTime", "TextCorrection-start", "TextCorrection-end");