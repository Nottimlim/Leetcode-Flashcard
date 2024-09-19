import { LeetCodeFlashcard } from './flashcard.js';
import { DIFFICULTIES, TOPICS } from './constants.js';
import { saveFlashcards, loadFlashcards, saveStats, loadStats } from './storage.js';
import { showNotification, updateFlashcardList, displayFlashcard } from './ui.js';

class FlashcardApp {
  constructor() {
    this.flashcards = [];
    this.stats = { totalReviews: 0, correctAnswers: 0 };
    this.currentQuizCard = null;

    // DOM Elements
    this.questionInput = document.getElementById('question-input');
    this.solutionInput = document.getElementById('solution-input');
    this.notesInput = document.getElementById('notes-input');
    this.difficultySelect = document.getElementById('difficulty-select');
    this.topicInput = document.getElementById('topic-input');
    this.addButton = document.getElementById('add-button');
    this.flashcardList = document.getElementById('flashcard-list');
    this.searchInput = document.getElementById('search-input');
    this.searchButton = document.getElementById('search-button');
    this.quizButton = document.getElementById('quiz-button');

    this.initializeApp();
  }

  initializeApp() {
    this.initializeDifficultySelect();
    this.initializeTopicSelect();
    this.loadFlashcards();
    this.loadStats();
    this.updateFlashcardList();
    this.addEventListeners();
  }

  initializeDifficultySelect() {
    DIFFICULTIES.forEach(level => {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = level;
      this.difficultySelect.appendChild(option);
    });
  }

  initializeTopicSelect() {
    const topicSelect = document.getElementById('topic-select') || 
                        document.querySelector('select[onchange="app.filterFlashcards(\'topic\', this.value)"]');
    
    if (topicSelect) {
      TOPICS.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelect.appendChild(option);
      });
    } else {
      console.error('Topic select element not found. Please ensure it exists in your HTML.');
    }
  }
  
  loadFlashcards() {
    this.flashcards = loadFlashcards();
  }

  loadStats() {
    this.stats = loadStats();
    this.displayStats();
  }

  addEventListeners() {
    this.addButton.addEventListener('click', () => this.addFlashcard());
    this.searchInput.addEventListener('input', () => this.searchFlashcards());
    this.searchButton.addEventListener('click', () => this.searchFlashcards());
    this.quizButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.startQuizMode();
    });
    document.getElementById('reset-progress').addEventListener('click', () => this.resetProgress());
    document.getElementById('show-answer').addEventListener('click', () => this.showQuizAnswer());
    document.getElementById('correct-answer').addEventListener('click', () => this.endQuiz(true));
    document.getElementById('wrong-answer').addEventListener('click', () => this.endQuiz(false));
  }

  addFlashcard() {
    const question = this.questionInput.value.trim();
    const solution = this.solutionInput.value.trim();
    const notes = this.notesInput.value.trim();
    const difficulty = this.difficultySelect.value;
    const topic = this.topicInput.value.trim();

    if (question && solution && difficulty && topic) {
      const newFlashcard = new LeetCodeFlashcard(question, solution, notes, difficulty, topic);
      this.flashcards.push(newFlashcard);
      this.updateFlashcardList();
      this.clearInputFields();
      saveFlashcards(this.flashcards);
      showNotification('Flashcard added successfully!');
    } else {
      showNotification('Please fill in all required fields.', 'error');
    }
  }

  clearInputFields() {
    this.questionInput.value = '';
    this.solutionInput.value = '';
    this.notesInput.value = '';
    this.difficultySelect.selectedIndex = 0;
    this.topicInput.value = '';
  }

  searchFlashcards() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const filteredFlashcards = this.flashcards.filter(flashcard =>
      flashcard.question.toLowerCase().includes(searchTerm) ||
      flashcard.solution.toLowerCase().includes(searchTerm) ||
      flashcard.notes.toLowerCase().includes(searchTerm)
    );
    this.updateFlashcardList(filteredFlashcards);
  }

  updateFlashcardList(cardsToDisplay = this.flashcards) {
    updateFlashcardList(cardsToDisplay, this.flashcardList);
  }

  startQuizMode() {
    if (this.flashcards.length === 0) {
      showNotification('No flashcards available for quiz.', 'error');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * this.flashcards.length);
    this.currentQuizCard = this.flashcards[randomIndex];
    
    document.getElementById('quiz-question').textContent = this.currentQuizCard.question;
    document.getElementById('quiz-solution').textContent = this.currentQuizCard.solution;
    document.getElementById('quiz-answer').style.display = 'none';
    document.getElementById('show-answer').style.display = 'block';
    document.getElementById('quiz-modal').classList.add('show');
  }

  showQuizAnswer() {
    document.getElementById('quiz-answer').style.display = 'block';
    document.getElementById('show-answer').style.display = 'none';
  }

  endQuiz(gotCorrect) {
    this.updateStats(gotCorrect);
    this.currentQuizCard.updateReviewDate(gotCorrect ? 'good' : 'bad');
    document.getElementById('quiz-modal').classList.remove('show');
    saveFlashcards(this.flashcards);
  }

  updateStats(isCorrect) {
    this.stats.totalReviews++;
    if (isCorrect) this.stats.correctAnswers++;
    saveStats(this.stats);
    this.displayStats();
  }

  displayStats() {
    const accuracy = (this.stats.correctAnswers / this.stats.totalReviews * 100).toFixed(2) || 0;
    document.getElementById('stats').innerHTML = `
      Total Reviews: ${this.stats.totalReviews}<br>
      Accuracy: ${accuracy}%
    `;
  }

  sortFlashcards(criteria) {
    this.flashcards.sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
    this.updateFlashcardList();
  }

  resetProgress() {
    if (confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
      localStorage.removeItem('leetcodeFlashcards');
      localStorage.removeItem('flashcardStats');
      this.flashcards = [];
      this.stats = { totalReviews: 0, correctAnswers: 0 };
      this.updateFlashcardList();
      this.displayStats();
      showNotification('Progress has been reset successfully.');
    }
  }

  filterFlashcards(criteria, value) {
    const filteredCards = value ? this.flashcards.filter(card => card[criteria] === value) : this.flashcards;
    this.updateFlashcardList(filteredCards);
  }
}

const app = new FlashcardApp();