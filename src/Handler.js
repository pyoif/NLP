const MyHandler = base => {return class Handler extends base {
    constructor(dataset, {...settings} = {}){
        super(dataset, {config: settings})
    }
    Test(){
        return "hello world"
    }
}}

function init(...importList){
    let v = require("./import");
    v = new v(importList !== (0||[]||undefined||null) ? importList : ["TextCorrection"])
    return MyHandler(v.getFunc());
}

module.exports = {init: init};