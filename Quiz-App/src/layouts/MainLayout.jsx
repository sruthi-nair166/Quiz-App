import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import badgeDetails from "../data/badgeDetails.js";
import styles from "../styles/MainLayout.module.css";
import AvatarDisplay from "../components/AvatarDisplay.jsx";
import BadgeDialog from "../components/BadgeDialog.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function MainLayout({
  setQuizStart,
  setStatus,
  setQuestionNumber,
  setDifficulty,
  setType,
  loggedIn,
  setLoggedIn,
  avatar,
  setAvatar,
  loading,
  setLoading,
}) {
  const navigate = useNavigate();
  const [newBadge, setNewBadge] = useState(null);
  const [newBadgeTitle, setNewBadgeTitle] = useState(null);
  const [newBadgeSubtitle, setNewBadgeSubtitle] = useState(null);
  const [newBadgeDesc, setNewBadgeDesc] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.isAnonymous) {
          setLoggedIn(false);
        } else {
          setLoggedIn(true);

          const docRef = doc(db, "users", user.uid);
          getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setAvatar(data.avatar || null);
            }
          });
        }
      } else {
        setLoggedIn(false);
        setAvatar(null);
        console.log("Logged out");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const user = auth.currentUser;
  const unlockedRef = useRef({});

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;
      const userData = snap.data();

      const updates = {};

      badgeDetails.forEach((value) => {
        if ("condition" in value) {
          const already = unlockedRef.current[value.title];
          if (
            !already &&
            !userData.badges?.[value.title] &&
            value.condition(userData)
          ) {
            updates[`badges.${value.title}`] = true;
            setNewBadge(value.url || "");
            setNewBadgeTitle(value.title || "");
            setNewBadgeSubtitle(value.subtitle || "");
            setNewBadgeDesc(value.winDesc || "");
            unlockedRef.current[value.title] = true;
          }
        } else {
          Object.values(value).forEach((v) => {
            if (typeof v === "object") {
              const already =
                unlockedRef.current[`${value.title}-${v.subtitle}`];
              if (
                !already &&
                !userData.badges?.[value.title]?.[v.subtitle] &&
                v.condition(userData)
              ) {
                updates[`badges.${value.title}.${v.subtitle}`] = true;
                setNewBadge(v.url || "");
                setNewBadgeTitle(value.title || "");
                setNewBadgeSubtitle(v.subtitle || "");
                setNewBadgeDesc(v.winDesc || "");
                unlockedRef.current[`${value.title}-${v.subtitle}`] = true;
              }
            }
          });
        }
      });

      if (Object.keys(updates).length > 0) {
        updateDoc(userRef, updates);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className={styles.wrapper}>
      <header className="hide-on-mobile">
        <button
          onClick={() => {
            setQuizStart(false);
            setStatus("idle");
            setQuestionNumber(10);
            setDifficulty("any");
            setType("any");
            navigate("/home");
          }}
        >
          <img src="favicon.png" alt="" style={{ width: "50px" }} />
        </button>

        <div className={styles["login-stats-wrapper"]}>
          {!loggedIn && (
            <>
              <button className="btn" onClick={() => navigate("/credits")}>
                <FontAwesomeIcon icon={faCircleInfo} size="lg" color="white" />
              </button>
              <button className="btn" onClick={() => navigate("/profile")}>
                Stats
              </button>
            </>
          )}

          <AvatarDisplay
            loading={loading}
            setLoading={setLoading}
            avatar={avatar}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
        </div>
      </header>

      <BadgeDialog
        openBadge={newBadge}
        setOpenBadge={setNewBadge}
        badgeTitle={newBadgeTitle}
        badgeSubtitle={newBadgeSubtitle}
        badgeUrl={newBadge}
        badgeDesc={newBadgeDesc}
        badgeUnlocked={true}
      />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
