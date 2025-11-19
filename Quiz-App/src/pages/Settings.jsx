import { useEffect, useState } from "react";
import { auth, db } from "../firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Settings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import titleCaseConverter from "../utils/titleCaseConverter.js";

export default function Settings({
  username,
  setUsername,
  avatar,
  setAvatar,
  setLoggedIn,
  msg,
  setMsg,
}) {
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

      try {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(`${data.adj} ${data.animal}` || "");
          setAvatar(data.avatar || null);
          setLoggedIn(true);
        } else {
          setUser(null);
          setUsername(null);
          setAvatar(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleClearData = () => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    const attemptsRef = collection(db, "users", user.uid, "quizAttempts");

    getDocs(attemptsRef)
      .then((snapshot) => {
        const batchDeletes = snapshot.docs.map((docSnap) =>
          deleteDoc(doc(db, "users", user.uid, "quizAttempts", docSnap.id))
        );

        return Promise.all(batchDeletes);
      })
      .then(() => {
        return getDoc(docRef);
      })
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          const preservedData = {
            adj: data.adj || "",
            animal: data.animal || "",
            avatar: data.avatar || null,
          };
          return setDoc(docRef, preservedData);
        }
      })
      .then(() => setMsg("Your progress and other data have been cleared."))
      .catch((err) => setMsg(`Error clearing account: ${err}`));
  };

  const handleDeleteData = () => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    deleteDoc(docRef).then(() => {
      console.log("User data cleared");
    });

    deleteUser(user)
      .then(() => {
        console.log("Your account has been deleted");
        navigate("/");
      })
      .catch((err) => {
        if (err.code === "auth/requires-recent-login") {
          signOut(auth).then(() => {
            setMsg(
              <>
                Please log in again to be able to delete your account
                <button onClick={() => navigate("/")}>Login</button>
              </>
            );
          });
        } else {
          setMsg(`Error deleting account: ${err}`);
        }
      });
  };

  return (
    <>
      <button
        onClick={() => navigate("/home")}
        className="hide-on-mobile"
        style={{
          position: "relative",
          top: "10px",
          left: "15px",
          paddingBottom: "15px",
        }}
      >
        <img src="favicon_invert.png" alt="" style={{ width: "50px" }} />
      </button>

      <div className={styles["settings-wrapper"]}>
        <div className={styles.header}>
          <button
            className="back"
            style={{ left: "10px", color: "white" }}
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <h2 className={`${styles.title} heading-text`}>Settings</h2>
        </div>

        <div
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "1rem",
          }}
        >
          <button
            className={styles["btn-flex"]}
            onClick={() => {
              navigate("/profile-setup/change-username", {
                state: { fromInsideApp: true },
              });
            }}
          >
            <span>Username</span>{" "}
            <span className="text-medium" style={{ color: "grey" }}>
              {titleCaseConverter(username)}
              <FontAwesomeIcon
                icon={faChevronRight}
                color="var(--dark-purple)"
              />
            </span>
          </button>
          <button
            className={styles["btn-flex"]}
            onClick={() => {
              navigate("/profile-setup/change-avatar", {
                state: { fromInsideApp: true },
              });
            }}
          >
            <span>Avatar</span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <img src={avatar} width="30px" style={{ borderRadius: "50%" }} />
              <FontAwesomeIcon
                icon={faChevronRight}
                color="var(--dark-purple)"
              />
            </span>
          </button>
          <button
            className={styles["btn-flex"]}
            onClick={() => {
              setMsg("");
              navigate("/update-settings/change-email/verify", {
                state: { fromInsideApp: true },
              });
            }}
          >
            <span>Email</span>{" "}
            <span style={{ color: "grey" }} className="text-medium">
              {user ? `${user.email.slice(0, 17)}...` : "Loading..."}{" "}
              <FontAwesomeIcon
                icon={faChevronRight}
                color="var(--dark-purple)"
              />
            </span>
          </button>
          <button
            className={styles["btn-flex"]}
            onClick={() => {
              setMsg("");
              navigate("/update-settings/change-password/verify", {
                state: { fromInsideApp: true },
              });
            }}
          >
            Password
            <FontAwesomeIcon icon={faChevronRight} color="var(--dark-purple)" />
          </button>

          <Dialog.Root
            role="alertdialog"
            placement="center"
            motionPreset="slide-in-bottom"
          >
            <Dialog.Trigger asChild>
              <button className={styles["btn-flex"]}>
                Clear Data{" "}
                <FontAwesomeIcon
                  icon={faChevronRight}
                  color="var(--dark-purple)"
                />
              </button>
            </Dialog.Trigger>

            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content className="dialog-content">
                  <Dialog.Header asChild>
                    <Dialog.Title>Warning!</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    Choosing the following will clear all your progress. Do you
                    still want to proceed?
                  </Dialog.Body>

                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <button className="btn">Cancel</button>
                    </Dialog.ActionTrigger>
                    <Dialog.ActionTrigger asChild>
                      <button
                        className="btn"
                        onClick={() => {
                          handleClearData();
                          setMsg("");
                        }}
                      >
                        Clear Data
                      </button>
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

          <Dialog.Root
            role="alertdialog"
            placement="center"
            motionPreset="slide-in-bottom"
          >
            <Dialog.Trigger asChild>
              <button className={styles["btn-flex"]}>
                Delete Account{" "}
                <FontAwesomeIcon
                  icon={faChevronRight}
                  color="var(--dark-purple)"
                />
              </button>
            </Dialog.Trigger>

            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content className="dialog-content">
                  <Dialog.Body className="text-bold">
                    Are you sure you want to delete your account?
                  </Dialog.Body>

                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <button className="btn">Cancel</button>
                    </Dialog.ActionTrigger>
                    <Dialog.ActionTrigger asChild>
                      <button
                        className="btn"
                        onClick={() => {
                          setLoggedIn(false);
                          setMsg("Account has been deleted.");
                          handleDeleteData();
                        }}
                      >
                        Delete
                      </button>
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

          <button
            style={{ border: "none" }}
            className={styles["btn-flex"]}
            onClick={handleLogout}
          >
            Logout{" "}
            <FontAwesomeIcon
              icon={faRightFromBracket}
              color="var(--dark-purple)"
            />
          </button>
        </div>

        <Dialog.Root
          placement="center"
          motionPreset="slide-in-bottom"
          open={msg}
          onOpenChange={(isOpen) => {
            if (isOpen) setMsg(isOpen.msg);
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className="dialog-content">
                <Dialog.Body>{msg}</Dialog.Body>
                <Dialog.CloseTrigger>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </div>
    </>
  );
}
