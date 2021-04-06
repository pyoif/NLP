# NLP by Hiyurigi
A simple implementation of NLP in JS.

# How to use
## Installation
```bash
npm i @hiyurigi/nlp
```
## Function
- Text Correction
  ### Example:
    ```javascript
    const NLP = require('@hiyurigi/nlp')("TextCorrection");
    let v = new NLP(["stats", "menu", "xzxz"]);
    let result = v.TextCorrection({Needle: "mqnts", Threshold: 0.4, NgramsLength: 1});
    console.log(result);
    ```
    ### Output:
    ```javascript
    [
        { Key: 'menu', Text: [ 'm', 'e', 'n', 'u'], similarity: 1 },
        { Key: 'stats', Text: [ 'm', 'q', 'n', 't', 's' ], similarity: 0.4 }
    ]
    ```
    |Parameter|Description|Type|Default|
    |---------|-----------|----|-------|
    |Needle| Text you want to fix.| String \| **Required** | None |
    |NgramsLength| how many grams you want.| integer \| **Optional**| 1 |
    |Threshold| Text correction threshold.| float \| **Optional**| 0.3 |
    |ThresholdOperator| Threshold js comparison operator.| String \| **Optional**| >= |
    |KeyRange| Key distance on the keyboard.| Integer \| **Optional** | 2 |
    |Autofix| Auto fix word (works only with NgramsLength = 1). | Boolean \| **Optional** | true |
    |RemoveArray| Remove array when output just 1. | Boolean \| **Optional** | false |
- Text Completion
    ### Example:
    ```javascript
    const NLP = require('@hiyurigi/nlp')("TextCompletion");
    let v = new NLP(["stats", "menu", "xzxz"]);
    let result = v.TextCompletion("m");
    console.log(result);
    ```
    ### Output:
    ```txt
    menu
    ```
    |Parameter|Description|Type|Default|
    |---------|-----------|----|-------|
    |UncompleteText| Uncompleted Text.|String \| **Required**|None

> [Read More](https://github.com/Hiyurigi/NLP/wiki)

## Testing
```bash
npm test
```

# TODO List
- [x] Create text correction
- [x] Create text completion

> If you have a Idea feel free to suggest me

# License
[License](COPYING) - GNU GPLv3
