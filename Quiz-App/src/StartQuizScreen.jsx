import categories from "./Categories.jsx";

export default function StartQuizScreen({category, subCategory, setSubCategory, setCategoryId}) {


  const handleChange = e => {
    
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
      <form>

        <label htmlFor="no-of-q">Select Number of Questions:</label>
        <input type="number" defaultValue={10} min={10} max={50} id="no-of-q" onChange={handleChange} />

        <label htmlFor="difficulty">Select Difficulty:</label>
        <select id="difficulty" onChange={handleChange}>
          <option value="any">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label htmlFor="type">Select Type</label>
        <select id="type" onChange={handleChange}>
          <option value="any">Any</option>
          <option value="mcq">Multiple Choice</option>
          <option value="true-false">True/False</option>
      
        </select>
        
        <button>Start</button>
      </form>

    </>

  );

}