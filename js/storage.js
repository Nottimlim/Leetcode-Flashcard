// storage.js
import { LeetCodeFlashcard } from './flashcard.js';

export const saveFlashcards = (flashcards) => {
    localStorage.setItem('leetcodeFlashcards', JSON.stringify(flashcards));
  };
  
  export const loadFlashcards = () => {
    const storedFlashcards = localStorage.getItem('leetcodeFlashcards');
    return storedFlashcards ? JSON.parse(storedFlashcards).map(card => 
      new LeetCodeFlashcard(card.question, card.solution, card.notes, card.difficulty, card.topic)
    ) : [];
  };
  
  export const saveStats = (stats) => {
    localStorage.setItem('flashcardStats', JSON.stringify(stats));
  };
  
  export const loadStats = () => {
    const savedStats = localStorage.getItem('flashcardStats');
    return savedStats ? JSON.parse(savedStats) : { totalReviews: 0, correctAnswers: 0 };
  };
