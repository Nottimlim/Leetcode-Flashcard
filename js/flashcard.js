// flashcard.js
export class LeetCodeFlashcard {
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
      this.reviewInterval = performance === 'good' ? this.reviewInterval * 2 : 1;
      this.nextReview = new Date(now.getTime() + this.reviewInterval * 24 * 60 * 60 * 1000);
    }
  }