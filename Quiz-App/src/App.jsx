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
import AnswersComparison from "./AnswersComparison.jsx";
import AuthPage from "./AuthPage.jsx";
import ProfileSetup from "./ProfileSetup.jsx";
import HomeScreen from "./HomeScreen.jsx";
import Settings from "./Settings.jsx";
import SettingsUpdate from "./SettingsUpdate.jsx";

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
  const [msg, setMsg] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const action = useNavigationType();
  const navigate = useNavigate();

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
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/:mode"
          element={
            <AuthPage msg={msg} setMsg={setMsg} setLoggedIn={setLoggedIn} />
          }
        />

        <Route
          path="/profile-setup/:mode"
          element={
            <ProfileSetup
              avatar={avatar}
              setAvatar={setAvatar}
              username={username}
              setUsername={setUsername}
              setLoggedIn={setLoggedIn}
              msg={msg}
              setMsg={setMsg}
            />
          }
        />

        <Route
          path="/settings"
          element={
            <Settings
              username={username}
              setUsername={setUsername}
              setAvatar={setAvatar}
              avatar={avatar}
              setLoggedIn={setLoggedIn}
              msg={msg}
              setMsg={setMsg}
            />
          }
        />

        <Route
          path="/update-settings/:mode/:step"
          element={<SettingsUpdate msg={msg} setMsg={setMsg} />}
        />

        <Route
          path="/home"
          element={
            <HomeScreen
              setCategory={setCategory}
              setQuizStart={setQuizStart}
              setStatus={setStatus}
              setQuestionNumber={setQuestionNumber}
              setDifficulty={setDifficulty}
              setType={setType}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              username={username}
              setUsername={setUsername}
              avatar={avatar}
              setAvatar={setAvatar}
              open={open}
              setOpen={setOpen}
            />
          }
        />

        <Route
          path="/category"
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
              questionNumber={questionNumber}
              questions={questions}
              userAnswers={userAnswers}
              setQuizStart={setQuizStart}
              setQuestionCurrentIndex={setQuestionCurrentIndex}
              setCurrentOption={setCurrentOption}
              setUserAnswers={setUserAnswers}
            />
          }
        />

        <Route
          path="/answers"
          element={
            <AnswersComparison
              questions={questions}
              userAnswers={userAnswers}
            />
          }
        />

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;
