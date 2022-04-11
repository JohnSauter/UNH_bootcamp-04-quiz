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
let quiz_state = "stopped";
const startup_question = document.getElementById("startup_question");
const question_card = document.getElementById("question_card");
const score_card = document.getElementById("score_card");
const answers_card = document.getElementById("answers_card");
const timer_card = document.getElementById("timer_card");
const save_scores_card = document.getElementById("save_scores_card");
const save_scores_buttons = document.getElementById("save_scores");
save_scores_buttons.addEventListener("click", save_scores_chosen);
const give_initials_card = document.getElementById("give_initials_card");
const give_initials = document.getElementById("give_initials");
give_initials.addEventListener("submit", initials_submitted);
const initials_field = document.getElementById("initials");
const cumulative_score_card = document.getElementById("cumulative_score_card");
const cumulative_score_display = document.getElementById("cumulative_score");
let quiz_ended_by_timer;

/* The problems object is an array of problem objects.
 * The problem object has three properties: the question, the possible
 * answers, and an indication of which answer is correct.
 * The question is text.
 * The possible answers array contains possible answer strings.
 * The correct answer is a number.
 */

/* These are the problems: */

const problem_01 = {
  question: "<p>What is the correct JavaScript syntax to change the content" +
    " of the HTML element below?</p>" +
    '<p>&lt;p id="demo">This is a demonstration&lt;/p></p>',
  answers: ['document.getElementByName("p").innerHTML = "Hello World";',
    'document.getElement("p").innerHTML = "Hello World";',
    '#demo.innerHTML = "Hello World";',
    'document.GetElementById("demo").innerHTML = "Hello World"'],
  correct_answer: 3
}

const problem_02 = {
  question: "<p>How do you write an IF statement in JavaScript?</p>",
  answers: ["if i = 5 then", 
    "if i = 5",
    "if i == 5 then",
    "if (i == 5)"],
  correct_answer: 3
}

const problem_03 = {
  question: "<p>How does a FOR loop start?</p>",
  answers: ["for (i = 0; i<= 5)",
    "for i = 1 to 5",
    "for (i <= 5; i++)",
    "for (i = 0; i <= 5; i++)"],
  correct_answer: 3
}

const problem_04 = {
  question: "<p>How can you add a comment in JavaScript?</p>",
  answers: ["//This is a comment",
    "&lt;!-- This is a comment -->",
    "'This is a comment"],
  correct_answer: 0
}

const problem_05 = {
  question: "<p>How do you write a multi-line comment in JavaScript?</p>",
  answers: ["/* This comment has<br/>more than one line. */",
    "//This comment has<br/>more than one line. //",
    "&lt;!-- This comment has<br/>more than one line. -->"],
   correct_answer: 0
}

/* The array of problems.  */
const problems = [
  problem_01, problem_02, problem_03, problem_04, problem_05
  ]

/* Function to start asking questions.  */
function start_quiz () {

  /* Only one quiz at a time.  */
  if (quiz_state != "stopped") {
    return;
  }
  quiz_state = "running";

  /* Remove the start material from the screen and replace it with the
   * question, the current score, the choice of answers and the countdown
   * timer.  */
  startup_question.style.display = "none";
  question_card.style.display = "block";
  score_card.style.display = "block";
  answers_card.style.display = "block";
  timer_card.style.display = "block";
  cumulative_score_card.style.display = "none";

  /* Start the timer */
  quiz_ended_by_timer = false;
  timer_counter = 30;
  interval_id = setInterval(one_second, 1000);
  
  /* Ask the first question.  */
  correct_answers = 0;
  incorrect_answers = 0;
  score_display.textContent = "Correct: 0, incorrect: 0";
  ask_question (0);
}

/* Function to ask a question.  The parameter is the problem number.  */
function ask_question (problem_number) {
  current_problem_number = problem_number;
  const current_problem = problems[current_problem_number];
  question_display.innerHTML = current_problem.question;

  /* Create a new <li> for each answer.  */
  answer_display.innerHTML = "";
  for (let i = 0; i < current_problem.answers.length; i++) {
    const this_answer = current_problem.answers[i];
    const this_li = document.createElement("li");
    this_li.setAttribute("data-index", i);
    const this_button = document.createElement("button");
    this_button.innerHTML = this_answer;
    this_li.appendChild(this_button);
    answer_display.appendChild(this_li);
  }
}

/* Function to count down the timer.  */
function one_second() {
  if (quiz_state != "running") {
    return;
  }
  timer_counter = timer_counter - 1;
  if (timer_counter < 0) {
    timer_counter = 0;
  }
  timer_display.textContent = timer_counter + " seconds left";
  if (timer_counter <= 0) {
    timer_display.textContent = "Time is up, no more answering.";
    /* Allow time for the screen to update.  */
    quiz_ended_by_timer = true;
    setTimeout (quiz_completed, 100);
  }
}

/* Function to respond to the choice of an answer.  */
function answer_chosen(event) {
  if (quiz_state != "running") {
    return;
  }
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
      /* Giving an incorrect answer takes some time off the clock.  */
      timer_counter = timer_counter - 10;
    }
    score_display.textContent = "Correct: " + correct_answers + 
      ", incorrect: " + incorrect_answers + ".";
    if ((current_problem_number + 1) < problems.length) {
      ask_question (current_problem_number + 1);
    } else {
      /* Quiz is completed.  */
      quiz_ended_by_timer = false;
      setTimeout(quiz_completed, 100);
    }
  }
}

/* Function to handle the completion of the quiz.  */
function quiz_completed () {
  quiz_state = "ending";
  question_display.innerHTML = "";
  question_card.style.display = "none"
  answer_display.innerHTML = "";
  answers_card.style = "none";
  clearInterval(interval_id);
  /* If the quiz was ended by the timer running out, leave the timer
   * on display.  */
  if (!quiz_ended_by_timer) {
    timer_display.textContent = "";
    timer_card.style.display = "none";
  }
  save_scores_card.style.display = "block";
}

/* Function to respond to the user answer to the save scores question.  */
function save_scores_chosen (event) {
  if (quiz_state != "ending") {
    return;
  }
  let element = event.target;
  if (element.matches("button")) {
    /* The id of the button tells which button was pushed.  */
    if (element.id === "save_button_yes") {
      save_scores_card.style.display = "none";
      give_initials_card.style.display = "block";
      initials_field.focus();
    } else {
      restart_quiz();
    }
  }
} /* save_scores_chosen */

/* Function to accept the user's initials and save his score.  */
function initials_submitted (event) {
  event.preventDefault();
  if (quiz_state != "ending") {
    return;
  }
  
  const these_initials = initials_field.value;
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
  cumulative_score_display.textContent = "Cumulative score: correct: " +
    scores[these_initials].correct_count + ", incorrect: " +
    scores[these_initials].incorrect_count + ".";
  cumulative_score_card.style.display = "block";
  
  restart_quiz(); 
} /* initials submitted */

/* Function to restart the quiz.  */
function restart_quiz () {
  startup_question.style.display = "block";
  question_card.style.display = "none";
  score_card.style.display = "none";
  answers_card.style.display = "none";
  timer_card.style.display = "none";
  save_scores_card.style.display = "none";
  give_initials_card.style.display = "none";
  quiz_state = "stopped";
}