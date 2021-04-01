{/* 
    <NLP, A simple implementation of NLP in JS>
    Copyright (C) <2021>  <Hiyurigi>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/}

String.prototype.capitalize = function() {return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();}
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
class NLP {
    #KeyConfig = {
        row: [
            "`1234567890-=",
            "qwertyuiop[]\\",
            "asdfghjkl;'",
            "zxcvbnm,./"
        ],
        col: [
            "1qaz",
            "2wsx",
            "3edc",
            "4rfv",
            "5tgb",
            "6yhn",
            "7ujm",
            "8ik,",
            "9ol.",
            "0p;/",
            "-['",
            "=]",
        ]
    }
    constructor({keyRange = 2, wordPredictDistance = 1}) {
        this.#checkTypes({keyRange: ['int', keyRange], wordPredictDistance: ['int', wordPredictDistance]}, true);
        this.maxWordpredict = wordPredictDistance;
        this.keyRange = keyRange;
        return this
    }
    #validateTypes(Type, value){
        let result = {Type: Type, Value: [], Empty: true, Valid: []}
        Type = Type.toLowerCase() == "array" ? "object" : ["int", "integer"].includes(Type.toLowerCase()) ? "number" : Type.toLowerCase() == "str" ? "string" : Type;
        for(let x of value){
            if(typeof x != "undefined"){
                if(x.length != 0){
                    result["Empty"] =  false;
                    result["Value"].push(x);
                }
            }
            result["Valid"].push((typeof(x) == Type.toLowerCase()));
        }
        return result;
    }
    async #checkTypes(list, empty_check = false, returnVar = false, ...returnList){
        let results = {}
        let returnVal = {}
        for(let key in list){
            let Type = list[key][0];
            list[key].shift()
            const result = await this.#validateTypes(Type, list[key]);
            results[key] = result;
        };
        for(let x in results){
            if(empty_check && results[x]['Empty']){
                throw new Error(`${x.capitalize()} is Empty!`)
            }
            if(!results[x]['Valid'].includes(true)){
                throw new Error(`${x.capitalize()} must be ${results[x]['Type'].capitalize()}`);
            }else if(returnVar){
                if(!empty_check){
                    return "You need use empty check!";
                }
                if(returnList.includes(x)){
                    returnVal[x] = results[x]['Value'];
                }
            }
        }
        return returnVal;
    }
    #is_int(value) {
        return parseInt(value) === parseFloat(value);
    }
    #checkSimilarity(word1, word2, similar){
        return similar.length / (Math.sqrt(word1.length) * Math.sqrt( word2.length));
    }
    #findKeyConfig(word){
        let pos = {row: [], col: []}
        let keyList = {row: [], col: []}
        for(let x in this.#KeyConfig['row']){
            if(this.#KeyConfig['row'][x].includes(word)){
                pos['row'].push(x);
                pos['row'].push(this.#KeyConfig['row'][x].indexOf(word));
                break;
            }
        }
        for(let y in this.#KeyConfig['col']){
            if(this.#KeyConfig['col'][y].includes(word)){
                pos['col'].push(y);
                pos['col'].push(this.#KeyConfig['col'][y].indexOf(word));
                break;
            }
        }
        if(pos['row'].length > 0){
            keyList['row'] =  this.#KeyConfig['row'][pos['row'][0]].slice(pos['row'][1] - this.keyRange < 1 ? 0 : pos['row'][1] - this.keyRange, pos['row'][1] + this.keyRange > this.#KeyConfig['row'][pos['row'][0]].length ? this.#KeyConfig['row'][pos['row'][0]].length : pos['row'][1] + this.keyRange + 1).split("");
        }
        if(pos['col'].length > 0){
            keyList['col'] =  this.#KeyConfig['col'][pos['col'][0]].slice(pos['col'][1] - this.keyRange < 1 ? 0 : pos['col'][1] - this.keyRange, pos['col'][1] + this.keyRange > this.#KeyConfig['col'][pos['col'][0]].length ? this.#KeyConfig['col'][pos['col'][0]].length : pos['col'][1] + this.keyRange + 1).split("");
        }
        return keyList;
    }
    #getUnigram(word) {
        let result = [];
    
        for (let i = 0; i < word.length; i++) {
            result.push(word[i]);
        }
    
        return result;
    }
    
    getSimilarity(word1, word2) {
        word1 = String(word1).toLowerCase();
        word2 = String(word2).toLowerCase();
        let result = {Unigram1: this.#getUnigram(word1), Unigram2: this.#getUnigram(word2), Unigram2Fix: this.#getUnigram(word2), similar: []}
    
        for (let i in result.Unigram1) {
            i = parseInt(i);
            let t = result.Unigram2.slice(i - this.maxWordpredict < 0 ? 0 : i - this.maxWordpredict, i + this.maxWordpredict > result.Unigram2.length ? result.Unigram2.length : i + this.maxWordpredict + 1);
            if (t.includes(result.Unigram1[i])) {
                result.similar.push(result.Unigram1[i]);
            }else{
                let conf = this.#findKeyConfig(result.Unigram2[i]);
                if(conf.row && conf.col){
                    if(conf['row'].includes(result.Unigram1[i])){
                        result.Unigram2Fix[i] = conf['row'][conf['row'].indexOf(result.Unigram1[i])];
                        result.similar.push(conf['row'][conf['row'].indexOf(result.Unigram1[i])]);
                    }else if(conf['col'].includes(result.Unigram1[i])){
                        result.Unigram2Fix[i] = conf['col'][conf['col'].indexOf(result.Unigram1[i])];
                        result.similar.push(conf['col'][conf['col'].indexOf(result.Unigram1[i])]);
                    }
                }
            }
        }
        if(result.similar.equals(result.Unigram1) && result.Unigram1.length != result.Unigram2.length){
            for(let x of result.Unigram2Fix){
                if(!result.Unigram1.includes(x)){
                    result.Unigram2Fix.splice(result.Unigram1.indexOf(x), 1);
                }
            }
        }
        if(result.Unigram2Fix.equals(result.Unigram2)){
            delete result.Unigram2Fix;
        }
        result.similarity = this.#checkSimilarity(result.Unigram1, typeof result.Unigram2Fix == "undefined" ? result.Unigram2 : result.Unigram2Fix, result.similar);
        return result;
        
    }
    TextCorrection({needle, haystack = [], keyRange, wordPredictDistance}) {
        this.#checkTypes({needle: ['str', needle], haystack: ['array', haystack], keyRange: ['int', keyRange, this.keyRange], maxWordpredict: ['int', wordPredictDistance, this.maxWordpredict]}, true, true, "keyRange", "maxWordpredict").then((option) => {
            if(option['keyRange'].length > 1 && option['keyRange'] > this.keyRange && keyRange){
                this.keyRange = keyRange
            }
            if(option["maxWordpredict"].length > 1 && option['maxWordpredict'] > this.maxWordpredict && wordPredictDistance){
                this.maxWordpredict = wordPredictDistance
            }
        });

        let info = []
        for (let i of haystack) {
            info.push(this.getSimilarity(i, needle))
        }
        info = info.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity))
        return info;
    }
}

module.exports = NLP