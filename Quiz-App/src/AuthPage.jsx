import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function AuthPage({ msg, setMsg, setLoggedIn }) {
  const { mode } = useParams();
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
      .then(() => {
        const user = auth.currentUser;

        if (!user.emailVerified) {
          setMsg(
            "Please check your inbox and verify your email before continuing"
          );
          return;
        }
        setLoggedIn(true);
        console.log("Logged in successfully");
        navigate("/home");
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
          });
        navigate("/profile-setup/signup-avatar");
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
      .catch((err) => console.error(err.code));
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
  };

  const handleLinkAccount = () => {
    const user = auth.currentUser;

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
          navigate("/profile-setup/signup-avatar");
        })
        .catch((err) => console.error("Error linking account", err));
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
  }, [mode]);

  return (
    <>
      {mode !== "link-account" ? (
        <button type="button" onClick={() => handleGuestLogin()}>
          Continue as Guest
        </button>
      ) : (
        ""
      )}

      {mode !== "link-account" ? <p>or</p> : ""}

      {mode === "link-account" ? (
        <button onClick={() => navigate(-1)}>Back</button>
      ) : (
        ""
      )}

      {mode === "login" ? (
        <h2>Login</h2>
      ) : mode === "signup" ? (
        <h2>Sign Up</h2>
      ) : mode === "password-reset" ? (
        <h2>Password Reset</h2>
      ) : (
        <h2>Link Account</h2>
      )}
      <p>{msg}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.nativeEvent.submitter.id === "login"
            ? handleLogin()
            : e.nativeEvent.submitter.id === "signup"
            ? handleSignUp()
            : e.nativeEvent.submitter.id === "passwordReset"
            ? handlePasswordReset()
            : handleLinkAccount();
        }}
      >
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="email"
          placeholder="Enter you email address"
          ref={emailRef}
          required
        />
        {mode !== "password-reset" ? (
          <>
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              ref={passwordRef}
              required
            />
          </>
        ) : (
          ""
        )}
        {mode === "signup" || mode === "link-account" ? (
          <>
            <label htmlFor="confirmPassword">Confirm Password: </label>
            <input
              id="comfirmPassword"
              type="password"
              placeholder="Enter your password"
              ref={confirmPasswordRef}
              required
            />
          </>
        ) : (
          ""
        )}
        {mode === "login" ? (
          <button id="login" type="submit">
            Login
          </button>
        ) : mode === "signup" || mode === "link-account" ? (
          <button
            id={mode === "signup" ? "signup" : "link-account"}
            type="submit"
          >
            Continue
          </button>
        ) : (
          <button id="passwordReset" type="submit">
            Reset Password
          </button>
        )}
      </form>

      {mode === "login" ? (
        <button type="button" onClick={() => navigate("/password-reset")}>
          Forgot Password?
        </button>
      ) : (
        ""
      )}
      {mode === "login" ? (
        <p>
          Don't have an Account?{" "}
          <button type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </p>
      ) : mode === "link-account" ? (
        ""
      ) : (
        <p>
          Have an Account?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      )}
    </>
  );
}
