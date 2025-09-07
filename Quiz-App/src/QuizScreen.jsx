import { useMemo } from "react";
import { decodeHTML } from "./decodeHTML.js";
import { useNavigate } from "react-router-dom";

export default function QuizScreen({
  questions,
  setQuizStart,
  setQuestionNumber,
  setDifficulty,
  setType,
  questionCurrentIndex,
  setQuestionCurrentIndex,
  currentOption,
  setCurrentOption,
  setUserAnswers,
  status,
}) {
  let optionsArray = [];

  if (status === "loading") return <p>Loading...</p>;

  const navigate = useNavigate();

  if (status === "error" || !questions)
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setQuestionNumber(10);
            setDifficulty("any");
            setType("any");

            navigate(-1);
          }}
        >
          Back
        </button>
        <p>Quiz Not Found</p>
      </>
    );

  optionsArray = useMemo(() => {
    const arr = [
      questions[questionCurrentIndex]["correct_answer"],
      ...questions[questionCurrentIndex]["incorrect_answers"],
    ];
    return arr.sort(() => Math.random() - 0.5);
  }, [questionCurrentIndex]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        setQuizStart(false);
        setUserAnswers((prev) => ({
          ...prev,
          [questionCurrentIndex]: currentOption,
        }));
        setCurrentOption(null);

        navigate("/results", { replace: true });
      }}
    >
      <button
        type="button"
        onClick={() => {
          setQuestionNumber(10);
          setDifficulty("any");
          setType("any");

          navigate(-1);
        }}
      >
        Back
      </button>

      <div>
        <p>{questionCurrentIndex + 1}</p>
        <p>{decodeHTML(questions[questionCurrentIndex].question)}</p>
      </div>

      <div>
        {optionsArray.map((option) => {
          return (
            <button
              type="button"
              key={`${questionCurrentIndex + 1}-${option}`}
              onClick={() => {
                setCurrentOption(decodeHTML(option));
              }}
            >
              {decodeHTML(option)}
            </button>
          );
        })}
      </div>

      <div>
        <button
          type="button"
          onClick={() =>
            questionCurrentIndex > 0 &&
            setQuestionCurrentIndex((prev) => prev - 1)
          }
        >
          Previous
        </button>

        {questionCurrentIndex < questions.length - 1 && (
          <button
            type="button"
            onClick={() => {
              setUserAnswers((prev) => ({
                ...prev,
                [questionCurrentIndex]: currentOption,
              }));
              setQuestionCurrentIndex((prev) => prev + 1);
              setCurrentOption(null);
            }}
          >
            {currentOption ? "Next" : "Skip"}
          </button>
        )}

        {questionCurrentIndex === questions.length - 1 && (
          <button type="submit">Submit</button>
        )}
      </div>
    </form>
  );
}
