import React, { useState, useEffect } from 'react';
import { getDecks } from './data';
import { ArrowLeft, ArrowRight, Shuffle, Undo2, Check, X } from 'lucide-react';
import './index.css';

function App() {
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Load decks on mount
    setDecks(getDecks());
  }, []);

  const selectDeck = (deck) => {
    setActiveDeck(deck);
    setCards([...deck.cards]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const goBack = () => {
    setActiveDeck(null);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 150); // slight delay for smooth transition
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev - 1), 150);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeDeck) return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault(); // prevent scrolling
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        prevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeck, currentCardIndex, isFlipped, cards]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-indigo-500/30">
      <header className="py-6 px-8 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2" onClick={goBack} style={{cursor: 'pointer'}}>
            ⚡ FlashBrain
          </h1>
          {activeDeck && (
            <button 
              onClick={goBack}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Undo2 size={16} /> Decks
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 py-12">
        {!activeDeck ? (
          <div className="animate-fade-in">
            <div className="mb-10 text-center space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight">Study Decks</h2>
              <p className="text-neutral-400 text-lg">Select a file to begin studying.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.length === 0 ? (
                <div className="col-span-full py-20 text-center text-neutral-500 border border-dashed border-neutral-700 rounded-2xl bg-neutral-800/20">
                  <p className="text-xl">No markdown files found.</p>
                  <p className="mt-2 text-sm">Add some .md files to the project root folder!</p>
                </div>
              ) : (
                decks.map((deck) => (
                  <div 
                    key={deck.id} 
                    onClick={() => selectDeck(deck)}
                    className="group relative bg-neutral-800/50 border border-neutral-700 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-indigo-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">{deck.title}</h3>
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                       <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                       {deck.cards.length} cards
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto animate-fade-in flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6 text-sm text-neutral-400 font-medium">
              <span>{activeDeck.title}</span>
              <div className="flex items-center gap-4">
                <span className="bg-neutral-800 px-3 py-1 rounded-full">
                  {currentCardIndex + 1} / {cards.length}
                </span>
                <button 
                  onClick={shuffleCards}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1"
                  title="Shuffle cards"
                >
                  <Shuffle size={16} /> Shuffle
                </button>
              </div>
            </div>

            {/* Flashcard Container */}
            <div 
              className="w-full aspect-[4/3] sm:aspect-[3/2] perspective-[1000px] mb-8 cursor-pointer"
              onClick={handleFlip}
            >
              <div 
                className={`relative w-full h-full duration-500 preserve-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-neutral-800 to-neutral-800/80 rounded-3xl border border-neutral-700/50 shadow-2xl flex items-center justify-center p-8 sm:p-12 text-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <h2 className="text-2xl sm:text-4xl font-bold leading-tight balance-text text-white">
                    {cards[currentCardIndex]?.term}
                  </h2>
                  <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-neutral-500 font-medium tracking-widest uppercase">
                    Click or press space to flip
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-3xl border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] flex items-center justify-center py-10 px-8 sm:px-16 text-center text-lg sm:text-xl overflow-y-auto custom-scrollbar rotate-y-180"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="max-h-full w-full flex items-center justify-center">
                    <div className="w-full space-y-3 text-indigo-50/90 whitespace-pre-wrap leading-relaxed">
                      {cards[currentCardIndex]?.definition}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <button 
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="w-24 text-center text-sm font-bold text-neutral-500">
                {Math.round(((currentCardIndex + 1) / cards.length) * 100)}%
              </div>

              <button 
                onClick={nextCard}
                disabled={currentCardIndex === cards.length - 1}
                className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
