import categories from "../data/categories.js";

export default function GetRandomQuiz() {
  const randomCategories = Object.keys(categories);
  let randomCategory =
    randomCategories[Math.floor(Math.random() * randomCategories.length)];
  let randomSubCategory = "";

  if (typeof categories[randomCategory] === "object") {
    const randomSubCategories = Object.keys(categories[randomCategory]);

    randomSubCategory =
      randomSubCategories[
        Math.floor(Math.random() * randomSubCategories.length)
      ];
  }

  let path = `/start/${encodeURIComponent(randomCategory)}`;

  if (randomSubCategory) {
    path += `/${encodeURIComponent(randomSubCategory)}`;
  }

  path += `/${encodeURIComponent(
    randomSubCategory
      ? categories[randomCategory][randomSubCategory]
      : categories[randomCategory]
  )}`;

  return path;
}
