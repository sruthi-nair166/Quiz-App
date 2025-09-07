import categories from "./categories";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function HomeScreen({
  setCategory,
  setQuizStart,
  setStatus,
  setQuestionNumber,
  setDifficulty,
  setType,
  loggedIn,
  setLoggedIn,
  username,
  setUsername,
  avatar,
  setAvatar,
  open,
  setOpen,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  const handleClick = (e) => {
    const selectedCategory = e.target.textContent;
    setCategory(selectedCategory);
    navigate(`/subcategory/${encodeURIComponent(selectedCategory)}`);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setOpen(false);
        setLoggedIn(false);
        navigate("/login");
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
              setUsername(`${data.adj} ${data.animal}` || "");
            }
          });
        }
      } else {
        setLoggedIn(false);
        setAvatar(null);
        setUsername("");
        console.log("Logged out");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
              <button>Profile</button>
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
          {showGuestWarning ? (
            <>
              <button onClick={() => setShowGuestWarning(false)}>close</button>
              <p>You're currently playing as Guest</p>
              <p>
                Do you wish to link your account to save your current progress?
              </p>
              <button
                onClick={() => {
                  navigate("/link-account");
                }}
              >
                Link Account
              </button>
              <button onClick={() => navigate("/login")}>Start Fresh</button>
            </>
          ) : (
            ""
          )}
        </>
      )}

      <p>Welcome</p>
      {loading ? (
        <p>Loading...</p>
      ) : loggedIn ? (
        <p>{username}</p>
      ) : (
        <p>Guest</p>
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
