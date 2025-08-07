import { useState } from "react";
import CategoryDisplay from "./CategoryDisplay.jsx";
import SubCategoryDisplay from "./SubCategoryDisplay.jsx";
import StartQuizScreen from "./StartQuizScreen.jsx";
import QuizScreen from "./QuizScreen.jsx";
import ResultsScreen from "./ResultsScreen.jsx";
import { useEffect } from "react";

function App() {

  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(10);
  const [difficulty, setDifficulty] = useState("any");
  const [type, setType] = useState("any");
  const [quizStart, setQuizStart] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [questionCurrentIndex, setQuestionCurrentIndex] = useState(0);
  const [currentOption, setCurrentOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {

    if(!quizStart || status !== "loading") return;

    let url = `https://opentdb.com/api.php?amount=${questionNumber}&category=${categoryId}`;
    if(difficulty !== "any")  url += `&difficulty=${difficulty}`;
    if(type !== "any") url += `&type=${type}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
       if(data.results.length === 0) {
        setStatus("error");
        setQuestions(null);
       }
       else {
        setQuestions(data.results);
        setStatus("success");
       }
     })
    .catch(() => {
      setStatus("error");
      setQuestions(null);
    });

  }, [quizStart, status]);

  return (
    <div>
      {!category && <CategoryDisplay setCategory={setCategory} />}

      {category && !subCategory && !quizStart && !results && (
        <SubCategoryDisplay category={category}
                            subCategory={subCategory}
                            setCategory={setCategory}
                            setSubCategory={setSubCategory}
                            setCategoryId={setCategoryId} />

      )}

      {categoryId && !quizStart && !results && <StartQuizScreen category={category}
                                      subCategory={subCategory}
                                      setSubCategory={setSubCategory}
                                      setCategoryId={setCategoryId}
                                      setQuestionNumber={setQuestionNumber}
                                      setDifficulty={setDifficulty}
                                      setType={setType}
                                      setQuizStart={setQuizStart}
                                      setStatus={setStatus}
                                      setQuestions={setQuestions}
                                      setQuestionCurrentIndex={setQuestionCurrentIndex}
                                      setCurrentOption={setCurrentOption}
                                      setUserAnswers={setUserAnswers} />}

      {quizStart && <QuizScreen questions={questions}
                                setQuestions={setQuestions}
                                setQuizStart={setQuizStart}
                                setQuestionNumber={setQuestionNumber}
                                setDifficulty={setDifficulty}
                                setType={setType}
                                questionCurrentIndex={questionCurrentIndex}
                                setQuestionCurrentIndex={setQuestionCurrentIndex}
                                currentOption={currentOption}
                                setCurrentOption={setCurrentOption}
                                setUserAnswers={setUserAnswers}
                                setResults={setResults}
                                status={status} />}

      {results && <ResultsScreen questions={questions}
                                 userAnswers={userAnswers}
                                 setResults={setResults}
                                 setQuizStart={setQuizStart}
                                 setQuestionNumber={setQuestionNumber}
                                 setDifficulty={setDifficulty}
                                 setType={setType}
                                 setQuestionCurrentIndex={setQuestionCurrentIndex}
                                 setCurrentOption={setCurrentOption}
                                 setUserAnswers={setUserAnswers} />}                        
    </div>
  )
}

export default App
  