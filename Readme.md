# NLP by Hiyurigi
A simple implementation of NLP in JS.

# How to use
## Installation
```
npm i @hiyurigi/NLP
```
## Function
- Text Correction
  ### Example:
    ``` js
    const NLP = require('@hiyurigi/nlp');
    let v = new NLP({keyRange: 2});
    v.TextCorrection({haystack: ["stats", "menu", "xzxz"], needle: "mqnts"});
    ```
    ```json
    Output:
    [
    {
        Unigram1: [ 'm', 'e', 'n', 'u' ],
        Unigram2: [ 'm', 'q', 'n', 't', 's' ],
        Unigram2Fix: [ 'm', 'e', 'n', 'u' ],
        similar: [ 'm', 'e', 'n', 'u' ],
        similarity: 1
    },
    {
        Unigram1: [ 's', 't', 'a', 't', 's' ],
        Unigram2: [ 'm', 'q', 'n', 't', 's' ],
        similar: [ 't', 's' ],
        similarity: 0.3999999999999999
    },
    {
        Unigram1: [ 'x', 'z', 'x', 'z' ],
        Unigram2: [ 'm', 'q', 'n', 't', 's' ],
        Unigram2Fix: [ 'm', 'z', 'n', 't', 's' ],
        similar: [ 'z' ],
        similarity: 0.22360679774997896
    }
    ]
    ```
|Parameter|Description|Type|Default|
|---------|-----------|----|-------|
|needle| Text you want to fix.| String \| **Required** | None |
|haystack| Array contains data.| Array \| **Required**| None |
|keyRange| Key distance on the keyboard.| Integer \| **Optional** | 2 |
|wordPredictDistance| Max word predict distance. | Integer \| **Optional** | 1 |

## Testing
```
npm test
```

# TODO List
- [x] Create text correction
- [ ] Create text completion

> If you have a Idea just contact me

# License
[License](COPYING) - GNU GPLv3