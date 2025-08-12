import categories from "./categories.js";
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
