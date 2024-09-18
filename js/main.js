// Constants
const Difficulties = ['Easy', 'Medium', 'Hard'];
const Topics = ['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Sorting', 'Searching', 'Recursion', 'Math'];

// Variables
let flashcards = [];

// DOM Elements
const questionInput = document.getElementById('question-input');
const solutionInput = document.getElementById('solution-input');
const notesInput = document.getElementById('notes-input');
const difficultySelect = document.getElementById('difficulty-select');
const topicInput = document.getElementById('topic-input');
const addButton = document.getElementById('add-button');
const flashcardList = document.getElementById('flashcard-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const quizButton = document.getElementById('quiz-button');

// LeetCode Flashcard Class
class LeetCodeFlashcard {
    constructor(question, solution, notes, difficulty, topic) {
        this.question = question;
        this.solution = solution;
        this.notes = notes;
        this.difficulty = difficulty;
        this.topic = topic;
        this.lastReviewed = new Date();
        this.nextReview = new Date();
        this.reviewInterval = 1; // in days
    }
    updateReviewDate(performance) {
        const now = new Date();
        this.lastReviewed = now;
        if (performance === 'good') {
            this.reviewInterval *= 2;
        } else {
            this.reviewInterval = 1;
        }
        this.nextReview = new Date(now.getTime() + this.reviewInterval * 24 * 60 * 60 * 1000);
    }
}

// Functions
function addFlashcard() {
    const question = questionInput.value.trim();
    const solution = solutionInput.value.trim();
    const notes = notesInput.value.trim();
    const difficulty = difficultySelect.value;
    const topic = topicInput.value.trim();

    if (question && solution && difficulty && topic) {
        const newFlashcard = new LeetCodeFlashcard(question, solution, notes, difficulty, topic);
        flashcards.push(newFlashcard);
        updateFlashcardList();
        clearInputFields();
        saveFlashcards();
        showNotification('Flashcard added successfully!');
    } else {
        showNotification('Please fill in all required fields.', 'error');
    }
}

function updateFlashcardList(cardsToDisplay = flashcards) {
    flashcardList.innerHTML = '';
    cardsToDisplay.forEach((flashcard, index) => {
        const li = document.createElement('li');
        li.textContent = `${flashcard.question} (${flashcard.difficulty}, ${flashcard.topic})`;
        li.addEventListener('click', () => displayFlashcard(index));
        flashcardList.appendChild(li);
    });
}

function displayFlashcard(index) {
    const flashcard = flashcards[index];
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-button">&times;</button>
            <h2>Flashcard Details</h2>
            <p><strong>Question:</strong> ${flashcard.question}</p>
            <p><strong>Solution:</strong> ${flashcard.solution}</p>
            <p><strong>Notes:</strong> ${flashcard.notes}</p>
            <p><strong>Difficulty:</strong> ${flashcard.difficulty}</p>
            <p><strong>Topic:</strong> ${flashcard.topic}</p>
            <button class="btn btn-secondary edit-button">Edit</button>
            <button class="btn btn-primary delete-button">Delete</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.edit-button').addEventListener('click', () => editFlashcard(index, modal));
    modal.querySelector('.delete-button').addEventListener('click', () => deleteFlashcard(index, modal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

function editFlashcard(index, modal) {
    const flashcard = flashcards[index];
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-button">&times;</button>
            <h2>Edit Flashcard</h2>
            <input type="text" id="edit-question" value="${flashcard.question}">
            <textarea id="edit-solution">${flashcard.solution}</textarea>
            <textarea id="edit-notes">${flashcard.notes}</textarea>
            <select id="edit-difficulty">
                ${Difficulties.map(level => `<option value="${level}" ${level === flashcard.difficulty ? 'selected' : ''}>${level}</option>`).join('')}
            </select>
            <input type="text" id="edit-topic" value="${flashcard.topic}">
            <button class="btn btn-primary save-button">Save Changes</button>
        </div>
    `;

    modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.save-button').addEventListener('click', () => saveEditedFlashcard(index, modal));
}

function saveEditedFlashcard(index, modal) {
    const flashcard = flashcards[index];
    flashcard.question = document.getElementById('edit-question').value;
    flashcard.solution = document.getElementById('edit-solution').value;
    flashcard.notes = document.getElementById('edit-notes').value;
    flashcard.difficulty = document.getElementById('edit-difficulty').value;
    flashcard.topic = document.getElementById('edit-topic').value;

    saveFlashcards();
    updateFlashcardList();
    closeModal(modal);
    showNotification('Flashcard updated successfully!');
}

function deleteFlashcard(index, modal) {
    if (confirm('Are you sure you want to delete this flashcard?')) {
        flashcards.splice(index, 1);
        saveFlashcards();
        updateFlashcardList();
        closeModal(modal);
        showNotification('Flashcard deleted successfully!');
    }
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

function clearInputFields() {
    questionInput.value = '';
    solutionInput.value = '';
    notesInput.value = '';
    difficultySelect.selectedIndex = 0;
    topicInput.value = '';
}

function initializeDifficultySelect() {
    Difficulties.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        difficultySelect.appendChild(option);
    });
}

function initializeTopicSelect() {
    const topicSelect = document.querySelector('select[onchange="filterFlashcards(\'topic\', this.value)"]');
    Topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelect.appendChild(option);
    });
}

function searchFlashcards() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredFlashcards = flashcards.filter(flashcard =>
        flashcard.question.toLowerCase().includes(searchTerm) ||
        flashcard.solution.toLowerCase().includes(searchTerm) ||
        flashcard.notes.toLowerCase().includes(searchTerm)
    );
    updateFlashcardList(filteredFlashcards);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function loadFlashcards() {
    const storedFlashcards = localStorage.getItem('leetcodeFlashcards');
    if (storedFlashcards) {
        flashcards = JSON.parse(storedFlashcards).map(card => 
            new LeetCodeFlashcard(card.question, card.solution, card.notes, card.difficulty, card.topic)
        );
        updateFlashcardList();
    }
}

function saveFlashcards() {
    localStorage.setItem('leetcodeFlashcards', JSON.stringify(flashcards));
}

function startQuizMode() {
    if (flashcards.length === 0) {
        showNotification('No flashcards available for quiz.', 'error');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    const flashcard = flashcards[randomIndex];
    
    document.getElementById('quiz-question').textContent = flashcard.question;
    document.getElementById('quiz-solution').textContent = flashcard.solution;
    document.getElementById('quiz-answer').style.display = 'none';
    document.getElementById('show-answer').style.display = 'block';
    document.getElementById('quiz-modal').classList.add('show');
}

function showQuizAnswer() {
    document.getElementById('quiz-answer').style.display = 'block';
    document.getElementById('show-answer').style.display = 'none';
}

function endQuiz(gotCorrect) {
    updateStats(gotCorrect);
    currentQuizCard.updateReviewDate(gotCorrect ? 'good' : 'bad');
    document.getElementById('quiz-modal').classList.remove('show');
    saveFlashcards();
}

let stats = {
    totalReviews: 0,
    correctAnswers: 0
};

function updateStats(isCorrect) {
    stats.totalReviews++;
    if (isCorrect) stats.correctAnswers++;
    localStorage.setItem('flashcardStats', JSON.stringify(stats));
    displayStats();
}

function displayStats() {
    const accuracy = (stats.correctAnswers / stats.totalReviews * 100).toFixed(2) || 0;
    document.getElementById('stats').innerHTML = `
        Total Reviews: ${stats.totalReviews}<br>
        Accuracy: ${accuracy}%
    `;
}

function loadStats() {
    const savedStats = localStorage.getItem('flashcardStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
        displayStats();
    }
}

function sortFlashcards(criteria) {
    flashcards.sort((a, b) => {
        if (a[criteria] < b[criteria]) return -1;
        if (a[criteria] > b[criteria]) return 1;
        return 0;
    });
    updateFlashcardList();
}

function resetProgress() {
    if (confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
        // Clear localStorage
        localStorage.removeItem('leetcodeFlashcards');
        localStorage.removeItem('flashcardStats');

        // Reset flashcards array
        flashcards = [];

        // Reset stats
        stats = {
            totalReviews: 0,
            correctAnswers: 0
        };

        // Update UI
        updateFlashcardList();
        displayStats();

        showNotification('Progress has been reset successfully.');
    }
}

function filterFlashcards(criteria, value) {
    const filteredCards = value ? flashcards.filter(card => card[criteria] === value) : flashcards;
    updateFlashcardList(filteredCards);
}

function initializeApp() {
    initializeDifficultySelect();
    initializeTopicSelect();
    loadFlashcards();
    loadStats();
    updateFlashcardList();

    addButton.addEventListener('click', addFlashcard);
    searchInput.addEventListener('input', searchFlashcards);
    searchButton.addEventListener('click', searchFlashcards);
    document.getElementById('quiz-button').addEventListener('click', function(e) {
        e.preventDefault()
        startQuizMode();
    });
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    document.getElementById('show-answer').addEventListener('click', showQuizAnswer);
    document.getElementById('correct-answer').addEventListener('click', () => endQuiz(true));
    document.getElementById('wrong-answer').addEventListener('click', () => endQuiz(false));
}

document.addEventListener('DOMContentLoaded', initializeApp);
