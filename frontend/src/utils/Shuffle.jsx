  // source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  // modified to take in an array and return a new array
  export function shuffle(array) {
    let newArray = [...array]; 
    for (let i = newArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; 
    }
    return newArray; 
  }