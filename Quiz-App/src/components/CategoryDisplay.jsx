import categories from "../data/categories.js";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CategoryDisplay.module.css";
import { categoriesImages } from "../data/categoriesImages.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import titleCaseConverter from "../utils/titleCaseConverter.js";

export default function CategoryDisplay({
  category,
  setCategory,
  setSubCategory,
  setCategoryId,
}) {
  const navigate = useNavigate();

  const handleStart = (e) => {
    const selectedCategory = e.currentTarget.textContent.toLowerCase();
    setCategory(selectedCategory);
    setSubCategory("");
    setCategoryId(categories[category]);
    navigate(
      `/start/${encodeURIComponent(selectedCategory)}/${encodeURIComponent(
        categories[selectedCategory]
      )}`
    );
  };

  const handleSubCategory = (e) => {
    const selectedCategory = e.currentTarget.textContent.toLowerCase();
    setCategory(selectedCategory);
    navigate(`/subcategory/${encodeURIComponent(selectedCategory)}`);
  };

  return (
    <div>
      <div className={styles.header}>
        <button
          style={{ left: "1px", top: "40px" }}
          className="back"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <h1 className={`${styles.title} heading-text`}>Choose a Category</h1>
      </div>

      <div className={styles["category-cards-container"]}>
        {Object.entries(categories).map(([key, value]) => {
          const IconComponent = categoriesImages[key];

          if (typeof value === "number") {
            return (
              <button
                key={key}
                onClick={handleStart}
                className={`${styles["category-card"]} text-medium`}
              >
                <IconComponent className={styles.icons} />
                {titleCaseConverter(key)}
              </button>
            );
          } else {
            return (
              <button
                key={key}
                onClick={handleSubCategory}
                className={`${styles["category-card"]} text-medium`}
              >
                <IconComponent className={styles.icons} />
                {titleCaseConverter(key)}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}
