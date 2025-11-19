import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { uniqueNamesGenerator, adjectives } from "unique-names-generator";
import profilePicSelect from "../data/ProfilePicSelect";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../styles/ProfileSetup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import titleCaseConverter from "../utils/titleCaseConverter";
import { CloseButton, Dialog, Portal, Skeleton } from "@chakra-ui/react";

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
  const [nameLoading, setNameLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(msg ? true : false);
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

          const adj =
            data?.adj ||
            uniqueNamesGenerator({
              dictionaries: [adjectives],
              length: 1,
            });

          const animal = data?.animal || "";

          setRandomAdj(adj);
          setNewRandomAdj(adj);

          setAnimalName(animal);
          setUsername(`${data.adj} ${data.animal}`);

          setAvatar(data.avatar || null);
          setSelectedAvatar(data.avatar || null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }

      setNameLoading(true);
      const timeout = setTimeout(() => setNameLoading(false), 2000);
      return () => clearTimeout(timeout);
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
        <Dialog.Root
          placement="center"
          motionPreset="slide-in-bottom"
          open={openDialog}
          onOpenChange={(isOpen) => {
            if (isOpen) setOpenDialog(isOpen.openDialog);
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className="dialog-content">
                <Dialog.Body asChild>
                  <p>{msg}</p>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60px",
            position: "relative",
          }}
        >
          {mode === "change-avatar" && (
            <button
              className="back"
              style={{ left: 0, color: "white" }}
              onClick={() => {
                setMsg("");
                navigate(-1);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>
          )}
          <h1
            className="heading-text"
            style={{
              color: "white",
              display: "inline",
            }}
          >
            Select an avatar
          </h1>
        </div>

        <div className={styles["select-wrapper"]}>
          <div className={styles["avatar-wrapper"]}>
            {Object.entries(profilePicSelect).map(([key, value]) => (
              <button
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
                key={`${key}-${value}`}
                onClick={() => {
                  setSelectedAvatar(value);
                  setAnimalName(key);
                }}
              >
                <img
                  style={{
                    outline:
                      selectedAvatar === value ? "7px solid var(--purple)" : "",
                    borderRadius: "50%",
                  }}
                  src={value}
                  className={styles.avatar}
                />
              </button>
            ))}
          </div>

          <button
            className={styles["select-avatar-btn"]}
            disabled={selectedAvatar === avatar}
            onClick={() => {
              if (mode === "signup-avatar") {
                saveUserProfile(randomAdj, animalName, selectedAvatar);
                navigate("/profile-setup/signup-username", {
                  state: { fromInsideApp: true },
                });
                setMsg("");
              } else {
                console.log("Saving profile...");
                setUsername(`${randomAdj} ${animalName}`);
                saveUserProfile(randomAdj, animalName, selectedAvatar);
                setTimeout(() => {
                  console.log("Setting message");
                  setMsg("New profile picture set");
                }, 300);
              }
            }}
          >
            {mode === "change-avatar" ? "Select" : "Continue"}
          </button>
          <footer style={{ textAlign: "center" }}>
            <a
              className={`${styles.credit} text-small`}
              href="https://www.flaticon.com/free-icons/animals"
              title="animals icons"
              target="_blank"
            >
              Animals icons created by Freepik - Flaticon
            </a>
          </footer>
        </div>
      </>
    );
  } else if (isUsernameSelect) {
    return (
      <>
        <Dialog.Root
          placement="center"
          motionPreset="slide-in-bottom"
          open={openDialog}
          onOpenChange={(isOpen) => {
            if (isOpen) setOpenDialog(isOpen.openDialog);
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className="dialog-content">
                <Dialog.Body asChild>
                  <p>{msg}</p>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        {mode === "change-username" && (
          <button
            className="back"
            style={{ color: "white" }}
            onClick={() => {
              navigate(-1);
              setMsg("");
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
        )}

        <div className={styles["select-wrapper"]}>
          <h1
            style={{ color: "white", paddingBottom: "1rem" }}
            className="heading-text"
          >
            Choose your vibe
          </h1>
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem",
              borderRadius: "1rem",
              maxWidth: "450px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <p className={styles["username-wrapper"]}>
              <span className={styles.adj}>
                {titleCaseConverter(randomAdj)}
              </span>
              <button onClick={handleShuffle}>
                <FontAwesomeIcon
                  icon={faDice}
                  size="lg"
                  color="var(--dark-purple)"
                />
              </button>
              {nameLoading ? (
                <Skeleton height="1.5rem" width="5rem" borderRadius="8px" />
              ) : (
                <span>{titleCaseConverter(animalName)}</span>
              )}
            </p>

            <button
              style={{
                width: "100%",
                backgroundColor:
                  mode !== "signup-username" &&
                  randomAdj === newRandomAdj &&
                  "var(--hover-purple)",
                cursor:
                  mode !== "signup-username" &&
                  randomAdj === newRandomAdj &&
                  "auto",
              }}
              className="btn"
              disabled={
                mode !== "signup-username" && randomAdj === newRandomAdj
              }
              onClick={async () => {
                setUsername(`${randomAdj} ${animalName}`);
                saveUserProfile(randomAdj, animalName);

                if (mode === "signup-username") {
                  if (!user.emailVerified) {
                    await signOut(auth);
                    console.log("Logged out");
                    navigate("/");
                  } else {
                    console.log(
                      "Email is already verified, redirecting to home"
                    );
                    navigate("/home");
                  }
                } else {
                  setMsg("Username changed");
                }
              }}
            >
              {mode === "change-username" ? "Save Changes" : "Create Account"}
            </button>
          </div>
        </div>
      </>
    );
  }
}
