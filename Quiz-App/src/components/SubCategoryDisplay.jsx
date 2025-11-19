import { useEffect } from "react";
import categories from "../data/categories.js";
import { useNavigate, useNavigationType, useParams } from "react-router-dom";
import styles from "../styles/CategoryDisplay.module.css";
import { subCategoriesImages } from "../data/categoriesImages.js";
import titleCaseConverter from "../utils/titleCaseConverter.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Center, Spinner } from "@chakra-ui/react";

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
    const selectedSubCategory = e.currentTarget.textContent.toLowerCase();

    setSubCategory(selectedSubCategory);
    setCategoryId(categories[category][selectedSubCategory]);

    navigate(
      `/start/${encodeURIComponent(category)}/${encodeURIComponent(
        selectedSubCategory
      )}/${encodeURIComponent(categories[category][selectedSubCategory])}`
    );
  };

  return (
    <div>
      {Object.entries(categories).map(([key, value]) => {
        if (category === key) {
          if (typeof value === "object") {
            return (
              <div key={key}>
                <div className={styles.header}>
                  <button
                    style={{ left: "1px", top: "40px" }}
                    className="back"
                    onClick={() => navigate(-1)}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                  </button>
                  <h1 className={`${styles.title} heading-text`}>
                    {titleCaseConverter(category)}
                  </h1>
                </div>

                <div className={styles["category-cards-container"]}>
                  {Object.keys(value).map((subKey) => {
                    const IconComponent = subCategoriesImages[key][subKey];
                    return (
                      <button
                        key={subKey}
                        onClick={handleSubCategory}
                        className={`${styles["category-card"]} text-medium`}
                      >
                        <IconComponent className={styles.icons} color="red" />
                        {titleCaseConverter(subKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
}
