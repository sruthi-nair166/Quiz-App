import { useState, useEffect } from "react";
import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import badgeDetails from "../data/badgeDetails";

export default function Profile({
  avatar,
  setAvatar,
  username,
  setUsername,
  loggedIn,
  setLoggedIn,
}) {
  const [tab, setTab] = useState("details");
  const [playerScore, setPlayerScore] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);
  const [timeRange, setTimeRange] = useState("monthly");
  const [badgesCollection, setBadgesCollection] = useState({});
  const [openBadge, setOpenBadge] = useState("close");
  const [badgeTitle, setBadgeTitle] = useState(null);
  const [badgeSubtitle, setBadgeSubtitle] = useState(null);
  const [badgeUrl, setBadgeUrl] = useState(null);
  const [badgeDesc, setBadgeDesc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.isAnonymous ? setLoggedIn(false) : setLoggedIn(true);

        const docRef = doc(db, "users", user.uid);

        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();

              setAvatar(data.avatar || null);
              setUsername(`${data.adj} ${data.animal}` || "");

              setPlayerScore(data.totalScore);
              setPlayerWins(data.totalWon);
              setBadgesCollection(data.badges || {});
            }
          })
          .catch((err) => console.error("Error fetching user doc:", err));
      } else {
        setLoggedIn(false);
        setUsername("");
        console.log("Guest");
      }
    });

    return () => unsubscribe();
  }, []);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const qMonth = query(
          collection(db, "users", user.uid, "quizAttempts"),
          where("date", ">=", startOfTheMonth())
        );
        const snapMonth = await getDocs(qMonth);
        setMonthCount(snapMonth.size);

        const qYear = query(
          collection(db, "users", user.uid, "quizAttempts"),
          where("date", ">=", startOfTheYear())
        );
        const snapYear = await getDocs(qYear);
        setYearCount(snapYear.size);
      } catch (err) {
        console.error("Error fetching quiz attempt counts:", err);
      }
    };

    fetchData();
  }, [user]);

  function startOfTheMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return Timestamp.fromDate(start);
  }

  function startOfTheYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Timestamp.fromDate(start);
  }

  return (
    <>
      <button onClick={() => navigate(-1)}>Back</button>

      {loggedIn ? (
        <>
          <img src={avatar} width="70px" />
          <p>{username}</p>
        </>
      ) : (
        <p>
          Guest progress may be lost.{" "}
          <button onClick={() => navigate("/auth/link-account")}>Link</button>{" "}
          your account to keep your data safe.
        </p>
      )}

      <p>{playerScore || 0} Points</p>
      <p>{playerWins || 0} Quizzes Won</p>

      <button onClick={() => setTab("details")}>Details</button>
      <button onClick={() => setTab("stats")}>Stats</button>
      <button onClick={() => setTab("badges")}>Badges</button>

      {tab === "details" && (
        <>
          <select
            name="time-range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <p>
            You have played a total of{" "}
            {timeRange === "monthly" ? monthCount : yearCount} quizzes this{" "}
            {timeRange === "monthly" ? "month" : "year"}
          </p>
        </>
      )}

      {tab === "stats" && <p>Graph</p>}

      {tab === "badges" && (
        <>
          {badgeDetails.map((value) => {
            if ("condition" in value) {
              return (
                <button
                  key={`${value.title} ${value.subtitle || ""}`}
                  onClick={() => {
                    setOpenBadge("open");
                    setBadgeTitle(value.title || "");
                    setBadgeSubtitle(value.subtitle || "");
                    setBadgeUrl(
                      (badgesCollection[value.title]
                        ? value.unlockedUrl
                        : value.lockedUrl) || ""
                    );
                    setBadgeDesc(
                      badgesCollection[value.title] ? value.winDesc : value.desc
                    );
                  }}
                  style={{
                    color: badgesCollection[value.title] ? "black" : "grey",
                  }}
                >
                  {value.title}
                </button>
              );
            } else {
              return Object.values(value).map((v) => {
                return (
                  <button
                    disabled={typeof v !== "object" ? true : false}
                    key={`${value.title} ${v.subtitle || ""}`}
                    onClick={() => {
                      setOpenBadge("open");
                      setBadgeTitle(value.title || "");
                      setBadgeSubtitle(v.subtitle || "");
                      setBadgeUrl(
                        (badgesCollection[value.title]?.[v.subtitle]
                          ? v.unlockedUrl
                          : v.lockedUrl) || ""
                      );
                      setBadgeDesc(
                        badgesCollection[value.title]?.[v.subtitle]
                          ? v.winDesc
                          : v.desc
                      );
                    }}
                    style={{
                      color: badgesCollection[value.title]?.[v.subtitle]
                        ? "black"
                        : "grey",
                    }}
                  >
                    {!v.subtitle ? value.title : v.subtitle}
                  </button>
                );
              });
            }
          })}

          {openBadge === "open" && (
            <>
              <button onClick={() => setOpenBadge("close")}>close</button>
              <p>{badgeTitle}</p>
              <p>{badgeSubtitle}</p>
              <img src={badgeUrl} />
              <p>{badgeDesc}</p>
            </>
          )}
        </>
      )}
    </>
  );
}
