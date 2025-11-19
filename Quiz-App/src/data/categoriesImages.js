import GeneralKnowledgeIcon from "../assets/categories_Img/react/GeneralKnowledge.jsx";
import EntertainmentIcon from "../assets/categories_Img/react/Entertainment.jsx";
import ScienceIcon from "../assets/categories_Img/react/Science.jsx";
import AnimalsIcon from "../assets/categories_Img/react/Animals.jsx";
import GeographyIcon from "../assets/categories_Img/react/Geography.jsx";
import HistoryIcon from "../assets/categories_Img/react/History.jsx";
import ArtIcon from "../assets/categories_Img/react/Art.jsx";
import MythologyIcon from "../assets/categories_Img/react/Mythology.jsx";
import BooksIcon from "../assets/categories_Img/react/Books.jsx";
import FilmIcon from "../assets/categories_Img/react/Film.jsx";
import MusicIcon from "../assets/categories_Img/react/Music.jsx";
import VideoGamesIcon from "../assets/categories_Img/react/VideoGames.jsx";
import ComputersIcon from "../assets/categories_Img/react/Computer.jsx";
import MathsIcon from "../assets/categories_Img/react/Math.jsx";

const categoriesImages = {
  "general knowledge": GeneralKnowledgeIcon,
  entertainment: EntertainmentIcon,
  science: ScienceIcon,
  animals: AnimalsIcon,
  geography: GeographyIcon,
  history: HistoryIcon,
  art: ArtIcon,
  mythology: MythologyIcon,
};

const subCategoriesImages = {
  entertainment: {
    books: BooksIcon,
    film: FilmIcon,
    music: MusicIcon,
    "video games": VideoGamesIcon,
  },
  science: {
    computers: ComputersIcon,
    mathematics: MathsIcon,
  },
};

export { categoriesImages, subCategoriesImages };
