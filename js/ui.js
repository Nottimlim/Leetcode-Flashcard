export const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };
  
  export const updateFlashcardList = (flashcards, flashcardList) => {
    flashcardList.innerHTML = '';
    flashcards.forEach((flashcard, index) => {
      const li = document.createElement('li');
      li.textContent = `${flashcard.question} (${flashcard.difficulty}, ${flashcard.topic})`;
      li.addEventListener('click', () => displayFlashcard(index, flashcards));
      flashcardList.appendChild(li);
    });
  };
  
  export const displayFlashcard = (index, flashcards) => {
    // Implementation of displayFlashcard function
    // ...
  };