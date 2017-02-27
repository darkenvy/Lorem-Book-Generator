let fs = require('fs');
let determiners = require('./determiners.module');
let allWords = {};
let dict = {};
let reader = require('readline').createInterface({
  input: fs.createReadStream('superintelligence.txt')
})

function cleanAndSplit(text) {
  text = text.toLowerCase();
  text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?“”]/g,"");
  text = text.replace(/[0-9]+/g, '');
  text = text.replace(/\w{25,}/g, '');
  return text.match(/\w[^\s]+/g);
}

reader.on('line', line => {
  let wordList = cleanAndSplit(line);
  if (wordList) {
    wordList.forEach(word => {
      allWords[word] = allWords[word] + 1 || 1
    });
  }
});

// ----------------------------------------- //


reader.on('close', () => {
  console.log('FILE CLOSED');
  postClean();
})


function postClean() {
  // Remove certain parts of speech
  determiners.forEach(determiner => {
    if (allWords.hasOwnProperty(determiner)) {
      delete allWords[determiner];
    }
  });

  // reformat into new object now that importing is done
  for (var word in allWords) {
    if (!dict.hasOwnProperty(word.length)) {
      dict[word.length] = {
        lengths: word.length,
        unique: 0,
        total: 0,
        words: []
      }
    } else {
      dict[word.length].words.push(
        [word,allWords[word]]
      );
    }
  }

  // Sort words within the each 'count' section
  // Update unique/total counts as well
  for (var wordLen in dict) {
    dict[wordLen].words.sort((a,b) => {
      return b[1] - a[1];
    })
    dict[wordLen].unique = dict[wordLen].words.length;
    dict[wordLen].total = dict[wordLen].words.reduce( (a,b) => {
      return a + parseInt(b[1]);
    }, 0)
    console.log(dict[wordLen]);
  }

  genBook();

}



// ----------------------------------------- //



function genBook() {
  let paragraph = '';
  let sentence = '';
  // Cheap-o probability distribution. 
  // https://plus.maths.org/content/mystery-zipf
  let randWordLength = [
    25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,
    8,8,
    7,7,
    6,6,6,6,
    5,5,5,5,5,
    4,4,4,4,4,4,
    3,3,3,3,3,3,3,3,
    2,2,2,2,2,2,
    // 1,1
  ];

  // https://strainindex.wordpress.com/2008/07/28/the-average-sentence-length/
  let randomSentenceLength = [
    26,25,24,
    23,23,
    22,22,22,
    21,21,21,
    20,20,20,20,
    19,19,19,19,19,
    18,18,18,18,18,18,
    17,17,17,17,17,17,17,
    16,16,16,16,16,16,
    15,15,15,15,15,
    14,14,14,14,
    13,13,13,
    12,12,
    11,11,
    10,10,
    9,8,7,6,5,4,3
  ];

  // Probability Function
  function probFunc(lengthList) {
    return lengthList[Math.floor(Math.random() * lengthList.length)];
  }

  function genWord() {
    let letterCount = probFunc(randWordLength);
    let wordRare = Math.ceil(Math.random()*dict[letterCount].total);
    let currWord;
    let i = 0;
    while (wordRare > 0) {
      currWord = dict[letterCount].words[i];
      wordRare -= currWord[1];
    }
    return dict[letterCount].words[i][0];
  }

  function genSentence() {
    let wordCount = probFunc(randomSentenceLength);
    let currSentence = '';
    for (var i=0; i<wordCount; i++) {
      if (parseInt(Math.random()*10) === 1) {currSentence += '.';}
      else if (parseInt(Math.random()*10) === 2) currSentence += ',';
      currSentence += ' ' + genWord();
    }
    return currSentence;
  }

  // console.log(probFunc(randWordLength));
  while (paragraph.length < 1000) {
    paragraph += genSentence();

  }
  console.log(paragraph);

}