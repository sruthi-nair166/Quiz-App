import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { decodeHTML } from "../utils/decodeHTML.js";
import styles from "../styles/AnswersComparison.module.css";
import { Chart, useChart } from "@chakra-ui/charts";
import { Cell, Pie, PieChart } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import titleCaseConverter from "../utils/titleCaseConverter.js";

export default function AnswersComparison({
  questions,
  userAnswers,
  category,
  setCategory,
  subCategory,
  setSubCategory,
}) {
  const navigate = useNavigate();
  const { category: categoryParam, subCategory: subCategoryParam } =
    useParams();
  const location = useLocation();
  const { score } = location.state || {};
  const chart = useChart({
    data: [
      { name: "score", value: score, color: "white" },
      {
        name: "remaining",
        value: questions.length - score,
        color: "#ffffff67",
      },
    ],
  });

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (subCategoryParam) setSubCategory(subCategoryParam);
  }, [categoryParam, subCategoryParam]);

  return (
    <div className={styles["answers-wrapper"]}>
      <div className={styles.header}>
        <h1 className="text-bold" style={{ display: "inline" }}>
          Answer Review
        </h1>
        <button onClick={() => navigate(-1)}>
          <FontAwesomeIcon
            icon={faXmark}
            style={{ position: "absolute", top: "5px", right: "1rem" }}
          />
        </button>
      </div>

      <div className={styles["answers-card"]}>
        <div>
          <p className="uppercase text-small">Quiz Name</p>
          <p className="text-bold">
            {subCategory
              ? titleCaseConverter(subCategory)
              : titleCaseConverter(category)}
          </p>
        </div>
        <div className={styles["score-chart"]}>
          <div style={{ position: "relative" }}>
            <Chart.Root chart={chart} boxSize="80px">
              <PieChart>
                <Pie
                  isAnimationActive={true}
                  data={chart.data}
                  dataKey={chart.key("value")}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={30}
                  outerRadius={40}
                  stroke="none"
                >
                  {chart.data.map((item) => (
                    <Cell key={item.name} fill={chart.color(item.color)} />
                  ))}
                </Pie>
              </PieChart>
            </Chart.Root>
            <p className={styles["score-text"]}>
              <span className="text-bold" style={{ fontSize: "1.3rem" }}>
                {score}
              </span>
              /{questions.length}
            </p>
          </div>
          <p>
            You answered {score} out of {questions.length} questions
          </p>
        </div>
      </div>

      <div className={styles["question-answer-wrapper"]}>
        {questions.map((q, idx) => {
          return (
            <div key={`${idx + 1} ${q.question}`}>
              <div className={styles.question}>
                <div className={styles["question-no"]}>
                  <span
                    className="text-bold"
                    style={{ color: "var(--purple)" }}
                  >
                    {idx + 1}
                  </span>
                </div>

                <p className="text-bold">{decodeHTML(q.question)}</p>
              </div>
              <div className={styles.answers}>
                <div>
                  <span className="uppercase text-small">Your Answer: </span>
                  <span
                    className="text-medium"
                    style={{ paddingRight: "0.5rem" }}
                  >
                    {userAnswers[idx] || "-"}
                  </span>
                </div>

                <div>
                  <span className="uppercase text-small">Correct Answer: </span>
                  <span className="text-medium">
                    {decodeHTML(q["correct_answer"])}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
