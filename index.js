let fs = require('fs');
let determiners = require('./determiners.module');
let allWords = {};
let dict = {}
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

}
reader.on('close', () => {
  postClean();
  // console.log(dict);
  console.log('END');
})