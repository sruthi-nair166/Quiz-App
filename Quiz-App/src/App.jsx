import { useState } from "react";
import CategoryDisplay from "./CategoryDisplay.jsx";
import SubCategoryDisplay from "./SubCategoryDisplay.jsx";
import StartQuizScreen from "./StartQuizScreen.jsx";

function App() {

  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  return (
    <div>
      {!category && <CategoryDisplay setCategory={setCategory} />}
      {category && !subCategory && (
        <SubCategoryDisplay category={category}
                            subCategory={subCategory}
                            setCategory={setCategory}
                            setSubCategory={setSubCategory}
                            setCategoryId={setCategoryId} />
      )}
      {categoryId && <StartQuizScreen category={category}
                                      subCategory={subCategory}
                                      setSubCategory={setSubCategory}
                                      setCategoryId={setCategoryId}/>}
    </div>
  )
}

export default App
  