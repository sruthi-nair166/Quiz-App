import { useNavigate } from "react-router-dom";
import { decodeHTML } from "./decodeHTML.js";

export default function AnswersComparison({ questions, userAnswers }) {
  const navigate = useNavigate();

  return (
    <>
      <p>Questions</p>
      <button onClick={() => navigate(-1)}>close</button>
      {questions.map((q, idx) => {
        return (
          <>
            <p>
              {idx + 1}. {decodeHTML(q.question)}
            </p>
            <span>Your Answer: {userAnswers[idx]}</span>
            <span>Correct Answer: {decodeHTML(q["correct_answer"])}</span>
          </>
        );
      })}
    </>
  );
}
