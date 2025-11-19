import styles from "../styles/Credits.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Credits() {
  const navigate = useNavigate();

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

      <div className={styles.header}>
        <button
          className="back"
          style={{ left: "10px", color: "white" }}
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <h2 className={`${styles.title} heading-text`}>Credits</h2>
      </div>

      <div className={styles["credits-wrapper"]}>
        <div className={styles["text-wrapper"]}>
          <p
            className="text-medium-2"
            style={{ marginBottom: "2rem", color: "var(--dark-purple)" }}
          >
            This app uses layout inspiration and visual resources sourced from
            the design community and free asset libraries.
          </p>

          <ul>
            <li>
              <span>UI Layout</span>
              <span className="text-bold">
                Illiyin Studio (
                <a
                  href="https://www.figma.com/community/file/1178996093139112052"
                  target="_blank"
                >
                  Figma
                </a>{" "}
                &{" "}
                <a href="https://dribbble.com/illiyinstudio" target="_blank">
                  Dribble
                </a>
                )
              </span>
            </li>
            <li>
              <span>User Avatars</span>
              <span className="text-bold">
                Freepik (
                <a
                  href="https://www.flaticon.com/authors/freepik"
                  target="_blank"
                >
                  Flaticon
                </a>
                )
              </span>
            </li>
          </ul>

          <p style={{ marginBottom: "3rem" }}>
            Illustrations and Icons sourced from{" "}
            <a
              className="text-bold"
              href="https://www.iconfinder.com/"
              target="_blank"
            >
              Iconfinder
            </a>
            ,{" "}
            <a
              className="text-bold"
              href="https://www.flaticon.com/"
              target="_blank"
            >
              Flaticon
            </a>{" "}
            and{" "}
            <a className="text-bold" href="https://undraw.co/" target="_blank">
              Undraw
            </a>
          </p>
          <p style={{ color: "var(--dark-purple)" }}>
            All rights belong to their respective creators.
          </p>
        </div>
      </div>
    </>
  );
}
