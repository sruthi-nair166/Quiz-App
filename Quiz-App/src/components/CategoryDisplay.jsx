import categories from "../data/categories.js";
import { useNavigate } from "react-router-dom";

export default function CategoryDisplay({ setCategory }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const selectedCategory = e.target.textContent;
    setCategory(selectedCategory);
    navigate(`/subcategory/${encodeURIComponent(selectedCategory)}`);
  };

  return (
    <>
      <button onClick={() => navigate(-1)}>Back</button>
      {Object.keys(categories).map((key) => {
        return (
          <button key={key} onClick={handleClick}>
            {key}
          </button>
        );
      })}
    </>
  );
}
