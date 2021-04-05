class core{
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
    #dataset = []
    constructor(dataset){
        this.#dataset = dataset
    }
    getDataset(){
        return this.#dataset
    }
    getKeyConfig(field){
        return this.#KeyConfig[field]
    }
    checkTypes(list, empty_check = false, returnVar = false, ...returnList){
        let results = {}
        let returnVal = {}
        for(let key in list){
            let Type = list[key][0];
            list[key].shift()
            const result = this.#validateTypes(Type, list[key]);
            results[key] = result;
        };
        for(let x in results){
            if(empty_check && results[x]['Empty']){
                throw new Error(`${x.capitalize()} is Empty!`)
            }
            if(!results[x]['Valid'].includes(true)){
                throw new Error(`${x.capitalize()} must be ${results[x]['Type'].capitalize()} include: ${results[x]['RType']}`);
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
    #validateTypes(Type, value){
        let result = {Type: Type, Value: [], Empty: true, Valid: []}
        Type = Type.toLowerCase() == "array" ? "object" : ["int", "integer", "float"].includes(Type.toLowerCase()) ? "number" : Type.toLowerCase() == "str" ? "string" : Type;
        for(let x of value){
            if(typeof x != "undefined"){
                if(x.length != 0){
                    result["Empty"] =  false;
                    result["Value"].push(x);
                }
            }
            result["Valid"].push((typeof(x) == Type.toLowerCase()));
            result['RType'] = typeof(x)
        }
        return result;
    }
}

module.exports = core;