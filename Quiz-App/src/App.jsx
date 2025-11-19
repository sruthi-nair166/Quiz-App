import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Center, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";

import MainLayout from "./layouts/MainLayout.jsx";
import CategoryDisplay from "./components/CategoryDisplay.jsx";
import SubCategoryDisplay from "./components/SubCategoryDisplay.jsx";
import StartQuizScreen from "./pages/StartQuizScreen.jsx";
import QuizScreen from "./pages/QuizScreen.jsx";
import ResultsScreen from "./pages/ResultsScreen.jsx";
import AnswersComparison from "./components/AnswersComparison.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import SettingsUpdate from "./pages/SettingsUpdate.jsx";
import Credits from "./pages/Credits.jsx";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
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
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState(() => {
    return localStorage.getItem("currentQuizId") || null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
          const preparedQuestions = data.results.map((q) => ({
            ...q,
            shuffled_options: [q.correct_answer, ...q.incorrect_answers].sort(
              () => Math.random() - 0.5
            ),
          }));
          setQuestions(preparedQuestions);
          setStatus("success");

          localStorage.setItem(
            "quizQuestions",
            JSON.stringify(preparedQuestions)
          );
        }
      })
      .catch(() => {
        setStatus("error");
        setQuestions(null);
      });
  }, [quizStart, status]);

  if (authLoading) {
    return (
      <>
        <Center height="100vh">
          <Spinner
            size="xl"
            color="white"
            animationDuration="0.8s"
            borderWidth="6px"
          />
        </Center>
      </>
    );
  }

  function NoDirectAccess({ children }) {
    const location = useLocation();

    if (!location.state || !location.state.fromInsideApp) {
      return <Navigate to="/home" replace />;
    }
    return children;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        <Route
          path="/auth/:mode"
          element={
            <AuthPage
              msg={msg}
              setMsg={setMsg}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          }
        />

        <Route
          path="/auth/link-account"
          element={
            user ? (
              user.isAnonymous ? (
                <AuthPage
                  mode="link-account"
                  msg={msg}
                  setMsg={setMsg}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                />
              ) : (
                <Navigate to="/home" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {user && (
          <>
            <Route
              path="/profile-setup/:mode"
              element={
                <NoDirectAccess>
                  <ProfileSetup
                    avatar={avatar}
                    setAvatar={setAvatar}
                    username={username}
                    setUsername={setUsername}
                    setLoggedIn={setLoggedIn}
                    msg={msg}
                    setMsg={setMsg}
                  />
                </NoDirectAccess>
              }
            />

            <Route
              path="/profile"
              element={
                <Profile
                  avatar={avatar}
                  setAvatar={setAvatar}
                  username={username}
                  setUsername={setUsername}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                  setCategory={setCategory}
                  setSubCategory={setSubCategory}
                />
              }
            />

            <Route
              path="/settings"
              element={
                !user.isAnonymous ? (
                  <Settings
                    username={username}
                    setUsername={setUsername}
                    setAvatar={setAvatar}
                    avatar={avatar}
                    setLoggedIn={setLoggedIn}
                    msg={msg}
                    setMsg={setMsg}
                  />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            <Route path="/credits" element={<Credits />}></Route>

            <Route
              path="/update-settings/:mode/:step"
              element={
                <NoDirectAccess>
                  <SettingsUpdate msg={msg} setMsg={setMsg} />
                </NoDirectAccess>
              }
            />

            <Route
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MainLayout
                    setQuizStart={setQuizStart}
                    setStatus={setStatus}
                    setQuestionNumber={setQuestionNumber}
                    setDifficulty={setDifficulty}
                    setType={setType}
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    loading={loading}
                    setLoading={setLoading}
                    avatar={avatar}
                    setAvatar={setAvatar}
                  />
                </motion.div>
              }
            >
              <Route
                path="/home"
                element={
                  <HomeScreen
                    category={category}
                    setCategory={setCategory}
                    setSubCategory={setSubCategory}
                    setCategoryId={setCategoryId}
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    username={username}
                    setUsername={setUsername}
                    avatar={avatar}
                    loading={loading}
                    setLoading={setLoading}
                  />
                }
              />

              <Route
                path="/category"
                element={
                  <CategoryDisplay
                    category={category}
                    setCategory={setCategory}
                    setSubCategory={setSubCategory}
                    setCategoryId={setCategoryId}
                  />
                }
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
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    type={type}
                    setType={setType}
                    setQuizStart={setQuizStart}
                    setStatus={setStatus}
                    setQuestionCurrentIndex={setQuestionCurrentIndex}
                    setCurrentOption={setCurrentOption}
                    setUserAnswers={setUserAnswers}
                    setQuizId={setQuizId}
                  />
                }
              />

              <Route
                path="/quiz"
                element={
                  <NoDirectAccess>
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
                      category={category}
                      setCategory={setCategory}
                      subCategory={subCategory}
                      setSubCategory={setSubCategory}
                    />
                  </NoDirectAccess>
                }
              />

              <Route
                path="/results/:category/:subCategory?"
                element={
                  <NoDirectAccess>
                    <ResultsScreen
                      questionNumber={questionNumber}
                      questions={questions}
                      userAnswers={userAnswers}
                      difficulty={difficulty}
                      setQuizStart={setQuizStart}
                      questionCurrentIndex={questionCurrentIndex}
                      setQuestionCurrentIndex={setQuestionCurrentIndex}
                      setCurrentOption={setCurrentOption}
                      setUserAnswers={setUserAnswers}
                      quizId={quizId}
                      setQuizId={setQuizId}
                      category={category}
                      setCategory={setCategory}
                      subCategory={subCategory}
                      setSubCategory={setSubCategory}
                    />
                  </NoDirectAccess>
                }
              />

              <Route
                path="/answers/:category/:subCategory?"
                element={
                  <NoDirectAccess>
                    <AnswersComparison
                      questions={questions}
                      userAnswers={userAnswers}
                      category={category}
                      setCategory={setCategory}
                      subCategory={subCategory}
                      setSubCategory={setSubCategory}
                    />
                  </NoDirectAccess>
                }
              />
            </Route>
          </>
        )}

        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
