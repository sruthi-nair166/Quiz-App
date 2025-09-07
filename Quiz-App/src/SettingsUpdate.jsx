import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
  reload,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export default function SettingsUpdate({ msg, setMsg }) {
  const navigate = useNavigate();
  const { mode, step } = useParams();
  const currentPasswordRef = useRef();
  const newEmailRef = useRef();
  const newPasswordRef = useRef();
  const newPasswordConfirmRef = useRef();
  const [verificationSent, setVerificationSent] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (verificationSent && user === null) {
      setMsg("Email successfully updated. Please log in with your new email.");
      navigate("/login");
    }
  }, [verificationSent, user]);

  const handlePasswordVerification = () => {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPasswordRef.current.value
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        if (mode === "change-email") {
          setMsg("");
          navigate("/update-settings/change-email/update");
        } else {
          setMsg("");
          navigate("/update-settings/change-password/update");
        }
      })
      .catch(() => setMsg("Incorrect password. Please try again."));
    currentPasswordRef.current.value = "";
  };

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
        setVerificationSent(true);
      })
      .catch((err) => {
        setVerificationSent(false);
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

  const handleContinue = async () => {
    if (!verificationSent) return;

    try {
      await reload(user);

      if (newEmailRef.current.value === user.email) {
        await signOut(auth);
      } else {
        setMsg("Please verify your email before continuing.");
      }
    } catch (err) {
      console.log(err);
    }
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
        onClick={() => {
          setMsg("");
          navigate(-1);
        }}
      >
        Back
      </button>
      {step === "verify" ? (
        <>
          <p>{msg}</p>
          <p>Verify your password</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordVerification();
            }}
          >
            <input
              type="password"
              placeholder="Enter current password"
              ref={currentPasswordRef}
              required
            />
            <button type="submit">Continue</button>
          </form>
        </>
      ) : (
        ""
      )}
      {mode === "change-email" && step === "update" ? (
        <>
          <p>{msg}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.nativeEvent.submitter.id === "verification"
                ? handleEmailUpdate()
                : handleContinue();
            }}
          >
            <input
              type="email"
              placeholder="Enter new email"
              ref={newEmailRef}
              required
            />
            {!verificationSent ? (
              <button id="verification" type="submit">
                Send verification link
              </button>
            ) : (
              <button type="submit">Continue to login</button>
            )}
          </form>
          <p>
            Did not receive verification link?{" "}
            <button type="button" onClick={handleEmailUpdate}>
              Resend verification link
            </button>
          </p>
        </>
      ) : (
        ""
      )}
      {mode === "change-password" && step === "update" ? (
        <>
          <p>{msg}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordUpdate();
            }}
          >
            <input
              type="password"
              placeholder="Enter new password"
              ref={newPasswordRef}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              ref={newPasswordConfirmRef}
              required
            />
            <button type="submit">Update Password</button>
          </form>
        </>
      ) : (
        ""
      )}
    </>
  );
}
