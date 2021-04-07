const { PerformanceObserver, performance } = require('perf_hooks');
const NLP = require('./index')("TextCompletion");
const obs = new PerformanceObserver((items) => {
    console.log("Took " + items.getEntries()[0].duration + "ms to run");
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });
performance.mark("TextCorrection-start");
let list = [
    'add',           'apakah',         'apa',          'bangroup',      
    'banuser',       'base64',         'blur',         'brainly',       
    'brightness',    'broadcastgc',    'bcgc',         'broadcast',     
    'bc',            'calc',           'hitung',       'changebio',     
    'gantibio',      'changeprefix',   'gantiprefix',  'changeusername',
    'gantiusername', 'coloroverlay',   'contrast',     'dadu',
    'debase64',      'dehex',          'delete',       'del',
    'demorse',       'demote',         'feedback',     'fitnah',        
    'fakereply',     'gempadirasakan', 'gempaterkini', 'google',        
    'grayscale',     'grup',           'group',        'hex',
    'hiragana',      'hue',            'kapankah',     'kapan',
    'katakana',      'kbbi',           'kick',         'halah',
    'hilih',         'huluh',          'heleh',        'holoh',
    'listgroup',     'lowercase',      'menu',         'help',
    'morse',         'negative',       'ping',         'pokoknya',      
    'promote',       'qr',             'qrscan',       'scanqr',        
    'randomanime',   'randomcase',     'reversetext',  'romaji',        
    'run',           'saturation',     'saus',         'sauce',
    'ssweb',         'sticker',        'stiker',       's',
    'tebakgambar',   'tebakkata',      'textanalyzer', 'analisateks',   
    'unbangroup',    'unbanuser',      'unsticker',    'unstiker',      
    'uns',           'unwarn',         'uppercase',    'whutanime',     
    'wait',          'wangy',          'wangi',        'warn',
    'setwelcome',    'wikipedia',      'wiki'
  ]
let v = new NLP(list);
let result = v.TextCorrection({Needle: "dadu", Threshold: 0.2, NgramsLength: 1, KeyRange: 1, Autofix: false});
result = v.TextCorrection({Needle: "mwny", Threshold: 0.2, NgramsLength: 1, KeyRange: 1, Autofix: false});
// let v = new NLP(["stats", "menu"], {});
// let result = v.TextCompletion("m");
console.log(result);
performance.mark("TextCorrection-end");
performance.measure("TextCorrection-TotalTime", "TextCorrection-start", "TextCorrection-end");