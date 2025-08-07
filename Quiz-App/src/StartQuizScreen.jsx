export default function StartQuizScreen({category, subCategory, setSubCategory, setCategoryId,setQuestionNumber, setDifficulty, setType, setQuizStart, setStatus, setQuestions, setQuestionCurrentIndex, setCurrentOption, setUserAnswers}) {


  const handleSubmit = e => {
    e.preventDefault();
    setQuizStart(true);
    setStatus("loading");
    setQuestions(null);
    setQuestionCurrentIndex(0);
    setCurrentOption(null);
    setUserAnswers({});
  }

  
  return (

    <>
      {subCategory ? <button onClick={() => {
                                setCategoryId(null);
                                setSubCategory(null);
                             }}>Back</button>
                   : ""}

      {subCategory ? <>
                       <h1>{category}</h1> 
                       <h1>{subCategory} quiz</h1> 
                     </>
                   : <h1>{category} quiz</h1>}
                   
      <form onSubmit={handleSubmit}>

        <label htmlFor="no-of-q">Select Number of Questions:</label>
        <input type="number" defaultValue={10} min={10} max={50} id="no-of-q" 
               onChange={e => setQuestionNumber(e.target.value)} />

        <label htmlFor="difficulty">Select Difficulty:</label>
        <select id="difficulty" onChange={e => setDifficulty(e.target.value)}>
          <option value="any">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label htmlFor="type">Select Type</label>
        <select id="type" onChange={e => setType(e.target.value)}>
          <option value="any">Any</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True/False</option>
        </select>
        
        <button type="submit">Start</button>
      </form>

    </>

  );

}