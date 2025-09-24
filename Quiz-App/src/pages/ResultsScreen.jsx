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

export default function ResultsScreen({
  questionNumber,
  questions,
  userAnswers,
  difficulty,
  setQuizStart,
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
  const [openDialog, setOpenDialog] = useState("close");

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
    if (score === questions.length) setOpenDialog("open");
  }, [score]);

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (subCategoryParam) setSubCategory(subCategoryParam);
  }, [categoryParam, subCategoryParam]);

  useEffect(() => {
    if (!quizId) return;

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
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      {openDialog === "open" && (
        <>
          <button onClick={() => setOpenDialog("close")}>close</button>
          <p>Congratulations!</p>
          <p>You have answered all questions correctly!</p>
        </>
      )}

      <h1>Results</h1>
      <p>You have scored {score} points</p>

      <button
        onClick={() => navigate("/answers", { state: { fromInsideApp: true } })}
      >
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
          const newQuizId =
            Date.now().toString() + Math.random().toString(36).slice(2);

          setQuizId(newQuizId);
          localStorage.setItem("currentQuizId", newQuizId);

          setQuizStart(true);
          setQuestionCurrentIndex(0);
          setCurrentOption(null);
          setUserAnswers({});

          navigate("/quiz", { state: { fromInsideApp: true } });
        }}
      >
        Retake Quiz
      </button>
    </>
  );
}
