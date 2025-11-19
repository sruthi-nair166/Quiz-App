import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../firebase.js";
import styles from "../styles/AvatarDisplay.module.css";
import { Menu, Separator } from "@chakra-ui/react";
import { CloseButton, Dialog, Portal, SkeletonCircle } from "@chakra-ui/react";

export default function AvatarDisplay({
  loading,
  setLoading,
  avatar,
  loggedIn,
  setLoggedIn,
}) {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setLoggedIn(false);
        navigate("/auth/login");
        console.log("Logged out successfully");
      })
      .catch((err) => console.err("Error during logout", err));
  };

  if (!authChecked) {
    return <SkeletonCircle size="3rem" />;
  }

  return (
    <>
      {loading && loggedIn ? (
        <SkeletonCircle size="3rem" />
      ) : loggedIn ? (
        <>
          <Menu.Root>
            <Menu.Trigger asChild>
              <button>
                <img src={avatar} className={styles.avatar} />
              </button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="100px" p="1">
                  <Menu.Item value="profile">
                    <button onClick={() => navigate("/profile")}>
                      Profile
                    </button>
                  </Menu.Item>
                  <Separator />
                  <Menu.Item value="settings">
                    <button onClick={() => navigate("/settings")}>
                      Settings
                    </button>
                  </Menu.Item>
                  <Separator />
                  <Menu.Item value="credits">
                    <button onClick={() => navigate("/credits")}>
                      Credits
                    </button>
                  </Menu.Item>
                  <Separator />
                  <Menu.Item value="logout">
                    <button onClick={handleLogout}>Logout</button>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </>
      ) : (
        <>
          <Dialog.Root placement="center" motionPreset="slide-in-bottom">
            <Dialog.Trigger asChild>
              <button className={styles["login-btn"]}>Login</button>
            </Dialog.Trigger>

            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content className="dialog-content">
                  <Dialog.Header>
                    <Dialog.Title asChild>
                      <p>You're currently playing as Guest</p>
                    </Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Description asChild>
                    <p>
                      Do you wish to link your account to save your current
                      progress?
                    </p>
                  </Dialog.Description>

                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <button
                        className="btn"
                        onClick={() => {
                          navigate("/auth/link-account");
                        }}
                      >
                        Link Account
                      </button>
                    </Dialog.ActionTrigger>
                    <Dialog.ActionTrigger asChild>
                      <button
                        className="btn"
                        onClick={() => navigate("/auth/login")}
                      >
                        Start Fresh
                      </button>
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </>
      )}
    </>
  );
}
