// Globals
let timer_counter;
let interval_id;
const timer_display = document.getElementById("timer");
let current_problem_number;
const question_display = document.getElementById("question");
const answer_display = document.getElementById("answers");
const start_button = document.getElementById("start_button");
start_button.addEventListener("click",start_quiz);
answer_display.addEventListener("click", answer_chosen);
let correct_answers;
let incorrect_answers;
const score_display = document.getElementById("score");
let quiz_in_progress = false;

/* Function to test a string for being formatted like a number. 
 * It must contain at least one decimal digit, it can have more
 * than one, and a decimal point is allowed.  */
function is_numeric (text) {
  if (typeof text != "string") {
    return false;
  }
  /* isNAN is false for well-formed numbers, but also for the empty
   * string and for a string containing only blanks.  Therefore we
   * also test that the input can be parsed as a number using
   * parseInt which, unlike Number, will return false if given only
   * spaces.  */
  return (!isNaN(text) && !isNaN(parseInt(text)));
}

/* The problems object is an array of problem objects.
 * The problem object has three properties: the question, the possible
 * answers, and an indication of which answer is correct.
 * The question is text.
 * The possible answers array contains possible answer strings.
 * The correct answer is a number.
 */

/* These are the problems: */

const problem_01 = {
  question: "question 1",
  answers: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_answer: 1
}

const problem_02 = {
  question: "question 2",
  answers: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_answer: 1
}

const problem_03 = {
  question: "question 3",
  answers: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_answer: 1
}

const problem_04 = {
  question: "question 4",
  answers: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_answer: 1
}

const problem_05 = {
  question: "question 5",
  answers: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_answer: 1
}

/* The array of problems.  */
const problems = [
  problem_01, problem_02, problem_03, problem_04, problem_05
  ]

/* Function to start asking questions.  */
function start_quiz () {

  /* Only one quiz at a time.  */
  if (quiz_in_progress) {
    return;
  }
  quiz_in_progress = true;

  /* Start the timer */
  timer_counter = 30;
  interval_id = setInterval(one_second, 1000);
  
  /* Ask the first question.  */
  correct_answers = 0;
  incorrect_answers = 0;
  score_display.textContent = "Correct: 0, incorrect: 0";
  ask_question (0);
}

/* Function to ask a question.  The parameter is the question number.  */
function ask_question (problem_number) {
  current_problem_number = problem_number;
  const current_problem = problems[current_problem_number];
  question_display.textContent = current_problem.question;

  /* Create a new li for each answer.  */
  answer_display.innerHTML = "";
  for (let i = 0; i < current_problem.answers.length; i++) {
    const this_answer = current_problem.answers[i];
    const this_li = document.createElement("li");
    this_li.textContent = this_answer;
    this_li.setAttribute("data-index", i);
    const this_button = document.createElement("button");
    this_button.textContent = "click if correct";
    this_li.appendChild(this_button);
    answer_display.appendChild(this_li);
  }
}

/* Function to count down the timer.  */
function one_second() {
  timer_counter = timer_counter - 1;
  if (timer_counter < 0) {
    timer_counter = 0;
  }
  timer_display.textContent = timer_counter + " seconds left";
  if (timer_counter <= 0) {
    timer_display.textContent = "Time is up, no more answering.";
    /* Allow time for the screen to update.  */
    setTimeout (quiz_completed, 100);
  }
}

/* Function to respond to the choice of an answer.  */
function answer_chosen(event) {
  /* Make sure the user actually clicked a button.  */
  let element = event.target;
  if (element.matches("button")) {
    /* The parent of the button is the li.  The data-index of the li is the number
     * of the answer.  */
    let index = element.parentElement.getAttribute("data-index");
    let current_problem = problems[current_problem_number];
    if (index == current_problem.correct_answer) {
      correct_answers = correct_answers + 1;
    } else {
      incorrect_answers = incorrect_answers + 1;
      timer_counter = timer_counter - 5;
    }
    score_display.textContent = "Correct: " + correct_answers + 
      ", incorrect: " + incorrect_answers + ".";
    if ((current_problem_number + 1) < problems.length) {
      ask_question (current_problem_number + 1);
    } else {
      /* Quiz is completed.  */
      setTimeout(quiz_completed, 100);
    }
  }
}

/* Function to handle the completion of the quiz.  */
function quiz_completed () {
  question_display.textContent = "";
  answer_display.innerHTML = "";
  clearInterval(interval_id);
  timer_display.textContent = "";
  const save_request = confirm("Quiz is over.  Would you like to save your score? " +
    "OK for yes, cancel for no.");
  if (save_request) {
    const these_initials = prompt("Enter your initials to save your score.");

    /* We save scores in local storage as an object.  The object's properties
     * are the initials and the value of each property is an object with two
     * properties: correct_count and incorrect_count.  Each of those properties
     * has an integer value.  */
    const scores_text = localStorage.getItem("Quiz scores");
    let scores = {};
    if (scores_text != null) {
      scores = JSON.parse(scores_text);
    }

    /* If the user has saved his initials before, update the counters.
     * Otherwise, create a new user with the results from this quiz.  */
    if (these_initials in scores) {
      scores[these_initials].correct_count += correct_answers;
      scores[these_initials].incorrect_count += incorrect_answers;
    } else {
      scores[these_initials] = {
        correct_count: correct_answers,
        incorrect_count: incorrect_answers
      }
    }
    localStorage.setItem("Quiz scores", JSON.stringify(scores));

    /* Show the user his accumulated score.  */
    question_display.textContent = "Cumulative score: correct: " +
      scores[these_initials].correct_count + ", incorrect: " +
      scores[these_initials].incorrect_count + ".";
  } /* save scores */
  quiz_in_progress = false;
} /* quiz completed */
