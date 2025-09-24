import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { uniqueNamesGenerator, adjectives } from "unique-names-generator";
import profilePicSelect from "../data/ProfilePicSelect";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProfileSetup({
  avatar,
  setAvatar,
  setUsername,
  msg,
  setMsg,
}) {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [randomAdj, setRandomAdj] = useState("");
  const [newRandomAdj, setNewRandomAdj] = useState("");
  const [animalName, setAnimalName] = useState("");
  const { mode } = useParams();

  const isAvatarSelect = mode === "signup-avatar" || mode === "change-avatar";
  const isUsernameSelect =
    mode === "signup-username" || mode === "change-username";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setRandomAdj(data.adj || "");
          setNewRandomAdj(data.adj || "");

          setAnimalName(data.animal || "");
          setUsername(`${data.adj} ${data.animal}`);

          setAvatar(data.avatar || null);
          setSelectedAvatar(data.avatar || null);
        } else {
          setRandomAdj(
            uniqueNamesGenerator({
              dictionaries: [adjectives],
              length: 1,
            })
          );
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const user = auth.currentUser;

  async function saveUserProfile(
    randomAdjParam,
    animalNameParam,
    animalUrlParam = selectedAvatar
  ) {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          adj: randomAdjParam,
          animal: animalNameParam,
          avatar: animalUrlParam,
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  }

  const handleShuffle = () => {
    const newAdj = uniqueNamesGenerator({
      dictionaries: [adjectives],
      length: 1,
    });
    setRandomAdj(newAdj);
  };

  if (isAvatarSelect) {
    return (
      <>
        <p>{msg}</p>
        <p>Select an avatar</p>
        <button
          onClick={() => {
            setSelectedAvatar(profilePicSelect[1]);
            setAnimalName(Object.keys(profilePicSelect)[0]);
          }}
        >
          <img src={profilePicSelect[1]} width="70px" />
        </button>
        <button
          onClick={() => {
            setSelectedAvatar(profilePicSelect[2]);
            setAnimalName(Object.keys(profilePicSelect)[1]);
          }}
        >
          <img src={profilePicSelect[2]} width="70px" />
        </button>
        <button
          onClick={() => {
            setSelectedAvatar(profilePicSelect[3]);
            setAnimalName(Object.keys(profilePicSelect)[2]);
          }}
        >
          <img src={profilePicSelect[3]} width="70px" />
        </button>
        <button
          onClick={() => {
            setSelectedAvatar(profilePicSelect[4]);
            setAnimalName(Object.keys(profilePicSelect)[3]);
          }}
        >
          <img src={profilePicSelect[4]} width="70px" />
        </button>
        <button
          onClick={() => {
            setSelectedAvatar(profilePicSelect[5]);
            setAnimalName(Object.keys(profilePicSelect)[4]);
          }}
        >
          <img src={profilePicSelect[5]} width="70px" />
        </button>
        <button
          onClick={() => {
            setSelectedAvatar(profilePicSelect[6]);
            setAnimalName(Object.keys(profilePicSelect)[5]);
          }}
        >
          <img src={profilePicSelect[6]} width="70px" />
        </button>

        {mode === "change-avatar" && (
          <button onClick={() => navigate(-1)}>Back</button>
        )}
        <button
          disabled={selectedAvatar === avatar}
          onClick={() => {
            if (mode === "signup-avatar") {
              saveUserProfile(randomAdj, animalName, selectedAvatar);
              navigate("/profile-setup/signup-username", {
                state: { fromInsideApp: true },
              });
              setMsg("");
            } else {
              setUsername(`${randomAdj} ${animalName}`);
              saveUserProfile(randomAdj, animalName, selectedAvatar);
              setMsg("New profile picture set");
            }
          }}
        >
          {mode === "change-avatar" ? "Select" : "Continue"}
        </button>
      </>
    );
  } else if (isUsernameSelect) {
    return (
      <>
        <p>{msg}</p>
        <p>
          <span>{randomAdj}</span>
          <button onClick={handleShuffle}>Shuffle icon</button>
          {animalName}
        </p>

        {mode === "change-username" ? (
          <button onClick={() => navigate(-1)}>Back</button>
        ) : (
          ""
        )}
        <button
          disabled={randomAdj === newRandomAdj}
          onClick={async () => {
            setUsername(`${randomAdj} ${animalName}`);
            saveUserProfile(randomAdj, animalName);

            if (mode === "signup-username") {
              await signOut(auth);
              console.log("Logged out");
              navigate("/");
            } else {
              setMsg("Username changed");
            }
          }}
        >
          {mode === "change-username" ? "Save Changes" : "Create Account"}
        </button>
      </>
    );
  }
}
