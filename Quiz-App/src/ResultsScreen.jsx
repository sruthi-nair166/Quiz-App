import { useNavigate } from "react-router-dom";
import { decodeHTML } from "./decodeHTML.js";

export default function ResultsScreen({
  questionNumber,
  questions,
  userAnswers,
  setQuizStart,
  setQuestionCurrentIndex,
  setCurrentOption,
  setUserAnswers,
}) {
  let score = 0;
  let skipped = 0;
  let wrong = 0;

  const navigate = useNavigate();

  localStorage.setItem("quizTakerAnswers", JSON.stringify(userAnswers));

  Object.values(userAnswers).forEach((answer, idx) => {
    if (answer === decodeHTML(questions[idx]["correct_answer"])) {
      score++;
    } else if (answer === null) {
      skipped++;
    } else {
      wrong++;
    }
  });

  return (
    <>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h1>Results</h1>
      <p>You have scored {score} points</p>

      <button onClick={() => navigate("/answers")}>
        Check Correct Answers
      </button>

      <p>Correct Answer</p>
      <p>{score} questions</p>

      <p>Completion</p>
      <p>{Math.round((score / questionNumber) * 100)}%</p>

      <p>Skipped</p>
      <p>{skipped}</p>

      <p>Incorrect Answer</p>
      <p>{wrong}</p>

      <button
        onClick={() => {
          setQuizStart(true);
          setQuestionCurrentIndex(0);
          setCurrentOption(null);
          setUserAnswers({});

          navigate("/quiz");
        }}
      >
        Retake Quiz
      </button>
    </>
  );
}
