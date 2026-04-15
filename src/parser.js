export const parseMarkdown = (markdown) => {
  const cards = [];
  const lines = markdown.split('\n');
  
  let currentCard = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Ignore empty lines and headings
    if (line.trim() === '' || line.startsWith('#')) {
      continue;
    }

    // Top-level bullet point -> New Card
    if (line.startsWith('- ')) {
      if (currentCard) {
        cards.push(currentCard);
      }
      currentCard = {
        term: line.substring(2).trim(),
        definition: []
      };
    } 
    // Indented bullet point -> Add to definition
    else if (currentCard && line.trim().startsWith('-')) {
      // Keep indentation for structural meaning, but simplify
      currentCard.definition.push(line.replace(/^\s*- /, '- '));
    } else if (currentCard && line.trim() !== '') {
      // Just some text
      currentCard.definition.push(line.trim());
    }
  }

  if (currentCard) {
    cards.push(currentCard);
  }

  // Filter out cards with empty terms or no definitions
  return cards.filter(card => card.term && card.definition.length > 0)
              .map(card => ({
                ...card,
                definition: card.definition.join('\n')
              }));
};
