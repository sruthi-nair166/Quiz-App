import { useEffect } from "react";
import categories from "./categories.js";

export default function SubCategoryDisplay({category, setCategory, setSubCategory, setCategoryId}) {
  
  const handleClick = e => {
    const selectedSubCategory = e.target.textContent;

    setSubCategory(selectedSubCategory);
    setCategoryId(categories[category][selectedSubCategory]);
  }

  useEffect(() => {
    if(category && typeof categories[category] === "number") {
      setCategoryId(categories[category]);
    }
  }, [category]);

  return (
    <>
      <button onClick={() => {
        setCategory(null);
        setCategoryId(null);
      }}>Back</button>

      {Object.entries(categories).map(([key, value]) => {

        if(category === key) {

          if(typeof value === "object") {
            return (
              <div key={key}>
                <h1>{category}</h1>
                {Object.keys(value).map(subKey => {
                  return <button key={subKey} onClick={handleClick}>{subKey}</button>
                })}
              </div>
            );
          
          }

        }

      })}

    </>
  );

}