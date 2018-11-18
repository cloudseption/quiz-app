class CreateController {
  constructor() {}

  jsButtonAction() {
    dataManager.setCurrentQuizType("JavaScript");
  }

  javaButtonAction() {
    dataManager.setCurrentQuizType("Java");
  }

  addButtonAction() {
    let question = "";
    let answers = ["", "", "", ""];
    createViewManager.generateQuestion(question, answers);
  }

  saveButtonAction(quizType) {
    //model
    dataManager.removeAllQuestions(quizType);
    dataManager.removeAllAnswers(quizType);
    dataManager.setQuestions(
      quizType,
      createViewManager.getQuestionsFromView()
    );
    console.log(dataManager.getQuizObject);
    // dataManager.setAnswers(getAnswersFromView());
    // dataManager.setDifficulty(getDifficultyFromView());
    // dataManager.setLocalStorage();
    // dataManager.populateQuestionsTable();
  }
}

let createController = new CreateController();
