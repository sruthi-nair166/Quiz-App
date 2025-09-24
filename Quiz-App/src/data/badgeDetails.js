import categories from "./categories";

const requiredCategories = [];
for (const [key, value] of Object.entries(categories)) {
  if (typeof value === "number") {
    requiredCategories.push(key);
  } else {
    requiredCategories.push(...Object.keys(value));
  }
}

function categoriesDisplay() {
  const results = {};

  requiredCategories.map((c) => {
    results[c] = {
      subtitle: c,
      desc: `Attempt a total of 20 quizzes in the ${c} category.`,
      winDesc: `Attempted a total of 20 quizzes in the ${c} category!`,
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => (data.categoryStats?.[c]?.quizzes || 0) >= 20,
    };
  });
  return results;
}

const badgeDetails = [
  {
    title: "First Steps",
    desc: "Play your first quiz",
    winDesc: "Played your first quiz!",
    lockedUrl: "url",
    unlockedUrl: "url",
    condition: (data) => data.totalQuizzes > 0,
  },

  {
    title: "Completionist",
    desc: "Complete one quiz in each category.",
    winDesc: "Completed one quiz in each category!",
    lockedUrl: "url",
    unlockedUrl: "url",
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
    lockedUrl: "url",
    unlockedUrl: "url",
    condition: (data) => data.streak >= 10,
  },

  {
    title: "Quiz Enthusiast",
    bronze: {
      subtitle: "Bronze",
      desc: "Attempt a total of 10 quizzes.",
      winDesc: "Attempted a total of 10 quizzes!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => data.totalQuizzes >= 10,
    },
    silver: {
      subtitle: "Silver",
      desc: "Attempt a total of 50 quizzes.",
      winDesc: "Attempted a total of 50 quizzes!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => data.totalQuizzes >= 50,
    },
    gold: {
      subtitle: "Gold",
      desc: "Attempt a total of 100 quizzes.",
      winDesc: "Attempted a total of 100 quizzes!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => data.totalQuizzes >= 100,
    },
  },

  {
    title: "Quiz Champion",
    bronze: {
      subtitle: "Bronze",
      desc: "Obtain an overall score of 50.",
      winDesc: "Obtained an overall score of 50!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => data.totalScore >= 50,
    },
    silver: {
      subtitle: "Silver",
      desc: "Obtain an overall score of 100.",
      winDesc: "Obtained an overall score of 100!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => data.totalScore >= 100,
    },
    gold: {
      subtitle: "Gold",
      desc: "Obtain an overall score of 200.",
      winDesc: "Obtained an overall score of 200!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => data.totalScore >= 200,
    },
  },

  {
    title: "Difficulty Conqueror",
    easy: {
      subtitle: "Easy Explorer",
      desc: "Attempt a total of 50 quizzes with difficulty set to easy.",
      winDesc: "Attempted a total of 50 quizzes with difficulty set to easy!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => (data.difficultyStats?.easy?.score || 0) >= 50,
    },
    medium: {
      subtitle: "Medium Challenger",
      desc: "Attempt a total of 50 quizzes with difficulty set to medium.",
      winDesc: "Attempted a total of 50 quizzes with difficulty set to medium!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => (data.difficultyStats?.medium?.score || 0) >= 50,
    },
    hard: {
      subtitle: "Hardcore Master",
      desc: "Attempt a total of 50 quizzes with difficulty set to hard.",
      winDesc: "Attempted a total of 50 quizzes with difficulty set to hard!",
      lockedUrl: "url",
      unlockedUrl: "url",
      condition: (data) => (data.difficultyStats?.hard?.score || 0) >= 50,
    },
  },

  {
    title: "Category Specialist",
    ...categoriesDisplay(),
  },
];

export default badgeDetails;
