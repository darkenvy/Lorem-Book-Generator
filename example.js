/* Lorem Ipsum Generator

   Lorem Ipsum filler text is often used to mock how a page might look with real-looking text.

   Your task is to create a program that generates filler text like you can see that our program 
   produced by changing the function "generateIpsum()" below.
   
   The source for the filler words must come from the variable "words" to produce about 1000 
   characters of output.
   
   The time limit for this task is 20 minutes. If you run out of time, it is sufficient to 
   explain how your solution is better or worse than the output of our program and how you 
   would improve it if you had more time.
   
   Send the contents of this pane and the contents of the Result pane as text files when done.
   
*/

var words = "The sky above the port was the color of television, tuned to a dead channel. All this happened, more or less. I had the story, bit by bit, from various people, and, as generally happens in such cases, each time it was a different story. It was a pleasure to burn.";

var newWords = words.match(/(\w+)/g);

// Cheap-o probability distribution. 
// https://plus.maths.org/content/mystery-zipf
var randWordLength = [
  10,9,8,7,
  6,6,
  5,5,
  4,4,
  3,3,3,3,
  2,2,2,
  1,1,1
];

// https://strainindex.wordpress.com/2008/07/28/the-average-sentence-length/
var randomSentenceLength = [
  25,
  21,21,
  17,17,17,
  14,14,
  11
];

// Probability Function
function probFunc(lengthList) {
  return lengthList[Math.floor(Math.random() * lengthList.length)];
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function findWordOfLength(wordList, len) {
  var found = '';
  wordList = shuffleArray(wordList);
  wordList.forEach(function(word) {
    if (word.length === len) {found = word;}
  })
  return found;
}

function createSentence() {
  var sentence = '';
  var currLength = 0;
  var maxLength = probFunc(randomSentenceLength);
  while (currLength < maxLength) {
    // sentence += ' ' + newWords[probFunc(randWordLength)];
    sentence += ' ' + findWordOfLength(newWords, probFunc(randWordLength));
    currLength += 1;
  }
  if ( parseInt(Math.random()*3) === 1) {
    return sentence + ',';
  } else {
    return sentence + '.';
  }
}

function generateIpsum() {
  var sentence = '';
  while (sentence.length + 50 < 1000) {
    sentence += createSentence();
  }
  // Uppercase sentences
  sentence = sentence.replace(/(?:\.\s\w)|(?:^\s?\w)/g, function(m1) {
    return m1.toUpperCase()
  });

  return sentence;
    // return words; // TODO: Replace this with code that generates Ipsum style filler text from "words"
}

// document.getElementById('fill').innerHTML = generateIpsum();
console.log(generateIpsum())