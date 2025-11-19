import {
  useNavigate,
  useNavigationType,
  useParams,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import styles from "../styles/StartQuizScreen.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Portal, Select, createListCollection } from "@chakra-ui/react";

export default function StartQuizScreen({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  setCategoryId,
  setQuestionNumber,
  difficulty,
  setDifficulty,
  type,
  setType,
  setQuizStart,
  setStatus,
  setQuestionCurrentIndex,
  setCurrentOption,
  setUserAnswers,
  setQuizId,
}) {
  const navigate = useNavigate();
  const action = useNavigationType();
  const location = useLocation();
  const cameFromRetake = location.state?.from === "retake";
  const {
    category: categoryParam,
    subCategory: subCategoryParam,
    categoryId: categoryIdParam,
  } = useParams();

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (subCategoryParam) setSubCategory(subCategoryParam);
    if (categoryIdParam) setCategoryId(categoryIdParam);
  }, [categoryParam, subCategoryParam, categoryIdParam]);

  const handleSubmit = (e) => {
    const newQuizId =
      Date.now().toString() + Math.random().toString(36).slice(2);

    setQuizId(newQuizId);
    localStorage.setItem("currentQuizId", newQuizId);

    e.preventDefault();
    setQuizStart(true);
    setStatus("loading");
    setQuestionCurrentIndex(0);
    setCurrentOption(null);
    setUserAnswers({});

    navigate("/quiz", { state: { fromInsideApp: true } });
  };

  useEffect(() => {
    if (action === "POP") {
      setQuestionNumber(10);
      setDifficulty("any");
      setType("any");
    }
  }, [action]);

  const framework1 = createListCollection({
    items: [
      { label: "Any", value: "any" },
      { label: "Easy", value: "easy" },
      { label: "Medium", value: "medium" },
      { label: "Hard", value: "hard" },
    ],
  });

  const framework2 = createListCollection({
    items: [
      { label: "Any", value: "any" },
      { label: "Multiple Choice", value: "multiple" },
      { label: "True/false", value: "boolean" },
    ],
  });

  return (
    <>
      <button
        className={`${styles["back-positioning"]} back`}
        onClick={() => {
          if (cameFromRetake) {
            navigate("/home");
          } else {
            navigate(-1);
          }
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      <div className={styles["start-quiz-wrapper"]}>
        <div>
          {subCategory ? (
            <>
              <h1
                style={{ color: "var(--dark-purple)" }}
                className={styles["quiz-title"]}
              >
                {subCategory || ""}
              </h1>
              <p
                className="uppercase text-medium"
                style={{ textAlign: "center", color: "var(--hover-purple)" }}
              >
                quiz
              </p>
            </>
          ) : (
            <>
              <h1
                style={{ color: "var(--dark-purple)" }}
                className={styles["quiz-title"]}
              >
                {category || ""}
              </h1>
              <p
                className="uppercase text-medium"
                style={{ textAlign: "center", color: "var(--hover-purple)" }}
              >
                quiz
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["select-wrapper"]}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div>
                <label className={styles["quiz-select"]} htmlFor="no-of-q">
                  No. of Questions:{" "}
                </label>
                <input
                  className={styles["quiz-select"]}
                  style={{ color: "var(--dark-purple)", height: "20px" }}
                  type="number"
                  defaultValue={10}
                  min={10}
                  max={50}
                  id="no-of-q"
                  onChange={(e) => setQuestionNumber(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span className={styles["quiz-select"]} htmlFor="type">
                  Difficulty:{" "}
                </span>

                <Select.Root
                  collection={framework1}
                  value={[difficulty]}
                  onValueChange={(e) => setDifficulty(e.value[0])}
                  borderColor="var(--dark-purple)"
                >
                  <Select.HiddenSelect />

                  <Select.Control>
                    <Select.Trigger
                      color="var(--dark-purple)"
                      border="1px solid"
                      borderColor="var(--dark-purple)"
                      borderRadius="md"
                      size="sm"
                      width="80px"
                      px={1}
                      className={styles["select-height"]}
                    >
                      <Select.ValueText placeholder="Any" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator color="var(--dark-purple)" />
                    </Select.IndicatorGroup>
                  </Select.Control>

                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {framework1.items.map((framework) => (
                          <Select.Item item={framework} key={framework.value}>
                            {framework.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <span className={styles["quiz-select"]} htmlFor="type">
                Type:{" "}
              </span>

              <Select.Root
                collection={framework2}
                value={[type]}
                onValueChange={(e) => setType(e.value[0])}
                borderColor="var(--dark-purple)"
              >
                <Select.HiddenSelect />

                <Select.Control>
                  <Select.Trigger
                    color="var(--dark-purple)"
                    border="1px solid"
                    borderColor="var(--dark-purple)"
                    borderRadius="md"
                    size="sm"
                    width="140px"
                    px={1}
                    className={styles["select-height"]}
                  >
                    <Select.ValueText placeholder="Any" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator color="var(--dark-purple)" />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {framework2.items.map((framework) => (
                        <Select.Item item={framework} key={framework.value}>
                          {framework.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </div>
          </div>

          <div className={styles["submit-wrapper"]}>
            <button
              className={`${styles.submit} uppercase text-bold`}
              type="submit"
            >
              Start Quiz
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
