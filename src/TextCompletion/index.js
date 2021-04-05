const TextCompletion = base => class TextCompletion extends base {
    constructor(dataset, {config}){
        super(dataset, {config: config})
    }
    TextCompletion(UncompleteText){
        let TextList = super.TextCorrection({Needle: UncompleteText, Threshold: 0.2})
        return TextList['Key'] !== undefined ? TextList['Key'] : TextList[0] !== undefined ? TextList[0]['Key'] : false
    }
}

module.exports = TextCompletion