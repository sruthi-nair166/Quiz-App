import { useMemo } from "react";
import { decodeHTML } from "./decodeHTML.js";

export default function QuizScreen({questions, setQuestions, setQuizStart, setQuestionNumber, setDifficulty, setType, questionCurrentIndex, setQuestionCurrentIndex, currentOption, setCurrentOption, setUserAnswers, setResults, status}) {
  
  let optionsArray = [];

      if(status === "loading") return (<p>Loading...</p>);

      if(status === "error") 
        return (
        <>
          <button type="button" onClick={() => {
                                          setQuizStart(false);
                                          setQuestionNumber(10);
                                          setDifficulty("any");
                                          setType("any");
                                          setQuestionCurrentIndex(0);
                                          setCurrentOption(null);
                                          setUserAnswers({});
                                          setQuestions(null);
                                        }}>Back</button>
          <p>Quiz Not Found</p>
        </>
        )
      
      optionsArray = useMemo(() => {
        const arr = [questions[questionCurrentIndex]["correct_answer"], ...questions[questionCurrentIndex]["incorrect_answers"]];
        return arr.sort(() => Math.random() - 0.5);
      }, [questionCurrentIndex]);


      return (

        <form onSubmit={(e) => {
                                  e.preventDefault();

                                  if(!currentOption) alert("Please select an option");
                                  else {
                                    setResults(true);  
                                    setQuizStart(false);
                                    setUserAnswers(prev => ({
                                       ...prev,
                                       [questionCurrentIndex]: currentOption
                                    }));
                                    setCurrentOption(null);
                                  }
                               }}>
        
          <button type="button" onClick={() => {
                                          setQuizStart(false);
                                          setQuestionCurrentIndex(0);
                                          setCurrentOption(null);
                                          setUserAnswers({});
                                          setQuestions(null);
                                        }}>Back</button>
        
          <div>
            <p>{questionCurrentIndex + 1}</p>  
            <p>{decodeHTML(questions[questionCurrentIndex].question)}</p>
          </div> 

          <div>
            {optionsArray.map(option => {
              return (
                  <button type="button"
                          key={`${questionCurrentIndex+1}-${option}`} 
                          onClick={() => {
                            setCurrentOption(decodeHTML(option));
                          }}>{decodeHTML(option)}</button>
                )
              })}
          </div>

          <div>
            <button type="button" onClick={() => questionCurrentIndex > 0 && setQuestionCurrentIndex(prev => prev - 1)}>Previous</button>

            {questionCurrentIndex < questions.length-1 && <button type="button" onClick={() => {
                                     if(!currentOption) alert("Please select an option");
                                     
                                     else {
                                      setUserAnswers(prev => ({
                                       ...prev,
                                       [questionCurrentIndex]: currentOption
                                      }));
                                      setQuestionCurrentIndex(prev => prev + 1);
                                      setCurrentOption(null);
                                     }
                                   }}>Next</button>}

            {questionCurrentIndex === questions.length-1 && <button type="submit">Submit</button> }
          </div>

        </form> 

      )   

}