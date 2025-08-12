import { useState } from "react";
import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigationType,
  useNavigate,
} from "react-router-dom";
import CategoryDisplay from "./CategoryDisplay.jsx";
import SubCategoryDisplay from "./SubCategoryDisplay.jsx";
import StartQuizScreen from "./StartQuizScreen.jsx";
import QuizScreen from "./QuizScreen.jsx";
import ResultsScreen from "./ResultsScreen.jsx";

function App() {
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(10);
  const [difficulty, setDifficulty] = useState("any");
  const [type, setType] = useState("any");
  const [quizStart, setQuizStart] = useState(false);
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem("quizQuestions");
    return saved ? JSON.parse(saved) : null;
  });
  const [questionCurrentIndex, setQuestionCurrentIndex] = useState(0);
  const [currentOption, setCurrentOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem("quizTakerAnswers");
    return saved ? JSON.parse(saved) : {};
  });
  const [status, setStatus] = useState("idle");

  const location = useLocation();
  const action = useNavigationType();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/" && action === "POP") {
      navigate("/", { replace: true });
    }
  }, [action, location, navigate]);

  useEffect(() => {
    if (!quizStart || status !== "loading") return;

    let url = `https://opentdb.com/api.php?amount=${questionNumber}&category=${categoryId}`;
    if (difficulty !== "any") url += `&difficulty=${difficulty}`;
    if (type !== "any") url += `&type=${type}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length === 0) {
          setStatus("error");
          setQuestions(null);
          localStorage.removeItem("quizQuestions");
        } else {
          setQuestions(data.results);
          setStatus("success");

          localStorage.setItem("quizQuestions", JSON.stringify(data.results));
        }
      })
      .catch(() => {
        setStatus("error");
        setQuestions(null);
      });
  }, [quizStart, status]);

  return (
    <>
      <button
        onClick={() => {
          setQuizStart(false);
          setStatus("idle");
          setQuestionNumber(10);
          setDifficulty("any");
          setType("any");
          navigate("/");
        }}
      >
        Home
      </button>

      <Routes>
        <Route
          path="/"
          element={<CategoryDisplay setCategory={setCategory} />}
        />

        <Route
          path="/subcategory/:category"
          element={
            <SubCategoryDisplay
              category={category}
              setCategory={setCategory}
              setSubCategory={setSubCategory}
              setCategoryId={setCategoryId}
            />
          }
        />

        <Route
          path="/start/:category/:subCategory?/:categoryId"
          element={
            <StartQuizScreen
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              setCategoryId={setCategoryId}
              setQuestionNumber={setQuestionNumber}
              setDifficulty={setDifficulty}
              setType={setType}
              setQuizStart={setQuizStart}
              setStatus={setStatus}
              setQuestionCurrentIndex={setQuestionCurrentIndex}
              setCurrentOption={setCurrentOption}
              setUserAnswers={setUserAnswers}
            />
          }
        />

        <Route
          path="/quiz"
          element={
            <QuizScreen
              questions={questions}
              setQuizStart={setQuizStart}
              setQuestionNumber={setQuestionNumber}
              setDifficulty={setDifficulty}
              setType={setType}
              questionCurrentIndex={questionCurrentIndex}
              setQuestionCurrentIndex={setQuestionCurrentIndex}
              currentOption={currentOption}
              setCurrentOption={setCurrentOption}
              setUserAnswers={setUserAnswers}
              status={status}
            />
          }
        />

        <Route
          path="/results"
          element={
            <ResultsScreen
              questions={questions}
              userAnswers={userAnswers}
              setQuizStart={setQuizStart}
              setQuestionCurrentIndex={setQuestionCurrentIndex}
              setCurrentOption={setCurrentOption}
              setUserAnswers={setUserAnswers}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
