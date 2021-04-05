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
// class NLP {
//     constructor({keyRange = 2, wordPredictDistance = 1}) {
//         this.#checkTypes({keyRange: ['int', keyRange], wordPredictDistance: ['int', wordPredictDistance]}, true);
//         this.maxWordpredict = wordPredictDistance;
//         this.keyRange = keyRange;
//         return this
//     }
//     #is_int(value) {
//         return parseInt(value) === parseFloat(value);
//     }
//     test(){
//         let v = require("./src/Handler").init(["TextCorrection", "TextCompletion"])
//         v = new v(["hi"]);
//         v.Calculate();
//     }
// }
module.exports = require("./src/Handler").init
// module.exports = NLP