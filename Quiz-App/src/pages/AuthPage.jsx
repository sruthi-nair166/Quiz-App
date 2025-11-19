import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import styles from "../styles/AuthPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function AuthPage({
  mode: modeProp,
  msg,
  setMsg,
  loggedIn,
  setLoggedIn,
}) {
  const { mode } = useParams();
  const modeFinal = modeProp || mode;

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    signInAnonymously(auth)
      .then(() => {
        console.log("Logged in as guest");
        navigate("/home");
      })
      .catch((err) => console.error(err));
  };

  const handleLogin = () => {
    setMsg("");
    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then(async () => {
        const user = auth.currentUser;

        if (!user.emailVerified) {
          setMsg(
            <div>
              <p>
                Please check your inbox and verify your email before continuing.
                Didn't receive verification link?
              </p>
              <button
                className="text-bold"
                style={{ color: "var(--purple)", paddingTop: "0.5rem" }}
                onClick={() => {
                  sendEmailVerification(user)
                    .then(() => setMsg("Verification email resent."))
                    .catch((err) =>
                      setMsg("Error sending verification link", err)
                    );
                }}
              >
                Resend Verification Link
              </button>
            </div>
          );
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLoggedIn(true);
          console.log("Logged in successfully");
          navigate("/home");
        } else {
          console.log("redirecting to profile-setup");
          navigate("/profile-setup/signup-avatar", {
            state: { fromInsideApp: true },
          });
        }
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          setMsg("Wrong password");
        } else if (error.code === "auth/invalid-credential") {
          setMsg("Invalid email or password. Please try again");
        } else {
          setMsg(error.message);
        }
      });
    emailRef.current.value = "";
    passwordRef.current.value = "";
  };

  const minLength = 6;
  const hasNumber = /\d/;
  const hasSpecialChar = /[^A-Za-z0-9]/;

  const handleSignUp = () => {
    setMsg("");

    if (
      passwordRef.current.value.length < minLength ||
      !hasNumber.test(passwordRef.current.value) ||
      !hasSpecialChar.test(passwordRef.current.value)
    ) {
      setMsg(
        "Password must be at least 6 characters and include a number and a special character."
      );
      return;
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setMsg("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Account created.");

        sendEmailVerification(user)
          .then(() => {
            console.log("Verification email sent");
            setMsg(
              "Account created. Please check your inbox and verify your email"
            );
          })
          .catch((err) => {
            console.error("Error sending verification email:", err);
            setMsg("Error sending verification email.");
          });
        navigate("/profile-setup/signup-avatar", {
          state: { fromInsideApp: true },
        });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setMsg("This email already exists");
        } else {
          setMsg(error.message);
        }
      });
    emailRef.current.value = "";
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
  };

  const handlePasswordReset = () => {
    setMsg("");
    sendPasswordResetEmail(auth, emailRef.current.value)
      .then(() => {
        setMsg("Email has been sent, please check your inbox");
      })
      .catch((err) => {
        console.error(err.code);
        setMsg("Error changing password.");
      });
    emailRef.current.value = "";
  };

  const handleLinkAccount = () => {
    const user = auth.currentUser;

    if (
      passwordRef.current.value.length < minLength ||
      !hasNumber.test(passwordRef.current.value) ||
      !hasSpecialChar.test(passwordRef.current.value)
    ) {
      setMsg(
        "Password must be at least 6 characters and include a number and a special character."
      );
      return;
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setMsg("Passwords do not match");
      return;
    }

    if (user && user.isAnonymous) {
      const credential = EmailAuthProvider.credential(
        emailRef.current.value,
        passwordRef.current.value
      );

      linkWithCredential(user, credential)
        .then((userCred) => {
          console.log("Account linked");
          setMsg(
            "Account linked successfully. A verification link will be sent if this email can be used. Please check your inbox."
          );

          return sendEmailVerification(userCred.user);
        })
        .then(() => {
          navigate("/profile-setup/signup-avatar", {
            state: { fromInsideApp: true },
          });
        })
        .catch((err) => {
          console.error("Error linking account", err);
          setMsg("Error linking account. Please try a different email.");
        });
    } else {
      console.log("no guest user logged in");
    }
    emailRef.current.value = "";
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
  };

  useEffect(() => {
    setMsg("");
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
  }, [modeFinal]);

  return (
    <div>
      {modeFinal === "link-account" ||
        (loggedIn && (
          <button
            className="back"
            onClick={() => {
              setMsg("");
              navigate(-1);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} color="white" />
          </button>
        ))}
      <div className={styles["auth-wrapper"]}>
        <div className={styles["auth-sub-wrapper"]}>
          {!loggedIn && (
            <>
              <div className={styles["auth-btn-wrapper"]}>
                <button
                  className={styles["auth-btn"]}
                  type="button"
                  onClick={() => handleGuestLogin()}
                >
                  Continue as Guest
                </button>
              </div>
              <p style={{ textAlign: "center", paddingBottom: "0.5rem" }}>or</p>
            </>
          )}

          <div className={styles["form-wrapper"]}>
            {modeFinal === "link-account" ? (
              <h2 className="heading-text" style={{ textAlign: "center" }}>
                Link Account
              </h2>
            ) : modeFinal === "signup" ? (
              <h2 className="heading-text" style={{ textAlign: "center" }}>
                Sign Up
              </h2>
            ) : modeFinal === "password-reset" ? (
              <h2 className="heading-text" style={{ textAlign: "center" }}>
                Password Reset
              </h2>
            ) : (
              <h2 className="heading-text" style={{ textAlign: "center" }}>
                Login
              </h2>
            )}
            <p className="msg text-medium">{msg}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.nativeEvent.submitter.id === "link-account"
                  ? handleLinkAccount()
                  : e.nativeEvent.submitter.id === "signup"
                  ? handleSignUp()
                  : e.nativeEvent.submitter.id === "password-reset"
                  ? handlePasswordReset()
                  : handleLogin();
              }}
            >
              <div className={styles["input-wrapper"]}>
                <label className="block text-medium" htmlFor="email">
                  Email:{" "}
                </label>
                <input
                  className="input block text-medium"
                  id="email"
                  type="email"
                  placeholder="Enter you email address"
                  ref={emailRef}
                  required
                />
              </div>
              {modeFinal !== "password-reset" && (
                <div className={styles["input-wrapper"]}>
                  <label className="block text-medium" htmlFor="password">
                    Password:{" "}
                  </label>
                  <input
                    className="input block text-medium"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    ref={passwordRef}
                    required
                  />
                </div>
              )}

              {(modeFinal === "signup" || modeFinal === "link-account") && (
                <div className={styles["input-wrapper"]}>
                  <label
                    className="block text-medium"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password:{" "}
                  </label>
                  <input
                    className="input block text-medium"
                    id="comfirmPassword"
                    type="password"
                    placeholder="Enter your password"
                    ref={confirmPasswordRef}
                    required
                  />
                </div>
              )}

              {modeFinal === "password-reset" ? (
                <div className={styles["auth-btn-wrapper"]}>
                  <button
                    className={styles["auth-btn"]}
                    id="password-reset"
                    type="submit"
                  >
                    Reset Password
                  </button>
                </div>
              ) : modeFinal === "signup" || modeFinal === "link-account" ? (
                <div className={styles["auth-btn-wrapper"]}>
                  <button
                    className={styles["auth-btn"]}
                    id={modeFinal === "signup" ? "signup" : "link-account"}
                    type="submit"
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className={styles["auth-btn-wrapper"]}>
                  <button
                    id="login"
                    type="submit"
                    className={styles["auth-btn"]}
                  >
                    Login
                  </button>
                </div>
              )}
            </form>

            {modeFinal === "login" && (
              <button
                className={`${styles["forgot-password"]} text-medium`}
                type="button"
                onClick={() => navigate("/auth/password-reset")}
              >
                Forgot Password?
              </button>
            )}

            {loggedIn || modeFinal === "link-account" ? (
              ""
            ) : modeFinal === "signup" || modeFinal === "password-reset" ? (
              <p>
                <span className="text-medium">Have an Account? </span>
                <button
                  style={{ color: "var(--dark-purple)" }}
                  type="button"
                  onClick={() => navigate("/auth/login")}
                >
                  Login
                </button>
              </p>
            ) : (
              <p>
                <span className="text-medium">Don't have an Account? </span>
                <button
                  style={{ color: "var(--dark-purple)" }}
                  type="button"
                  onClick={() => navigate("/auth/signup")}
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
