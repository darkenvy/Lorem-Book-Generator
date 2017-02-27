let fs = require('fs');
let reader = require('readline').createInterface({
  input: fs.createReadStream('superintelligence.txt')
})
let book = {};

// ======================================== //
// |              The Stream                //
// ======================================== //
let lastLine = [{ref:null}]; // Attaches last word of a line to the first word of next line
reader.on('line', line => {
  function cleanAndSplit(text) {
    text = text.toLowerCase();
    text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?“”]/g,"");
    text = text.replace(/[0-9]+/g, '');
    text = text.replace(/\w{25,}/g, '');
    return text.match(/\w[^\s]+/g) || [];
  }
  let wordArr = cleanAndSplit(line);

  // Go through each word of the line
  for (var i=0; i<wordArr.length; i++) {
    // ========== 1 ==========
    // Update previous line. Because this is a stream, we store a reference
    // to the last line that was 'undefined'. then update it with the first word
    if (lastLine[0].ref !== null) {
      let modRef = lastLine[0].ref
      let nearLen = modRef.near.length-1;
      modRef.near[nearLen] = wordArr[i];
      lastLine[0].ref = modRef
      lastLine = [{ref:null}];
    }
    // ========== 2 ==========
    // Create new entry since it doesnt exist
    if (!book[wordArr[i]]) {
      book[wordArr[i]] = {
        name: wordArr[i],
        count: 1,
        // near: (i>0 && i<wordArr.length) ? [ wordArr[i-1], wordArr[i+1] ] : []
        near: (i>0 && i<wordArr.length) ? [, wordArr[i+1] ] : []
      }
    } 
    // ========== 3 ==========
    // Update word with count & neighbors
    else {
      book[wordArr[i]].count += 1;
      if (i>0 && i<wordArr.length) {
        // let appended = book[wordArr[i]].near.concat([wordArr[i-1], wordArr[i+1]]);
        let appended = book[wordArr[i]].near.concat([wordArr[i+1]]);
        book[wordArr[i]].near = appended;
      }
    }
    // ========== 4 ==========
    // Check if the last 'near' word is undefined
    // This means that we must append the next line's first word
    // with this position
    let nearCheck = book[wordArr[i]].near;
    if (nearCheck.length > 0 && nearCheck[nearCheck.length-1] === undefined) {
      lastLine = [{}]
      lastLine[0].ref = book[wordArr[i]]
      // console.log(lastLine);
    }
  }
});


// ======================================== //
// |             Linked Lists               //
// ======================================== //
function linkBook() {
  for (let page in book) {
    book[page].near.forEach((word, idx, arr) => {
      arr[idx] = book[word];
    });
  }
}


// ======================================== //
// |           Generate Lorem               //
// ======================================== //
function genLorem() {
  let wordCount = 0;
  let lorem = '';

  let recurse = function(obj) {
    if (wordCount > 100) return;
    let getRandom = () => Math.floor(Math.random()*obj.length);
    let r = getRandom();
    while (!r) r = getRandom();
    lorem += ' ' + obj[r].name;
    wordCount += 1;
    recurse(obj[r].near);
  }
  // Remove recursion for performance. Simply pass the current object pointer around
  recurse(book.mob.near) // The kickstart. The input requires an array
  return lorem;
}


// ======================================== //
// |                  Main                  //
// ======================================== //
reader.on('close', () => {
  linkBook()
  let ipsum = genLorem();
  console.log(ipsum);
  // console.log(book.mob.near[0].near[0]);
});