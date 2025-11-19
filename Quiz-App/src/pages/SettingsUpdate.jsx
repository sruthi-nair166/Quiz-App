import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase.js";
import styles from "../styles/AuthPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function SettingsUpdate({ msg, setMsg }) {
  const navigate = useNavigate();
  const { mode, step } = useParams();
  const currentPasswordRef = useRef();
  const newEmailRef = useRef();
  const newPasswordRef = useRef();
  const newPasswordConfirmRef = useRef();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  const handlePasswordVerification = () => {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPasswordRef.current.value
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        if (mode === "change-email") {
          setMsg("");
          navigate("/update-settings/change-email/update", {
            state: { fromInsideApp: true },
          });
        } else {
          setMsg("");
          navigate("/update-settings/change-password/update", {
            state: { fromInsideApp: true },
          });
        }
      })
      .catch(() => setMsg("Incorrect password. Please try again."));
    currentPasswordRef.current.value = "";
  };

  useEffect(() => {
    if (user === null) {
      setMsg("Email successfully updated. Redirecting to login...");
      const timer = setTimeout(() => navigate("/auth/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleEmailUpdate = () => {
    if (newEmailRef.current.value === user.email) {
      setMsg("This is your current email.");
      return;
    }

    verifyBeforeUpdateEmail(user, newEmailRef.current.value)
      .then(() => {
        setMsg(
          "A verification link will be sent if this email can be used. Please check your inbox to complete updating email."
        );

        setTimeout(() => {
          setMsg(
            "After verification, refresh the page to log in with your new account."
          );
        }, 10000);
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/email-already-in-use") {
          setMsg("This email already exists");
        } else if (err.code === "auth/operation-not-allowed") {
          setMsg("Error updating email.");
        } else {
          setMsg(err.message);
        }
      });
    newEmailRef.current.value = "";
  };

  const minLength = 6;
  const hasNumber = /\d/;
  const hasSpecialChar = /[^A-Za-z0-9]/;

  const handlePasswordUpdate = () => {
    if (
      newPasswordRef.current.value.length < minLength ||
      !hasNumber.test(newPasswordRef.current.value) ||
      !hasSpecialChar.test(newPasswordRef.current.value)
    ) {
      setMsg(
        "Password must be at least 6 characters and include a number and a special character."
      );
      newPasswordRef.current.value = "";
      newPasswordConfirmRef.current.value = "";
      return;
    }

    if (newPasswordRef.current.value !== newPasswordConfirmRef.current.value) {
      setMsg("Passwords do not match");
      newPasswordRef.current.value = "";
      newPasswordConfirmRef.current.value = "";
      return;
    }

    updatePassword(user, newPasswordRef.current.value)
      .then(() => setMsg("Password changed successfully"))
      .catch((error) => setMsg(error.message));

    newPasswordRef.current.value = "";
    newPasswordConfirmRef.current.value = "";
  };

  return (
    <>
      <button
        className="back"
        style={{ color: "white" }}
        onClick={() => {
          setMsg("");
          navigate(-1);
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className={styles["auth-wrapper"]}>
        {step === "verify" && (
          <div className={styles["auth-sub-wrapper"]}>
            <h1 className="heading-text" style={{ textAlign: "center" }}>
              Verify your password
            </h1>
            <p className="msg text-medium">{msg}</p>
            <form
              className={styles["form-wrapper"]}
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordVerification();
              }}
            >
              <div className={styles["input-wrapper"]}>
                <label className="text-medium" htmlFor="currentPassword">
                  Enter current password:
                </label>
                <input
                  id="currentPassword"
                  className="input block text-medium"
                  type="password"
                  placeholder="Enter current password"
                  ref={currentPasswordRef}
                  required
                />
              </div>
              <button
                style={{ paddingTop: "0.5rem", paddingBottom: "0" }}
                className={`${styles["forgot-password"]} text-medium`}
                type="button"
                onClick={() => navigate("/auth/password-reset")}
              >
                Forgot Password?
              </button>
              <div className={styles["auth-btn-wrapper"]}>
                <button className={styles["auth-btn"]} type="submit">
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === "change-email" && step === "update" && (
          <div className={styles["auth-sub-wrapper"]}>
            <h1 className="heading-text" style={{ textAlign: "center" }}>
              Set your new email
            </h1>
            <p className="msg text-medium">{msg}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEmailUpdate();
              }}
            >
              <div className={styles["input-wrapper"]}>
                <label className="text-medium" htmlFor="newEmail">
                  Enter new email:
                </label>
                <input
                  className="input block text-medium"
                  id="newEmail"
                  type="email"
                  placeholder="Enter new email"
                  ref={newEmailRef}
                  required
                />
              </div>
              <div className={styles["auth-btn-wrapper"]}>
                <button className={styles["auth-btn"]} type="submit">
                  Send verification link
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === "change-password" && step === "update" && (
          <div className={styles["auth-sub-wrapper"]}>
            <h1 className="heading-text" style={{ textAlign: "center" }}>
              Set your new password
            </h1>
            <p className=" text-medium">{msg}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordUpdate();
              }}
            >
              <div className={styles["form-wrapper"]}>
                <div className={styles["input-wrapper"]}>
                  <label className="text-medium" htmlFor="newPassword">
                    Enter new password:
                  </label>
                  <input
                    className="input block text-medium"
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    ref={newPasswordRef}
                    required
                  />
                </div>
                <div className={styles["input-wrapper"]}>
                  <label className="text-medium">Confirm new password:</label>
                  <input
                    className="input block text-medium"
                    id="confirmNewPassword"
                    type="password"
                    placeholder="Confirm new password"
                    ref={newPasswordConfirmRef}
                    required
                  />
                </div>
              </div>
              <div className={styles["auth-btn-wrapper"]}>
                <button className={styles["auth-btn"]} type="submit">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
