let fs = require('fs');
let reader = require('readline').createInterface({
  input: fs.createReadStream('superintelligence.txt')
})
let book = {};

reader.on('line', line => {
  function cleanAndSplit(text) {
    text = text.toLowerCase();
    text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?“”]/g,"");
    text = text.replace(/[0-9]+/g, '');
    text = text.replace(/\w{25,}/g, '');
    return text.match(/\w[^\s]+/g);
  }

  function addToBook(word, neighbors) {
    // does book have the number keys?
    if (!book.hasOwnProperty(word.length)) book[word.length] = {};
    
    // If the first word, create first object
    if (!book[word.length][word]) {
      book[word.length][word] = {
        count: 1,
        neighbors: neighbors
      }
    } 
    // If not the first, increment and add neighbors
    else {
      book[word.length][word].count += 1;
      if (book[word.length][word].neighbors) {
        let newNeighbor = book[word.length][word].neighbors.concat(neighbors);
        book[word.length][word].neighbors = newNeighbor;
      }
    }
  }

  let words = cleanAndSplit(line);
  if (words) {
    for (var i=0; i<words.length; i++) {
       let neighbors = null;
       if (i>0 && i<words.length) neighbors = [words[i-1], words[i+1]]
       addToBook(words[i], neighbors);
    }
  }
});

reader.on('close', () => {
  // Go through each word, and link the neighbors to words
  for (var wordLen in book) {
    let wordLength = book[wordLen];
    for (var word in wordLength) {
      // This if prevents the occasional null
      if (wordLength[word].neighbors) {
        for (var i=0; i<wordLength[word].neighbors.length; i++) {
          // console.log(wordLength[word].neighbors[i]);
          // wordLength[word].neighbors[i]
          let tmpWord = wordLength[word].neighbors[i];
          let tmpCount = wordLength[word].neighbors[i] ? wordLength[word].neighbors[i].length : null;
          if (tmpCount) {
            wordLength[word].neighbors[i] = {
              name: tmpWord,
              neighbors: book[tmpCount][tmpWord]
            }
            // wordLength[word].neighbors[i][tmpWord] = book[tmpCount][tmpWord]
            // console.log(book[tmpCount][tmpWord]);
          }
        }
      }

    } 
  }
  console.log(book);


  
  console.log('FILE CLOSED');
})





























// if (!book.hasOwnProperty(words[i].length)) {
//         let wordi = words[i];
//         book[words[i].length][wordi] = {};
//       } 
      // else if (!book[words[i].length].hasOwnProperty('nearby')) {
      //   book[words[i].length].nearby = []
      // } else {
      //   if (book[words[i].length].nearby.indexOf(words[i+1]) === -1) {
      //     book[words[i].length].nearby.push(words[i+1])
      //   }
      //   if (book[words[i].length].nearby.indexOf(words[i-1]) === -1) {
      //     book[words[i].length].nearby.push(words[i-1])
      //   }
      // }