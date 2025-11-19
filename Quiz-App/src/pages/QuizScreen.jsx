import { useEffect } from "react";
import { decodeHTML } from "../utils/decodeHTML.js";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/QuizScreen.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { EmptyState, VStack, Center, Spinner } from "@chakra-ui/react";

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
  if (status === "loading")
    return (
      <Center height="100vh">
        <Spinner
          className={styles["spinner-color"]}
          size="xl"
          animationDuration="0.8s"
          borderWidth="6px"
        />
      </Center>
    );

  const navigate = useNavigate();
  const { category: categoryParam, subCategory: subCategoryParam } =
    useParams();
  const optionsArray = questions?.[questionCurrentIndex]?.shuffled_options;

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (subCategoryParam) setSubCategory(subCategoryParam);
  }, [categoryParam, subCategoryParam]);

  if (status === "error" || !questions)
    return (
      <>
        <button
          className={`back ${styles["back-positioning"]}`}
          type="button"
          onClick={() => {
            setQuestionNumber(10);
            setDifficulty("any");
            setType("any");

            navigate(-1);
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <Center height="100vh">
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <img src="logo.png" alt="" width="80px" />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title className={styles.color} fontSize="2rem">
                  Quiz Not Found
                </EmptyState.Title>
                <EmptyState.Description
                  fontSize="1rem"
                  className={styles.color}
                >
                  Try changing the difficulty or quiz type
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </Center>
      </>
    );

  return (
    <>
      <button
        className={`back ${styles["back-positioning"]}`}
        type="button"
        onClick={() => {
          setQuestionNumber(10);
          setDifficulty("any");
          setType("any");

          navigate(-1);
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      <form
        className={styles["quiz-form"]}
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
        <div>
          <p
            className="uppercase text-small"
            style={{ padding: "1rem 0", color: "grey" }}
          >
            Question {questionCurrentIndex + 1} out of {questions.length}
          </p>
          <p className="text-bold">
            {decodeHTML(questions[questionCurrentIndex].question)}
          </p>
        </div>

        <div className={styles["options-container"]}>
          {optionsArray.map((option, index) => {
            const isSelected = decodeHTML(option) === currentOption;
            return (
              <button
                type="button"
                key={option}
                onClick={() => {
                  setCurrentOption(decodeHTML(option));
                }}
                className={`${styles["option-btns"]} ${
                  isSelected ? styles["selected-option"] : ""
                } text-medium`}
              >
                {decodeHTML(option)}
              </button>
            );
          })}
        </div>

        <div className={`${styles["prev-next-btn-wrapper"]} text-medium`}>
          <button
            style={{
              backgroundColor:
                questionCurrentIndex === 0 && "var(--hover-purple)",
              cursor: questionCurrentIndex === 0 && "auto",
            }}
            disabled={questionCurrentIndex === 0}
            className="btn"
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
              className="btn"
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
            <button className="btn" type="submit">
              Submit
            </button>
          )}
        </div>
      </form>
    </>
  );
}
