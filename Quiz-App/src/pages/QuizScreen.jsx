import { useEffect } from "react";
import { decodeHTML } from "../utils/decodeHTML.js";
import { useNavigate, useParams } from "react-router-dom";

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
  category,
  setCategory,
  subCategory,
  setSubCategory,
}) {
  if (status === "loading") return <p>Loading...</p>;

  const navigate = useNavigate();
  const { category: categoryParam, subCategory: subCategoryParam } =
    useParams();
  const optionsArray = questions[questionCurrentIndex].shuffled_options;

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (subCategoryParam) setSubCategory(subCategoryParam);
  }, [categoryParam, subCategoryParam]);

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

        navigate(
          `/results/${encodeURIComponent(category)}/${encodeURIComponent(
            subCategory
          )}`,
          {
            replace: true,
            state: { fromInsideApp: true },
          }
        );
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
