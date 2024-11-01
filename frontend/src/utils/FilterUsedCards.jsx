// utility function to filter out used cards
export function filterOutUsedCards(allCards, usedCards) {
    const usedCardIds = new Set(usedCards.map(card => card._id));
    return allCards.filter(card => !usedCardIds.has(card._id));
  }
  