import { useEffect } from "react";
import categories from "./categories.js";
import { useNavigate, useNavigationType, useParams } from "react-router-dom";

export default function SubCategoryDisplay({
  category,
  setCategory,
  setSubCategory,
  setCategoryId,
}) {
  const navigate = useNavigate();
  const action = useNavigationType();
  const { category: categoryParam } = useParams();

  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleSubCategory = (e) => {
    const selectedSubCategory = e.target.textContent;

    setSubCategory(selectedSubCategory);
    setCategoryId(categories[category][selectedSubCategory]);

    navigate(
      `/start/${encodeURIComponent(category)}/${encodeURIComponent(
        selectedSubCategory
      )}/${encodeURIComponent(categories[category][selectedSubCategory])}`
    );
  };

  useEffect(() => {
    if (action === "POP") return;

    if (typeof categories[category] === "number") {
      setCategoryId(categories[category]);
      setSubCategory(null);
      navigate(
        `/start/${encodeURIComponent(category)}/${encodeURIComponent(
          categories[category]
        )}`,
        { replace: true }
      );
    }
  }, [navigate, action]);

  return (
    <>
      <button onClick={() => navigate(-1)}>Back</button>

      {Object.entries(categories).map(([key, value]) => {
        if (category === key) {
          if (typeof value === "object") {
            return (
              <div key={key}>
                <h1>{category}</h1>
                {Object.keys(value).map((subKey) => {
                  return (
                    <button key={subKey} onClick={handleSubCategory}>
                      {subKey}
                    </button>
                  );
                })}
              </div>
            );
          }
        }
      })}
    </>
  );
}
