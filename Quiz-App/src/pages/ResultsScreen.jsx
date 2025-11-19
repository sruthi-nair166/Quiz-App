import { useNavigate, useParams } from "react-router-dom";
import { decodeHTML } from "../utils/decodeHTML.js";
import { auth, db } from "../firebase.js";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "../styles/ResultsScreen.module.css";
import categories from "../data/categories.js";
import trophy from "../assets/others/trophy.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import titleCaseConverter from "../utils/titleCaseConverter.js";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ResultsScreen({
  questionNumber,
  questions,
  userAnswers,
  difficulty,
  setQuizStart,
  questionCurrentIndex,
  setQuestionCurrentIndex,
  setCurrentOption,
  setUserAnswers,
  quizId,
  setQuizId,
  category,
  setCategory,
  subCategory,
  setSubCategory,
}) {
  let score = 0;
  let skipped = 0;
  let wrong = 0;

  const navigate = useNavigate();
  const { category: categoryParam, subCategory: subCategoryParam } =
    useParams();
  const user = auth.currentUser;
  const totalQuestions = questions.length;
  const categoryKey = subCategory ? subCategory : category;
  const { width, height } = useWindowSize();

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000); // stop after 3s
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (subCategoryParam) setSubCategory(subCategoryParam);
  }, [categoryParam, subCategoryParam]);

  useEffect(() => {
    if (!quizId || questionCurrentIndex !== questions.length - 1) return;

    const alreadySaved = localStorage.getItem(`saved_${quizId}`);
    if (alreadySaved) return;

    const saveQuizResults = async () => {
      try {
        const won = score === totalQuestions ? 1 : 0;
        const attemptsRef = collection(db, "users", user.uid, "quizAttempts");

        await addDoc(attemptsRef, {
          categoryKey,
          ...(difficulty !== "any" && { difficulty }),
          score,
          totalQuestions,
          date: Timestamp.now(),
          won,
        });

        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, {
          totalScore: increment(score),
          totalQuestions: increment(totalQuestions),
          totalQuizzes: increment(1),
          totalWon: increment(won),
          streak: won === 1 ? increment(won) : 0,

          [`categoryStats.${categoryKey}.score`]: increment(score),
          [`categoryStats.${categoryKey}.questions`]: increment(
            questions.length
          ),
          [`categoryStats.${categoryKey}.quizzes`]: increment(1),

          ...(difficulty !== "any" && {
            [`difficultyStats.${difficulty}.score`]: increment(score),
            [`difficultyStats.${difficulty}.questions`]: increment(
              questions.length
            ),
            [`difficultyStats.${difficulty}.quizzes`]: increment(1),
          }),
        });

        localStorage.setItem(`saved_${quizId}`, "true");
        console.log("Quiz results saved successfully");
      } catch (err) {
        console.error("Error saving quiz result:", err);
      }
    };

    saveQuizResults();
  }, []);

  return (
    <>
      <div style={{ height: "3rem" }}>
        <button
          className={`back ${styles["back-positioning"]}`}
          type="button"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
      </div>

      <div className={styles["results-screen-wrapper"]}>
        {showConfetti ? (
          <Confetti width={width} height={height} numberOfPieces={200} />
        ) : null}
        {subCategory ? (
          <h1 className="heading-text">{titleCaseConverter(subCategory)}</h1>
        ) : (
          <h1 className="heading-text">{titleCaseConverter(category)}</h1>
        )}
        <div className={styles["results-card"]}>
          <div style={{ color: "white" }}>
            <p>
              You have scored{" "}
              <span className="text-bold text-medium-2">{score} points</span>
            </p>
            <p>out of {questions.length} questions</p>
          </div>

          <img src={trophy} alt="trophy" style={{ maxWidth: "150px" }} />

          <button
            className={`${styles["check-answers-btn"]} text-medium`}
            onClick={() =>
              navigate(
                `/answers/${encodeURIComponent(category)}/${encodeURIComponent(
                  subCategory
                )}`,
                { state: { score, fromInsideApp: true } }
              )
            }
          >
            Check Correct Answers
          </button>
        </div>
        <div className={styles.stats}>
          <div>
            <p style={{ color: "grey" }} className="uppercase text-small">
              Correct Answer
            </p>
            <p
              className="text-bold text-medium-2"
              style={{ fontSize: "1.1rem" }}
            >
              {score} questions
            </p>
          </div>

          <div>
            <p style={{ color: "grey" }} className="uppercase text-small">
              Completion
            </p>
            <p className="text-bold text-medium-2">
              {Math.round((score / questionNumber) * 100)}%
            </p>
          </div>

          <div>
            <p style={{ color: "grey" }} className="uppercase text-small">
              Skipped
            </p>
            <p className="text-bold text-medium-2">{skipped}</p>
          </div>

          <div>
            <p style={{ color: "grey" }} className="uppercase text-small">
              Incorrect Answer
            </p>
            <p className="text-bold text-medium-2">{wrong}</p>
          </div>
        </div>
        <div className={`${styles["btn-wrapper"]} text-medium`}>
          <button
            className="btn"
            onClick={() => {
              const newQuizId =
                Date.now().toString() + Math.random().toString(36).slice(2);

              setQuizId(newQuizId);
              localStorage.setItem("currentQuizId", newQuizId);
              localStorage.removeItem(`saved_${newQuizId}`);

              setQuizStart(true);
              setQuestionCurrentIndex(0);
              setCurrentOption(null);
              setUserAnswers({});

              const url = subCategory
                ? `/start/${encodeURIComponent(category)}/${encodeURIComponent(
                    subCategory
                  )}/${encodeURIComponent(categories[category][subCategory])}`
                : `/start/${encodeURIComponent(category)}/${encodeURIComponent(
                    categories[category]
                  )}`;

              navigate(url, { state: { from: "retake" } });
            }}
          >
            Retake Quiz
          </button>

          <button className="btn" onClick={() => navigate("/home")}>
            Return to Home
          </button>
        </div>
      </div>
    </>
  );
}
