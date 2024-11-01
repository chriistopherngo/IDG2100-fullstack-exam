  // Function that sorts the assessment cards on the table by category

  export function sortTableAssessmentCards(array) {
    // Create a copy of the array to work with to avoid mutating the original array directly.
    const assessmentCardsOnTable = [];
    const cardsToProcess = [...array]; 
  
    while (cardsToProcess.length > 0) {
      // Take the last card from the array for processing.
      const card = cardsToProcess.pop(); 
      // Add the current card to the final sorted array.
      assessmentCardsOnTable.push(card); 
      // The category of the current card.
      const category = card.card_category; 
  
      // Remove all subsequent cards in the same category from the array to prevent duplicates in the output.
      for (let i = cardsToProcess.length - 1; i >= 0; i--) {
        if (cardsToProcess[i].card_category === category) {
          // Remove the card from the array if it matches the category.
          cardsToProcess.splice(i, 1); 
        }
      }
    }
    // Return the sorted array of cards, now grouped by category.
    return assessmentCardsOnTable; 
  }