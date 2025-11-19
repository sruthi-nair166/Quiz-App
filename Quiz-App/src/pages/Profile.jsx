import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import badgeDetails from "../data/badgeDetails";
import BottomNav from "../components/BottomNav.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Profile.module.css";
import {
  HStack,
  Portal,
  Box,
  Text,
  Separator,
  Select,
  createListCollection,
  SelectIndicator,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import titleCaseConverter from "../utils/titleCaseConverter.js";
import categories from "../data/categories.js";
import BadgeDialog from "../components/BadgeDialog.jsx";

export default function Profile({
  avatar,
  setAvatar,
  username,
  setUsername,
  loggedIn,
  setLoggedIn,
  setCategory,
  setSubCategory,
}) {
  const [tab, setTab] = useState("details");
  const [profileLoading, setProfileLoading] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [monthLoading, setMonthLoading] = useState(true);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);
  const [timeRange, setTimeRange] = useState("monthly");
  const [badgesCollection, setBadgesCollection] = useState({});
  const [openBadge, setOpenBadge] = useState(false);
  const [badgeTitle, setBadgeTitle] = useState(null);
  const [badgeSubtitle, setBadgeSubtitle] = useState(null);
  const [badgeUrl, setBadgeUrl] = useState(null);
  const [badgeDesc, setBadgeDesc] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0));

  const navigate = useNavigate();

  const frameworks = createListCollection({
    items: [
      { label: "Monthly", value: "monthly" },
      { label: "Yearly", value: "yearly" },
    ],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.isAnonymous ? setLoggedIn(false) : setLoggedIn(true);

        const docRef = doc(db, "users", user.uid);

        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();

              setAvatar(data.avatar || null);
              setUsername(`${data.adj} ${data.animal}` || "");

              setPlayerScore(data.totalScore);
              setPlayerWins(data.totalWon);
              setBadgesCollection(data.badges || {});
            }
          })
          .catch((err) => console.error("Error fetching user doc:", err));
      } else {
        setLoggedIn(false);
        setUsername("");
        console.log("Guest");
      }

      const timeoutId = setTimeout(() => {
        setProfileLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCategoryStats = () => {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            const statsMap = data.categoryStats || {};
            const statsArray = Object.entries(statsMap).map(([key, value]) => ({
              category: key,
              percent: Math.round((value.score / value.questions) * 100),
            }));

            setCategoryStats(statsArray);
          }
        })
        .catch((err) => console.error("Error fetching category stats:", err));
    };

    fetchCategoryStats();
  }, []);

  const palette = [
    "#FBF8CC",
    "#FDE4CF",
    "#FFCFD2",
    "#F1C0E8",
    "#CFBAF0",
    "#A3C4F3",
    "#90DBF4",
    "#8EECF5",
    "#98F5E1",
    "#B9FBC0",
    "#d8e2dc",
    "#f3d8c7",
  ];

  const categoryList = [];

  Object.keys(categories).forEach((key) => {
    if (typeof categories[key] === "number") {
      categoryList.push(key);
    } else {
      Object.keys(categories[key]).forEach((subKey) => {
        categoryList.push(subKey);
      });
    }
  });

  const chartData = categoryList.map((c, i) => ({
    type: titleCaseConverter(c),
    color: palette[i],
    allocation: categoryStats.find((cs) => cs.category === c)?.percent || 0,
  }));

  const chart = useChart({
    data: chartData,
    series: [{ name: "allocation" }],
  });

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const qMonth = query(
          collection(db, "users", user.uid, "quizAttempts"),
          where("date", ">=", startOfTheMonth())
        );
        const snapMonth = await getDocs(qMonth);
        setMonthCount(snapMonth.size);

        const qYear = query(
          collection(db, "users", user.uid, "quizAttempts"),
          where("date", ">=", startOfTheYear())
        );
        const snapYear = await getDocs(qYear);
        setYearCount(snapYear.size);

        const attempts = snapYear.docs.map((doc) => doc.data());
        const counts = Array(12).fill(0);

        attempts.forEach((attempt) => {
          const date = attempt.date.toDate();
          const month = date.getMonth();
          counts[month]++;
        });

        setMonthlyCounts(counts);
      } catch (err) {
        console.error("Error fetching quiz attempt counts:", err);
      }
      setMonthLoading(false);
    };

    fetchData();
  }, [user]);

  function startOfTheMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return Timestamp.fromDate(start);
  }

  function startOfTheYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Timestamp.fromDate(start);
  }

  const lineChartData = monthlyCounts.map((count, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    quizzes: count,
  }));

  const lineChart = useChart({
    data: lineChartData,
    series: [{ name: "quizzes", color: "black" }],
  });

  const phrases = [
    "You're on a roll🔥",
    "You dropped this👑",
    "Keep up the pace⚡",
    "You're flying through these🚀",
    "Momentum’s your middle name⚙️",
    "You're crushing it 💪🏼",
    "All hail the champion🏆",
    "Knowledge is your superpower💡",
    "Legend in progress🏅",
  ];

  const randomPhraseRef = useRef(
    phrases[Math.floor(Math.random() * phrases.length)]
  );

  const randomPhrase = randomPhraseRef.current;

  const images = [
    "/illustrations/decorative_img_1.jpg",
    "/illustrations/decorative_img_2.jpg",
    "/illustrations/decorative_img_3.jpg",
    "/illustrations/decorative_img_4.jpg",
    "/illustrations/decorative_img_5.jpg",
    "/illustrations/decorative_img_6.jpg",
    "/illustrations/decorative_img_7.jpg",
    "/illustrations/decorative_img_8.jpg",
    "/illustrations/decorative_img_9.jpg",
  ];

  const randomImageRef = useRef(
    images[Math.floor(Math.random() * images.length)]
  );

  const randomImage = randomImageRef.current;

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
        <button style={{ color: "white" }} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        {loggedIn && (
          <button onClick={() => navigate("/settings")}>
            <FontAwesomeIcon icon={faGear} color="white" />
          </button>
        )}
      </div>

      <div className={styles["profile-wrapper"]}>
        {profileLoading ? (
          <>
            {loggedIn ? (
              <Stack position="relative" align="center" width="10rem">
                <div className={styles["avatar-wrapper"]}>
                  <SkeletonCircle className={styles.avatar} />

                  <Skeleton
                    height="1.5rem"
                    width="15rem"
                    borderRadius="8px"
                    mt="0.3rem"
                    mb="-4rem"
                  />
                </div>
              </Stack>
            ) : (
              <Stack align="center" gap="0.5rem" width="100%">
                <Skeleton
                  height="1.5rem"
                  width="20rem"
                  borderRadius="8px"
                  mt="0.5rem"
                />
              </Stack>
            )}
          </>
        ) : loggedIn ? (
          <div className={styles["avatar-wrapper"]}>
            <img src={avatar} className={styles.avatar} alt="" />
            <p
              className="heading-text"
              style={{
                textAlign: "center",
                marginTop: "0.3rem",
                whiteSpace: "nowrap",
              }}
            >
              {titleCaseConverter(username)}
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center", paddingBottom: "1rem" }}>
            Guest progress may be lost.{" "}
            <button
              className="text-bold"
              style={{ color: "var(--dark-purple)" }}
              onClick={() => navigate("/auth/link-account")}
            >
              Link
            </button>{" "}
            your account to keep your data safe.
          </p>
        )}

        <div
          className={styles["points-card"]}
          style={{
            marginTop: loggedIn ? "5rem" : "",
          }}
        >
          <p className={styles["points-card-text"]}>
            <FontAwesomeIcon icon={faStar} style={{ padding: "0.5rem" }} />
            <span className="uppercase text-small">Points</span>{" "}
            <span className="text-bold" style={{ fontSize: "1.1rem" }}>
              {playerScore || 0}
            </span>
          </p>
          <Separator orientation="vertical" height="10" />
          <p className={styles["points-card-text"]}>
            <FontAwesomeIcon icon={faTrophy} style={{ padding: "0.5rem" }} />
            <span className="uppercase text-small">Quizzes Won</span>{" "}
            <span className="text-bold" style={{ fontSize: "1.1rem" }}>
              {playerWins || 0}
            </span>
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${
              tab === "details" ? styles["selected-tab"] : ""
            } text-medium`}
            onClick={() => setTab("details")}
          >
            Details
          </button>
          <button
            className={`${
              tab === "stats" ? styles["selected-tab"] : ""
            } text-medium`}
            onClick={() => setTab("stats")}
          >
            Stats
          </button>
          <button
            className={`${
              tab === "badges" ? styles["selected-tab"] : ""
            } text-medium`}
            onClick={() => setTab("badges")}
          >
            Badges
          </button>
        </div>

        {tab === "details" && (
          <div className={styles["details-wrapper"]}>
            <Box display="flex" justifyContent="flex-end" width="100%">
              <Select.Root
                collection={frameworks}
                size="sm"
                width="80px"
                value={[timeRange]}
                onValueChange={(e) => setTimeRange(e.value[0])}
                borderRadius="lg"
                border="1px solid"
                borderColor="var(--dark-purple)"
                px={1}
              >
                <Select.HiddenSelect />

                <Select.Control>
                  <Select.Trigger minH="20px" px={1}>
                    <Select.ValueText
                      className="text-small"
                      placeholder="Monthly"
                    />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <SelectIndicator color="var(--dark-purple)" />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {frameworks.items.map((framework) => (
                        <Select.Item item={framework} key={framework.value}>
                          {framework.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>

            {timeRange === "monthly" ? (
              monthLoading ? (
                <Stack gap="0.5rem" margin="1rem">
                  <SkeletonText noOfLines={2} />
                  <Skeleton height="250px" width="300px" />
                  <SkeletonText noOfLines={1} />
                </Stack>
              ) : (
                <>
                  <p
                    style={{ color: "var(--purple)" }}
                    className="text-medium-2 text-bold"
                  >
                    {monthCount} quizzes
                  </p>
                  <p className="text-medium-2 text-bold">played this month</p>

                  {monthCount !== 0 && (
                    <>
                      <div className={styles["image-wrapper"]}>
                        <img
                          src={randomImage}
                          alt=""
                          width="300px"
                          height="300px"
                        />
                      </div>

                      <p>{randomPhrase}</p>
                    </>
                  )}
                </>
              )
            ) : (
              <>
                <p style={{ padding: "1rem" }}>
                  <span
                    className="text-bold"
                    style={{ color: "var(--purple)" }}
                  >
                    {yearCount} quizzes
                  </span>{" "}
                  played this year{yearCount !== 0 && "🎉"}
                </p>
                <Chart.Root chart={lineChart}>
                  <LineChart data={lineChart.data}>
                    <CartesianGrid
                      stroke={chart.color("border")}
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      tickLine={false}
                      dataKey={lineChart.key("month")}
                      stroke={chart.color("border")}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      stroke={chart.color("border")}
                      width={10}
                    />
                    <Tooltip
                      cursor={false}
                      animationDuration={100}
                      formatter={(value) => [value, "Quizzes"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                      }}
                    />
                    {lineChart.series.map((item) => (
                      <Line
                        key={item.name}
                        isAnimationActive={false}
                        dataKey={lineChart.key(item.name)}
                        stroke={lineChart.color(item.color)}
                        strokeWidth={1}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </Chart.Root>
              </>
            )}
          </div>
        )}

        {tab === "stats" && (
          <div className={styles["chart-wrapper"]}>
            <p
              className="text-bold"
              style={{ color: "white", paddingLeft: "0.5rem" }}
            >
              Top Performance by Quiz Category
            </p>
            <div style={{ padding: "0.5rem 0 0 0" }}>
              <Box
                w="100%"
                overflowX="auto"
                css={{
                  /* Chrome, Edge, Safari */
                  "&::-webkit-scrollbar": {
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ffffff80;",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#ffffff1a",
                  },
                  /* Firefox */
                  scrollbarWidth: "thin",
                  scrollbarColor: "#ffffff80 #ffffff1a",
                }}
                pb="0.5rem"
              >
                <HStack>
                  {chartData.map((entry) => (
                    <HStack key={entry.type}>
                      <Box
                        w="8px"
                        h="8px"
                        bg={entry.color}
                        borderRadius="50%"
                        flexShrink={0}
                      />
                      <Text color="white" fontSize="10px">
                        {entry.type}
                      </Text>
                    </HStack>
                  ))}
                </HStack>
              </Box>
              <Box
                w="100%"
                overflowX="auto"
                css={{
                  /* Chrome, Edge, Safari */
                  "&::-webkit-scrollbar": {
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ffffff80;",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#ffffff1a",
                  },
                  /* Firefox */
                  scrollbarWidth: "thin",
                  scrollbarColor: "#ffffff80 #ffffff1a",
                }}
              >
                <Chart.Root
                  chart={chart}
                  w={`${chartData.length * 60}px`}
                  h="230px"
                >
                  <BarChart data={chart.data} barCategoryGap="30%">
                    <CartesianGrid
                      stroke="#A097EC"
                      strokeDasharray="6 6"
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      dataKey={chart.key("type")}
                    />
                    <YAxis
                      width={30}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      tick={({ x, y, payload }) => (
                        <text
                          x={x}
                          y={y}
                          dy={4}
                          textAnchor="end"
                          fontSize={12}
                          style={{ fill: "white" }}
                        >
                          {`${payload.value}%`}
                        </text>
                      )}
                    />
                    <Tooltip
                      cursor={{ fill: "#ffffff4d" }}
                      animationDuration={100}
                      formatter={(value) => [`${value}%`, "score"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                      }}
                    />

                    {chart.series.map((item) => (
                      <Bar
                        key={item.name}
                        dataKey={chart.key(item.name)}
                        isAnimationActive={false}
                        radius={3}
                      >
                        {chartData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    ))}
                  </BarChart>
                </Chart.Root>
              </Box>
            </div>
          </div>
        )}

        {tab === "badges" && (
          <div style={{ paddingBottom: "60px", overflowY: "auto" }}>
            <div className={styles["badge-wrapper"]}>
              {badgeDetails.map((value) => {
                if ("condition" in value) {
                  const isLocked = !badgesCollection[value.title];
                  return (
                    <div
                      className={styles["badge-button-wrapper"]}
                      key={`${value.title} ${value.subtitle || ""} wrapper`}
                    >
                      <button
                        style={{
                          background: value.url.outer,
                          position: "relative",
                        }}
                        className={styles["badge-buttons"]}
                        key={`${value.title} ${value.subtitle || ""}`}
                        onClick={() => {
                          setOpenBadge("open");
                          setBadgeTitle(value.title || "");
                          setBadgeSubtitle(value.subtitle || "");
                          setBadgeUrl(value.url || "");
                          setBadgeDesc(
                            badgesCollection[value.title]
                              ? value.winDesc
                              : value.desc
                          );
                        }}
                      >
                        <div
                          className={styles["icon-wrapper"]}
                          style={{
                            background: value.url.inner,
                          }}
                        >
                          <value.url.component className={styles.icon} />
                        </div>
                        {isLocked && (
                          <div className={styles["lock-wrapper"]}>
                            <FontAwesomeIcon
                              icon={faLock}
                              className={styles.lock}
                            />
                          </div>
                        )}
                      </button>
                      <p
                        className={styles["badge-text"]}
                        style={{
                          color: isLocked ? "grey" : "black",
                          paddingTop: "0.5rem",
                        }}
                      >
                        {titleCaseConverter(value.title)}
                      </p>
                    </div>
                  );
                } else {
                  return Object.values(value).map((v) => {
                    const isLocked =
                      !badgesCollection[value.title]?.[v.subtitle];
                    return (
                      <>
                        {typeof v !== "object" ? (
                          <p className={styles["badge-title"]}>{value.title}</p>
                        ) : (
                          <div
                            className={styles["badge-button-wrapper"]}
                            key={`${value.title} ${v.subtitle || ""} wrapper`}
                          >
                            <button
                              className={styles["badge-buttons"]}
                              style={{
                                backgroundColor: v.url.outer,
                                position: "relative",
                              }}
                              key={`${value.title} ${v.subtitle || ""}`}
                              onClick={() => {
                                setOpenBadge("open");
                                setBadgeTitle(value.title || "");
                                setBadgeSubtitle(v.subtitle || "");
                                setBadgeUrl(v.url || "");
                                setBadgeDesc(
                                  badgesCollection[value.title]?.[v.subtitle]
                                    ? v.winDesc
                                    : v.desc
                                );
                              }}
                            >
                              <div
                                className={styles["icon-wrapper"]}
                                style={{
                                  background: v.url.inner,
                                }}
                              >
                                <v.url.component className={styles.icon} />
                              </div>
                              {isLocked && (
                                <div className={styles["lock-wrapper"]}>
                                  <FontAwesomeIcon
                                    icon={faLock}
                                    className={styles.lock}
                                  />
                                </div>
                              )}
                            </button>
                            <p
                              className={styles["badge-text"]}
                              style={{
                                color: isLocked ? "grey" : "black",
                                paddingTop: "0.5rem",
                              }}
                            >
                              {titleCaseConverter(v.subtitle)}
                            </p>
                          </div>
                        )}
                      </>
                    );
                  });
                }
              })}
            </div>

            <BadgeDialog
              openBadge={openBadge}
              setOpenBadge={setOpenBadge}
              badgeTitle={badgeTitle}
              badgeSubtitle={badgeSubtitle}
              badgeUrl={badgeUrl}
              badgeDesc={badgeDesc}
            />
          </div>
        )}
        <div className="hide-on-desktop">
          <BottomNav
            loggedIn={loggedIn}
            setCategory={setCategory}
            setSubCategory={setSubCategory}
          />
        </div>
      </div>
    </>
  );
}
