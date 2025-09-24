import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import badgeDetails from "../data/badgeDetails.js";

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
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  const [open, setOpen] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [newBadgeTitle, setNewBadgeTitle] = useState(null);
  const [newBadgeSubtitle, setNewBadgeSubtitle] = useState(null);
  const [newBadgeDesc, setNewBadgeDesc] = useState(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setOpen(false);
        setLoggedIn(false);
        navigate("/auth/login");
        console.log("Logged out successfully");
      })
      .catch((err) => console.err("Error during logout", err));
  };

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
            setNewBadge(value.unlockedUrl || "");
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
                setNewBadge(v.unlockedUrl || "");
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
    <>
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
        Home
      </button>

      {loading ? (
        <button disabled>
          <img src="https://placehold.net/avatar.svg" width="30px" />
        </button>
      ) : loggedIn ? (
        <>
          <button onClick={() => setOpen((prev) => !prev)}>
            <img src={avatar} width="30px" />
          </button>

          {open && (
            <>
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={() => navigate("/settings")}>Settings</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setShowGuestWarning(true);
            }}
          >
            Login
          </button>
          <button onClick={() => navigate("/profile")}>Stats</button>
          {showGuestWarning ? (
            <>
              <button onClick={() => setShowGuestWarning(false)}>close</button>
              <p>You're currently playing as Guest</p>
              <p>
                Do you wish to link your account to save your current progress?
              </p>
              <button
                onClick={() => {
                  navigate("/auth/link-account");
                }}
              >
                Link Account
              </button>
              <button onClick={() => navigate("/auth/login")}>
                Start Fresh
              </button>
            </>
          ) : (
            ""
          )}
        </>
      )}
      {newBadge && (
        <>
          <button onClick={() => setNewBadge(null)}>close</button>
          <p>{newBadgeTitle}</p>
          <p>{newBadgeSubtitle}</p>
          <img src={newBadge} />
          <p>unlocked</p>
          <p>{newBadgeDesc}</p>
        </>
      )}

      <Outlet />
    </>
  );
}
