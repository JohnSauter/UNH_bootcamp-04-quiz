// Assignment Code
const startBtn = document.querySelector("#start");

// Write the question to the #question display area
function write_question(text) {
  const passwordText = document.querySelector("#question");
  passwordText.value = text;
}

// Add event listener to start button
startBtn.addEventListener("click", start_quiz);

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
   * parseFloat which, unlike Number, will fail if given only
   * spaces.  */
  return (!isNaN(text) && !isNaN(parseFloat(text)));
}

/* The problems object is an array of problems.
 * The problem object has three properties: the question, the possible
 * responses, and an indication of which response is correct.
 * The question is text.
 * The possible responses array contains possible response strings.
 * The correct response is a number.
 */



const problem_01 = {
  question: "question 1",
  responses: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_response: 1
}

const problem_02 = {
  question: "question 2",
  responses: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_response: 1
}

const problem_03 = {
  question: "question 3",
  responses: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_response: 1
}

const problem_04 = {
  question: "question 4",
  responses: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_response: 1
}

const problem_05 = {
  question: "question 5",
  responses: ["answer 1", "answer 2", "answer 3", "answer 4", "answer 5"],
  correct_response: 1
}

const problems = [
  problem_01, problem_02, problem_03, problem_04, problem_05
  ]
function start_quiz () {
    write_question("foo");
}