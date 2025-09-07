import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Settings({
  username,
  setUsername,
  avatar,
  setAvatar,
  setLoggedIn,
  msg,
  setMsg,
}) {
  const [clearData, setClearData] = useState(false);
  const [delAccount, setDelAccount] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setLoggedIn(false);
        navigate("/");
        console.log("Logged out successfully");
      })
      .catch((err) => console.err("Error during logout", err));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUsername(`${data.adj} ${data.animal}` || "");
        setAvatar(data.avatar || null);
      } else {
        setUser(null);
        setUsername(null);
        setAvatar(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleClearData = () => {
    if (!user) return;
  };

  const handleDeleteData = () => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    deleteDoc(docRef).then(() => {
      console.log("User data cleared");
    });

    deleteUser(user)
      .then(() => console.log("Your account has been deleted"))
      .then(() => navigate("/"))
      .catch((err) => {
        if (err.code === "auth/requires-recent-login") {
          setMsg("Please log in again to be able to delete your account");
        } else {
          setMsg(`Error deleting account: ${err}`);
        }
      });
  };

  return (
    <>
      <button onClick={() => navigate(-1)}>Back</button>

      <button
        onClick={() => {
          navigate("/profile-setup/change-username");
        }}
      >
        Username {username}
      </button>
      <button
        onClick={() => {
          navigate("/profile-setup/change-avatar");
        }}
      >
        Avatar <img src={avatar} width="30px" />
      </button>
      <button
        onClick={() => {
          setMsg("");
          navigate("/update-settings/change-email/verify");
        }}
      >
        Email {user ? user.email : "Loading..."}
      </button>
      <button
        onClick={() => {
          setMsg("");
          navigate("/update-settings/change-password/verify");
        }}
      >
        Password
      </button>

      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => setClearData(true)}>Clear Data</button>
      {clearData ? (
        <>
          <p>
            Warning: Choosing the following will clear all your progress. Do you
            still want to proceed?
          </p>
          <button onClick={() => setClearData(false)}>Cancel</button>
          <button
            onClick={() => {
              handleClearData();
              setClearData(false);
              setMsg("");
            }}
          >
            Clear Data
          </button>
        </>
      ) : (
        ""
      )}
      <button onClick={() => setDelAccount(true)}>Delete Account</button>
      {delAccount ? (
        <>
          <p>Are you sure you want to delete your account?</p>
          <button onClick={() => setDelAccount(false)}>Cancel</button>
          <button
            onClick={() => {
              handleDeleteData();
              setDelAccount(false);
              setMsg("");
            }}
          >
            Delete
          </button>
        </>
      ) : (
        ""
      )}
      {msg ? <p>{msg}</p> : ""}
    </>
  );
}
