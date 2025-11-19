import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faChartSimple,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/BottomNav.module.css";

export default function BottomNav({ loggedIn, setCategory, setSubCategory }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <div className={styles["icons-wrapper"]}>
      <button
        onClick={() => {
          navigate("/home");
        }}
      >
        <FontAwesomeIcon
          icon={faHouse}
          color={currentPath === "/home" ? "#4c3eb9ff" : "#2c0d5888"}
          size="lg"
        />
      </button>

      <button
        onClick={() => {
          setCategory("");
          setSubCategory("");
          navigate("/credits");
        }}
      >
        <FontAwesomeIcon
          icon={faCircleInfo}
          size="lg"
          color={currentPath === "/random" ? "#4c3eb9ff" : "#4c3eb983"}
        />
      </button>

      {loggedIn ? (
        <button
          onClick={() => {
            navigate("/profile");
          }}
        >
          <FontAwesomeIcon
            icon={faUser}
            size="lg"
            color={currentPath === "/profile" ? "#4c3eb9ff" : "#4c3eb983"}
          />
        </button>
      ) : (
        <button
          onClick={() => {
            navigate("/profile");
          }}
        >
          <FontAwesomeIcon
            icon={faChartSimple}
            size="lg"
            color={currentPath === "/profile" ? "#4c3eb9ff" : "#4c3eb983"}
          />
        </button>
      )}
    </div>
  );
}
