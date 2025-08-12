import { useNavigate } from "react-router-dom";
import { decodeHTML } from "./decodeHTML.js";

export default function ResultsScreen({
  questions,
  userAnswers,
  setQuizStart,
  setQuestionCurrentIndex,
  setCurrentOption,
  setUserAnswers,
}) {
  let score = 0;

  const navigate = useNavigate();

  localStorage.setItem("quizTakerAnswers", JSON.stringify(userAnswers));

  Object.values(userAnswers).forEach((answer, idx) => {
    if (answer === decodeHTML(questions[idx]["correct_answer"])) {
      score++;
    }
  });

  return (
    <>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h1>Results</h1>
      <p>You have scored {score} points</p>

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
