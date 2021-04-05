let v = require("./import");

const MyHandler = base => {return class Handler extends base {
    constructor(dataset, {...settings} = {}){
        super(dataset, {config: settings})
    }
    Test(){
        return "hello world"
    }
}}

function init(...importList){
    v = new v(importList.length !== 0 ? importList : ["TextCorrection"])
    return MyHandler(v.getFunc());
}

module.exports = {init: init};