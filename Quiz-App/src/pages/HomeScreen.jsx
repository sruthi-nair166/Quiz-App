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

export default function HomeScreen({
  setCategory,
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
  loading,
  setLoading,
}) {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [recentQuiz, setRecentQuiz] = useState(null);

  const handleClick = (e) => {
    const selectedCategory = e.target.textContent;
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
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    const fetchRecentQuiz = async () => {
      const user = auth.currentUser;

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
      }
    };

    fetchRecentQuiz();
  }, []);

  const handleRecentQuizClick = () => {
    const key = recentQuiz.categoryKey;

    if (typeof categories[key] === "number") {
      const id = categories[key];

      navigate(`/start/${encodeURIComponent(key)}/${encodeURIComponent(id)}`);
      return;
    }

    for (const parent in categories) {
      if (typeof categories[parent] === "object") {
        const id = categories[parent][key];

        navigate(
          `/start/${encodeURIComponent(parent)}/${encodeURIComponent(
            key
          )}/${encodeURIComponent(id)}`
        );
      }
    }
  };

  return (
    <>
      <p>{greeting}</p>
      {loading ? (
        <p>Loading...</p>
      ) : loggedIn ? (
        <p>{username}</p>
      ) : (
        <p>Guest</p>
      )}

      {recentQuiz ? (
        <>
          <p>Recent Quiz</p>
          <button onClick={handleRecentQuizClick}>
            <span>{recentQuiz.categoryKey}</span>{" "}
            <span>
              {Math.round((recentQuiz.score / recentQuiz.totalQuestions) * 100)}
              %
            </span>
          </button>
        </>
      ) : (
        ""
      )}

      <button onClick={() => navigate("/category")}>See All</button>

      {Object.keys(categories).map((key, idx) => {
        if (idx >= 4) return;

        return (
          <button key={key} onClick={handleClick}>
            {key}
          </button>
        );
      })}
    </>
  );
}
