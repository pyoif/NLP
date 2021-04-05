const TextCorrection = base => class TextCorrection extends base{
    constructor(dataset, {config}){
        super(dataset)
        let TextCorrection = config.TextCorrection !== undefined ? config.TextCorrection : {}
        this.keyRange = TextCorrection.KeyRange !== undefined ? TextCorrection.KeyRange : 2 
        this.ngramsLength = TextCorrection.NgramsLength !== undefined ? TextCorrection.NgramsLength : 1
        this.threshold = TextCorrection.Threshold !== undefined ? TextCorrection.Threshold : 0.3
    }
    TextCorrection({Needle, KeyRange, NgramsLength, ThresholdOperator, Threshold, RemoveArray = false, Autofix}) {
        let option = super.checkTypes({needle: ['str', Needle], keyRange: ['int', KeyRange, this.keyRange], ngrams: ["int", NgramsLength, this.ngramsLength], threshold: ["float", Threshold, this.threshold]}, true, true, "keyRange", "threshold", "ngrams");
        if(option['keyRange'].length > 1 && option['keyRange'][0] !== ("" || undefined || this.keyRange)){
            this.keyRange = KeyRange
        }
        if(option['ngrams'].length > 1 && option['ngrams'][0] !== ("" || undefined || 0)){
            this.ngramsLength = NgramsLength
        }
        if(option['threshold'].length > 1 && option['threshold'][0] !== ("" || undefined || this.threshold)){
            this.threshold = Threshold
        }
        let info = []
        let p;
        for (let i of super.getDataset()) {
            p = Autofix ? this.#getSimilarity(i, Needle, Autofix) : this.#getSimilarity(i, Needle);
            p.fixed !== undefined ? info.push({Key: p['Key'], Text: p.fixed, similarity: p["similarity"]}) : info.push({Key: p['Key'], Text: p.Original, similarity: p["similarity"]})
        }
        p = null;
        info = info.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity))
        switch(ThresholdOperator){
            case "<=":
                info = info.filter((arr) => arr.similarity <= this.threshold);
                break;
            case "==":
                info = info.filter((arr) => arr.similarity == this.threshold);
                break;
            case "!=":
                info = info.filter((arr) => arr.similarity != this.threshold);
                break;
            case "<":
                info = info.filter((arr) => arr.similarity < this.threshold);
                break;
            case ">":
                info = info.filter((arr) => arr.similarity > this.threshold);
                break;
            default:
                info = info.filter((arr) => arr.similarity >= this.threshold);
                break;

        }
        return RemoveArray ? info.length == 1 ? info[0] : info : info;
    }
    #checkSimilarity(word1, word2, similar){
        return (similar.length * word2.length) / (Math.sqrt((word1.length * word1.length)) * Math.sqrt((word2.length * word2.length)))
    }
    #findKeyConfig(word){
        this.pos = {row: [], col: []}
        let keyList = {row: [], col: []}
        for(let x of super.getKeyConfig("row")){
            if(x.includes(word)){
                this.pos['row'].push(super.getKeyConfig("row").indexOf(x));
                this.pos['row'].push(x.indexOf(word));
                break;
            }
        }
        for(let y of super.getKeyConfig('col')){
            if(y.includes(word)){
                this.pos['col'].push(super.getKeyConfig("col").indexOf(y));
                this.pos['col'].push(y.indexOf(word));
                break;
            }
        }
        if(this.pos['row'].length > 0){
            keyList['row'] =  super.getKeyConfig('row')[this.pos['row'][0]].slice(this.pos['row'][1] - this.keyRange < 1 ? 0 : this.pos['row'][1] - this.keyRange, this.pos['row'][1] + this.keyRange + 1 > super.getKeyConfig("row")[this.pos['row'][0]].length ? super.getKeyConfig('row')[this.pos['row'][0]].length : this.pos['row'][1] + this.keyRange + 1).split("");
        }
        if(this.pos['col'].length > 0){
            keyList['col'] =  super.getKeyConfig('col')[this.pos['col'][0]].slice(this.pos['col'][1] - this.keyRange < 1 ? 0 : this.pos['col'][1] - this.keyRange, this.pos['col'][1] + this.keyRange + 1 > super.getKeyConfig('col')[this.pos['col'][0]].length ? super.getKeyConfig('col')[this.pos['col'][0]].length : this.pos['col'][1] + this.keyRange + 1).split("");
        }
        delete this.pos;
        return keyList;
    }

    #getSimilarity(word1, word2, Autofix = true) {
        word1 = String(word1).toLowerCase();
        word2 = String(word2).toLowerCase();
        let result = {Key: word1, Ngram1: this.#getNgram(word1), Ngram2: this.#getNgram(word2), Ngram2Fix: this.#getNgram(word2), similar: []}

        for (let [key, value] of Object.entries(result.Ngram1)) {
            if(result.Ngram2[key] !== undefined){
                if(Object.values(result.Ngram2[key]).equals(value)){
                    result.similar.push(value);
                }else if(this.ngramsLength == 1 && Autofix){
                    let conf = this.#findKeyConfig(result.Ngram2[key][0]);
                    if(conf.row && conf.col){
                        if(conf['row'].includes(value[0])){
                            result.Ngram2Fix[key][0] = conf['row'][conf['row'].indexOf(value[0])];
                            result.similar.push([conf['row'][conf['row'].indexOf(value[0])]]);
                        }else if(conf['col'].includes(value[0])){
                            result.Ngram2Fix[key][0] = conf['col'][conf['col'].indexOf(value[0])];
                            result.similar.push([conf['col'][conf['col'].indexOf(value[0])]]);
                        }
                    }
                }
            }
        }
        if(result.similar.equals(result.Ngram1) && result.Ngram1.length != result.Ngram2Fix.length){
            for(let [key, val] of Object.entries(result.Ngram2Fix)){
                if(result.Ngram1[key] !== undefined){
                    if(!result.Ngram1[key].equals(val)){
                        result.Ngram2Fix.splice(key, 1);
                    }
                }else{
                    result.Ngram2Fix.splice(key, 1);
                }
            }
        }
        if(result.Ngram2Fix.equals(result.Ngram2) || this.ngramsLength != 1){
            delete result.Ngram2Fix;
        }else{
            delete result.Ngram2;
        }
        result.similarity = this.#checkSimilarity(result.Ngram1, result.Ngram2Fix == undefined ? result.Ngram2 : result.Ngram2Fix, result.similar);
        if(result.Ngram2Fix !== undefined){
            result.fixed = []
            for(let x of result.Ngram2Fix){
                for(let xx of x){
                    result.fixed.push(xx)
                }
            }
        }else{
            result.Original = []
            for(let x of result.Ngram2){
                for(let xx of x){
                    result.Original.push(xx)
                }
            }
        }
        return result;
        
    }

    #getNgram(word) {
        let result = [];

        for (let i = 0; i < word.length - (this.ngramsLength - 1); i++) {
            let subNgramsArray = [];

            for (let j = 0; j < this.ngramsLength; j++) {
                subNgramsArray.push(word[i + j])
            }

            result.push(subNgramsArray);
        }

        return result;
    }
}

module.exports = TextCorrection