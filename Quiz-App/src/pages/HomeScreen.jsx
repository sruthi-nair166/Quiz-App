import categories from "../data/categories.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "../styles/HomeScreen.module.css";
import AvatarDisplay from "../components/AvatarDisplay.jsx";
import BottomNav from "../components/BottomNav.jsx";
import GetRandomQuiz from "../utils/GetRandomQuiz";
import { Chart, useChart } from "@chakra-ui/charts";
import { Cell, Pie, PieChart } from "recharts";
import { Skeleton, SkeletonText, Stack } from "@chakra-ui/react";
import { categoriesImages } from "../data/categoriesImages.js";
import Sun from "../assets/others/sun.png";
import Moon from "../assets/others/moon.png";
import LaptopUser from "../assets/others/laptop.svg";
import QuizPlay from "../assets/others/quiz_play.svg";
import titleCaseConverter from "../utils/titleCaseConverter.js";

export default function HomeScreen({
  category,
  setCategory,
  setSubCategory,
  setCategoryId,
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
  avatar,
  loading,
  setLoading,
}) {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [recentQuiz, setRecentQuiz] = useState(null);
  const [recentQuizLoading, setRecentQuizLoading] = useState(true);
  const [icon, setIcon] = useState(null);

  const showGreetingSkeleton = loading || (loggedIn && !username);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        if (user.isAnonymous) {
          setLoggedIn(false);

          await setDoc(
            userRef,
            {
              adj: "",
              animal: "",
              avatar: null,
            },
            { merge: true }
          );
        } else {
          setLoggedIn(true);

          try {
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setUsername(`${data.adj} ${data.animal}` || "");
            }
          } catch (err) {
            console.error("Error fetching user document:", err);
          }
        }
      } else {
        setLoggedIn(false);
        setUsername("");
        console.log("Logged out");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const hours = new Date().getHours();

    if (hours < 12) {
      setGreeting("Good Morning");
      setIcon(Sun);
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
      setIcon(Sun);
    } else {
      setGreeting("Good Evening");
      setIcon(Moon);
    }
  }, []);

  useEffect(() => {
    const fetchRecentQuiz = async () => {
      const user = auth.currentUser;
      setRecentQuizLoading(true);

      if (!user) return;

      try {
        const attemptsRef = collection(db, "users", user.uid, "quizAttempts");
        const q = query(attemptsRef, orderBy("date", "desc"), limit(1));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          setRecentQuiz(querySnap.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching recent quiz:", err);
      } finally {
        setRecentQuizLoading(false);
      }
    };

    fetchRecentQuiz();
  }, []);

  const handleRecentQuizClick = () => {
    const categoryKey = recentQuiz.categoryKey;

    if (typeof categories[categoryKey] === "number") {
      const id = categories[categoryKey];

      navigate(
        `/start/${encodeURIComponent(categoryKey)}/${encodeURIComponent(id)}`
      );
      return;
    }

    for (const parent in categories) {
      if (typeof categories[parent] === "object") {
        Object.keys(categories[parent]).map((key) => {
          if (key === categoryKey) {
            const id = categories[parent][categoryKey];

            navigate(
              `/start/${encodeURIComponent(parent)}/${encodeURIComponent(
                categoryKey
              )}/${encodeURIComponent(id)}`
            );
          }
        });
      }
    }
  };

  const scoreValue = recentQuiz
    ? Math.round((recentQuiz.score / recentQuiz.totalQuestions) * 100)
    : 0;
  const chart = useChart({
    data: [
      {
        name: "score",
        value: scoreValue,
        color: "var(--dark-pink)",
      },
      { name: "remaining", value: 100 - scoreValue, color: "var(--pink)" },
    ],
  });

  return (
    <>
      <div className={styles["home-wrapper"]}>
        <div className={styles["greeting-display-wrapper"]}>
          <div>
            {showGreetingSkeleton ? (
              <Stack gap="0.5rem">
                <SkeletonText noOfLines={1} height="0.75rem" width="5rem" />
                <SkeletonText noOfLines={1} height="1.5rem" width="6rem" />
              </Stack>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {icon && <img src={icon} className={styles.icon} />}
                  <span
                    className={`uppercase text-small ${styles["text-color"]}`}
                  >
                    {greeting}
                  </span>
                </div>
                <p className={`heading-text ${styles["text-color"]}`}>
                  {loggedIn ? titleCaseConverter(username) : "Guest"}
                </p>
              </>
            )}
          </div>

          <div className="hide-on-desktop">
            <AvatarDisplay
              loading={loading}
              setLoading={setLoading}
              avatar={avatar}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          </div>
        </div>

        <div className={styles["quiz-cards-wrapper"]}>
          {recentQuizLoading ? (
            <Skeleton
              className={styles["recent-quiz-card-skeleton"]}
              borderRadius="1.5rem"
              margin="1rem"
            />
          ) : recentQuiz ? (
            <div className={styles["recent-quiz-card"]}>
              <button
                onClick={handleRecentQuizClick}
                className={styles["recent-quiz-btn"]}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <p
                    className="uppercase text-small"
                    style={{ textAlign: "left", color: "#B36673" }}
                  >
                    Recent Quiz
                  </p>
                  <span className="text-bold" style={{ color: "#660012" }}>
                    {titleCaseConverter(recentQuiz.categoryKey)} Quiz
                  </span>
                </div>

                <div style={{ position: "relative" }}>
                  <Chart.Root chart={chart} className={styles["pie-chart"]}>
                    <PieChart>
                      <Pie
                        isAnimationActive={true}
                        data={chart.data}
                        dataKey={chart.key("value")}
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        {chart.data.map((item) => (
                          <Cell
                            key={item.name}
                            fill={chart.color(item.color)}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </Chart.Root>
                  <p className={styles.percent}>
                    {Math.round(
                      (recentQuiz.score / recentQuiz.totalQuestions) * 100
                    )}
                    %
                  </p>
                </div>
              </button>
            </div>
          ) : (
            ""
          )}

          <div className={styles["random-quiz-card"]}>
            <img
              src={LaptopUser}
              alt=""
              style={{
                backgroundColor: "#C4D0FB",
                position: "absolute",
                top: "6%",
                left: "4%",
              }}
            />
            <p
              className="uppercase text-bold"
              style={{
                color: "white",
                fontSize: "1.2rem",
                letterSpacing: "0.3rem",
              }}
            >
              Random Quiz
            </p>
            <button
              className="text-medium"
              onClick={() => {
                setCategory("");
                setSubCategory("");
                navigate(GetRandomQuiz());
              }}
            >
              Play Now
            </button>

            <img
              src={QuizPlay}
              alt=""
              style={{
                backgroundColor: "#ffc3cec1",
                position: "absolute",
                bottom: "5%",
                right: "5%",
              }}
            />
          </div>
        </div>

        <div className={styles["category-cards-wrapper"]}>
          <button
            onClick={() => navigate("/category")}
            className="text-bold text-medium"
            style={{ color: "var(--purple)" }}
          >
            See All
          </button>

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
      </div>
      <div className="hide-on-desktop">
        <BottomNav
          loggedIn={loggedIn}
          setCategory={setCategory}
          setSubCategory={setSubCategory}
        />
      </div>
    </>
  );
}
