const { PerformanceObserver, performance } = require('perf_hooks');
const NLP = require('./index');
const obs = new PerformanceObserver((items) => {
    console.log("Took " + items.getEntries()[0].duration + "ms to run");
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });
performance.mark("TextCorrection-start");
let v = new NLP({keyRange: 2});
let result = v.TextCorrection({haystack: ["stats", "menu", "xzxz"], needle: "mqnts"});
performance.mark("TextCorrection-end");
console.log(result);
performance.measure("TextCorrection-TotalTime", "TextCorrection-start", "TextCorrection-end");