import { decodeHTML } from "./decodeHTML.js";

export default function ResultsScreen({questions, userAnswers, setResults, setQuizStart, setQuestionNumber, setDifficulty, setType, setQuestionCurrentIndex, setCurrentOption, setUserAnswers}) {

  let score = 0;


  Object.values(userAnswers).map((answer, idx) => {
    
    if(answer === decodeHTML(questions[idx]["correct_answer"])) {
      score++;
    }
  });


  return (

    <>

      <button type="button" onClick={() => {
                              setResults(false);
                              setQuestionNumber(10);
                              setDifficulty("any");
                              setType("any");
                            }}>Back</button>

      <h1>Results</h1>
      <p>You have scored {score} points</p>

      <button onClick={() => {
        setResults(false);
        setQuizStart(true);
        setQuestionNumber(10);
        setDifficulty("any");
        setType("any");
        setQuestionCurrentIndex(0);
        setCurrentOption(null);
        setUserAnswers({});
      }}>Retake Quiz</button>
    </>

  );

}