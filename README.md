# React Trivia Quiz App

[This](https://trivia-quiz-app-s.netlify.app/) is trivia quiz application that allows users to log in, pick their preferred category, attempt a set of questions, and see their performance when the quiz ends.

## Table of contents

- [About](#about)
  - [Screenshots](#screenshots)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [UI/UX Decisions](#uiux-decisions)
  - [Links](#links)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## About

### Screenshots

#### Desktop

<p align="center">
    <img src="/Quiz-App/screenshots/Desktop/home_screen.png" width="85%" alt="home screen">
</p>

<details>

  <summary><strong>Full Desktop Gallery (click to expand)</strong></summary>
  <br/>

  <p align="center">
    <img src="/Quiz-App/screenshots/Desktop/home_screen_guest.png" width="85%" alt="guest home screen">
  </p>

  <p align="center">
    <img src="/Quiz-App/screenshots/Desktop/category.png" width="85%" alt="category screen">
  </p>

  <p align="center">
    <img src="/Quiz-App/screenshots/Desktop/quiz.png" width="85%" alt="quiz screen">
  </p>

  <p align="center">
    <img src="/Quiz-App/screenshots/Desktop/results.png" width="85%" alt="results screen">
  </p>

  <p align="center">
    <img src="/Quiz-App/screenshots/Desktop/login.png" width="85%" alt="login screen">
  </p>

</details>

#### Mobile

<p align="center">
  <img src="/Quiz-App/screenshots/Mobile/home_screen_mobile.png" width="30%" alt="home screen mobile" />
  <img src="/Quiz-App/screenshots/Mobile/category_mobile.png" width="30%" alt="category screen mobile" />
  <img src="/Quiz-App/screenshots/Mobile/profile_mobile.png" width="30%" alt="profile screen" />
</p>

<details>
  <summary><strong>Full Mobile Gallery (click to expand)</strong></summary>
  <br/>

  <p align="center">
    <img src="/Quiz-App/screenshots/Mobile/stats_mobile.png" width="30%" alt="stats screen"/>
    <img src="/Quiz-App/screenshots/Mobile/badges_mobile.png" width="30%" alt="badges screen" />
    <img src="/Quiz-App/screenshots/Mobile/avatar_selection_mobile.png" width="30%" alt="avatar selection screen"  />
  </p>
</details>

### Tech Stack

- React
- JavaScript
- Firebase
- Chakra UI
- Netlify

### Features

- **Multiple Quiz Categories** <br/>
  Fetched from the OpenTriviaDB API across various categories and subcategories.

- **Dynamic Quiz Generation** <br/>
  Each quiz session is generated with randomized questions.

- **Account Creation (Optional)** <br/>
  Users can either log in with email or continue as guests.

- **Progress Tracking** <br/>
  Quiz results are stored in Firestore, enabling:

  - Score history
  - Completion stats
  - Category-based performance
  - User badges (achievement system)

- **User Profile Page** <br/>
  Displays username & profile picture (logged-in only) and stats, badges, score charts (all users).

- **Responsive UI** <br/>
  Built with Chakra UI + CSS Modules for clean mobile-first and desktop layouts.

- **Recent Quiz Card** <br/>
  Shows the most recently played quiz on the home page (based on stored data).

- **Random Quiz Generator** <br/>
  A dedicated card that instantly starts a random quiz from any category.

### UI/UX Decisions

- Implemented the interface based on a Figma design layout, ensuring visual consistency and alignment

- Designed clear feedback states across authentication flows, including error messages for invalid credentials, email verification prompts, and confirmation message for successful account creation.

- Used modal-based messaging for profile updates (username, avatar, password, email) to provide focused, interruption-free feedback after user actions.

- Implemented confirmation modals for destructive actions such as clearing data or deleting an account, followed by explicit success messages to reduce accidental data loss and user confusion.

- Ensured quiz interactions are visually clear and predictable, with disabled navigation where appropriate (e.g., previous button on the first question) and distinct visual indicators for selected answers.

- Prioritized explicit system feedback throughout the app so users always understand the result of their actions, especially in multi-step or asynchronous flows.

### Links

- Solution URL: [https://github.com/sruthi-nair166/Quiz-App](https://github.com/sruthi-nair166/Quiz-App)
- Live Site URL: [https://trivia-quiz-app-s.netlify.app/](https://trivia-quiz-app-s.netlify.app/)

## Author

- LinkedIn - [Sruthi V Nair](https://www.linkedin.com/in/sruthi-v-nair-5b5a09191/)
- Github - [Sruthi V Nair](https://github.com/sruthi-nair166)

## Acknowledgments

This app uses layout inspiration and free visual resources from the design community and asset libraries.  
All rights belong to their respective creators.

- **UI Layout Inspiration**

  - Illiyin Studio ([Figma](https://www.figma.com/community/file/1178996093139112052) & [Dribbble](https://dribbble.com/illiyinstudio))

- **User Avatars**

  - Freepik ([Flaticon](https://www.flaticon.com/authors/freepik))

- **Illustrations & Icons**
  - [Iconfinder](https://www.iconfinder.com/)
  - [Flaticon](https://www.flaticon.com/)
  - [Undraw](https://undraw.co/)
