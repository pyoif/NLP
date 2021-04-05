const fs = require('fs')
const core = require("./core/index")

class Himport{
    skip = []
    constructor(data){
        this.data = data.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
        this.#checkRequire();
        return this
    }
    #checkRequire(data){
        for(let i of data !== undefined ? data : this.data){
            if(fs.existsSync(__dirname + "/" + i + "/require.json")){
                let r = JSON.parse(fs.readFileSync(__dirname + "/" + i + "/require.json", 'utf8'));
                this.#checkRequire(r.include);
                this.#addFunc(r.include);
            }
        }
    }
    #addFunc(funcname){
        for(let i of funcname){
            if(!this.skip.includes(i)){
                this.skip.push(i);
                if(fs.existsSync(__dirname + "/" + i)){
                    // console.log("ketemu")
                    this.v = require("./"+i+"/index");
                    if(this.list === undefined){
                        this.list = this.v(core);
                    }else{
                        this.list = this.v(this.list)
                    }
                    delete this.v;
                }
            }
        }
    }
    getFunc(){
        let data = this.data;
        // console.log(data)
        data.reverse();
        for(let i of data){
            if(!this.skip.includes(i)){
                if(fs.existsSync(__dirname + "/" + i)){
                    // console.log("ketemu")
                    this.v = require("./"+i+"/index");
                    if(this.list === undefined){
                        this.list = this.v(core);
                    }else{
                        this.list = this.v(this.list)
                    }
                    delete this.v;
                }
            }
        }
        return this.list
    }
}
module.exports = Himport