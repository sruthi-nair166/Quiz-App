import categories from "./categories";
import { categoriesImages, subCategoriesImages } from "./categoriesImages";
import FirstStepsIcon from "../assets/badges_Img/react/FirstSteps.jsx";
import CompletionistIcon from "../assets/badges_Img/react/Completionist.jsx";
import StreakMasterIcon from "../assets/badges_Img/react/StreakMaster.jsx";
import QuizEnthusiastIcon from "../assets/badges_Img/react/QuizEnthusiast.jsx";
import QuizChampionBronzeIcon from "../assets/badges_Img/react/QuizChampionBronze.jsx";
import QuizChampionSilverIcon from "../assets/badges_Img/react/QuizChampionSilver.jsx";
import QuizChampionGoldIcon from "../assets/badges_Img/react/QuizChampionGold.jsx";
import DifficultyBronzeIcon from "../assets/badges_Img/react/DifficultyBronze.jsx";
import DifficultySilverIcon from "../assets/badges_Img/react/DifficultySilver.jsx";
import DifficultyGoldIcon from "../assets/badges_Img/react/DifficultyGold.jsx";

const requiredCategories = [];
for (const [key, value] of Object.entries(categories)) {
  if (typeof value === "number") {
    requiredCategories.push(key);
  } else {
    requiredCategories.push(...Object.keys(value));
  }
}

const categoriesColors = {
  "general knowledge": {
    component: categoriesImages["general knowledge"],
    inner: "#008585",
    outer: "#90c3aeff",
  },
  books: {
    component: subCategoriesImages.entertainment.books,
    inner: "#9f394f",
    outer: "#e66c86ff",
  },
  film: {
    component: subCategoriesImages.entertainment.film,
    inner: "#d68a58",
    outer: "#e5c185",
  },
  music: {
    component: subCategoriesImages.entertainment.music,
    inner: "#ddbd70ff",
    outer: "#f3e5bcff",
  },
  "video games": {
    component: subCategoriesImages.entertainment["video games"],
    inner: "#c67ae6",
    outer: "#efb5f9ff",
  },
  computers: {
    component: subCategoriesImages.science.computers,
    inner: "#939ca3",
    outer: "#b5bdc4",
  },
  mathematics: {
    component: subCategoriesImages.science.mathematics,
    inner: "#5948c6",
    outer: "#6c58f1",
  },
  animals: {
    component: categoriesImages.animals,
    inner: "#e27c66",
    outer: "#e9ba96ff",
  },
  geography: {
    component: categoriesImages.geography,
    inner: "#80c783",
    outer: "#bddeb3",
  },
  history: {
    component: categoriesImages.history,
    inner: "#4a3931",
    outer: "#94807a",
  },
  art: {
    component: categoriesImages.art,
    inner: "#FA5053",
    outer: "#57B9FF",
  },
  mythology: {
    component: categoriesImages.mythology,
    inner: "#658ef2",
    outer: "#3bcae5",
  },
};

function categoriesDisplay() {
  const results = {};

  requiredCategories.map((c) => {
    results[c] = {
      subtitle: c,
      desc: `Attempt a total of 20 quizzes in the ${c} category.`,
      winDesc: `Attempted a total of 20 quizzes in the ${c} category!`,
      url: {
        component: categoriesColors[c].component,
        border: categoriesColors[c].border,
        inner: categoriesColors[c].inner,
        outer: categoriesColors[c].outer,
      },
      condition: (data) => (data.categoryStats?.[c]?.quizzes || 0) >= 20,
    };
  });
  return results;
}

const badgeDetails = [
  {
    title: "First Steps",
    desc: "Play your first quiz.",
    winDesc: "Played your first quiz!",
    url: {
      component: FirstStepsIcon,
      inner: "#ff7eb6",
      outer: "#ffc9ec",
    },
    condition: (data) => data.totalQuizzes > 0,
  },

  {
    title: "Completionist",
    desc: "Complete one quiz in each category.",
    winDesc: "Completed one quiz in each category!",
    url: {
      component: CompletionistIcon,
      inner: "#057dcd",
      outer: "#96cff1",
    },
    condition: (data) => {
      requiredCategories.every((c) => {
        return (data.categoryStats?.[c]?.quizzes || 0) > 0;
      });
    },
  },

  {
    title: "Streak Master",
    desc: "Win 10 quizzes in a row.",
    winDesc: "Won 10 quizzes in a row!",
    url: {
      component: StreakMasterIcon,
      inner: "#c43138",
      outer: "#ff8b3e",
    },
    condition: (data) => data.streak >= 10,
  },

  {
    title: "Quiz Enthusiast",
    bronze: {
      subtitle: "Bronze",
      desc: "Attempt a total of 10 quizzes.",
      winDesc: "Attempted a total of 10 quizzes!",
      url: {
        component: QuizEnthusiastIcon,
        inner: "#c19a6b",
        outer: "#e6d0a3",
      },
      condition: (data) => data.totalQuizzes >= 10,
    },
    silver: {
      subtitle: "Silver",
      desc: "Attempt a total of 50 quizzes.",
      winDesc: "Attempted a total of 50 quizzes!",
      url: {
        component: QuizEnthusiastIcon,
        inner: "#bcc1c2",
        outer: "#e0e0e0ff",
      },
      condition: (data) => data.totalQuizzes >= 50,
    },
    gold: {
      subtitle: "Gold",
      desc: "Attempt a total of 100 quizzes.",
      winDesc: "Attempted a total of 100 quizzes!",
      url: {
        component: QuizEnthusiastIcon,
        inner: "#e8b04b",
        outer: "#ffd889ff",
      },
      condition: (data) => data.totalQuizzes >= 100,
    },
  },

  {
    title: "Quiz Champion",
    bronze: {
      subtitle: "Bronze",
      desc: "Obtain an overall score of 50.",
      winDesc: "Obtained an overall score of 50!",
      url: {
        component: QuizChampionBronzeIcon,
        inner: "#c19a6b",
        outer: "#e6d0a3",
      },
      condition: (data) => data.totalScore >= 50,
    },
    silver: {
      subtitle: "Silver",
      desc: "Obtain an overall score of 100.",
      winDesc: "Obtained an overall score of 100!",
      url: {
        component: QuizChampionSilverIcon,
        inner: "#bcc1c2",
        outer: "#e0e0e0ff",
      },
      condition: (data) => data.totalScore >= 100,
    },
    gold: {
      subtitle: "Gold",
      desc: "Obtain an overall score of 200.",
      winDesc: "Obtained an overall score of 200!",
      url: {
        component: QuizChampionGoldIcon,
        inner: "#e8b04b",
        outer: "#ffd889ff",
      },
      condition: (data) => data.totalScore >= 200,
    },
  },

  {
    title: "Difficulty Conqueror",
    easy: {
      subtitle: "Easy Explorer",
      desc: "Attempt a total of 50 quizzes with difficulty set to easy.",
      winDesc: "Attempted a total of 50 quizzes with difficulty set to easy!",
      url: {
        component: DifficultyBronzeIcon,
        inner: "#c19a6b",
        outer: "#e6d0a3",
      },
      condition: (data) => (data.difficultyStats?.easy?.score || 0) >= 50,
    },
    medium: {
      subtitle: "Medium Challenger",
      desc: "Attempt a total of 50 quizzes with difficulty set to medium.",
      winDesc: "Attempted a total of 50 quizzes with difficulty set to medium!",
      url: {
        component: DifficultySilverIcon,
        inner: "#bcc1c2",
        outer: "#e0e0e0ff",
      },
      condition: (data) => (data.difficultyStats?.medium?.score || 0) >= 50,
    },
    hard: {
      subtitle: "Hardcore Master",
      desc: "Attempt a total of 50 quizzes with difficulty set to hard.",
      winDesc: "Attempted a total of 50 quizzes with difficulty set to hard!",
      url: {
        component: DifficultyGoldIcon,
        inner: "#e8b04b",
        outer: "#ffd889ff",
      },
      condition: (data) => (data.difficultyStats?.hard?.score || 0) >= 50,
    },
  },

  {
    title: "Category Specialist",
    ...categoriesDisplay(),
  },
];

export default badgeDetails;
