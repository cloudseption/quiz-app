class DataManager {
  constructor() {
    console.log("Constructing dataManager");
    const userQuizScores = [
      {
        QuizType: "JavaScript",
        QuizCreator: "testuser@hotmail.com",
        Score: "100"
      },
      {
        QuizType: "JavaScript",
        QuizCreator: "testuser@hotmail.com",
        Score: "90"
      }
    ];

    let getUserScores = () => {
      return userQuizScores;
    };
  }
}
