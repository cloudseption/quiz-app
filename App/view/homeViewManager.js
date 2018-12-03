class HomeViewManager {
  constructor() {
    console.log("Constructing homeViewManager");
  }

  displayUserName() {
    $("#welcomeUser").html("Welcome, " + dataManager.getCurrentUserName());
  }

  displayUserScores() {
    let noScoresText = document.createElement("p");
    let jumbotronHOME = document.getElementById("jumbotronHOME");
    noScoresText.innerHTML = "Try taking quizzes to get more scores!";
    noScoresText.style.textAlign = "center";
    jumbotronHOME.appendChild(noScoresText);
  }

  generateScoresTable(data) {
    let scores = data;
    let trElement;
    let tdElement;
    let tableBodyElement = document.getElementById("scoreTableBody");
    $("#scoreTableBody").empty();
    for (let i = 0; i < scores.length; i++) {
      trElement = document.createElement("tr");
      tableBodyElement.appendChild(trElement);
      tdElement = document.createElement("td");
      tdElement.innerHTML = scores[i].QuizType;
      trElement.appendChild(tdElement);
      tdElement = document.createElement("td");
      tdElement.innerHTML = scores[i].QuizCreator;
      trElement.appendChild(tdElement);
      tdElement = document.createElement("td");
      tdElement.innerHTML = scores[i].Score;
      trElement.appendChild(tdElement);
    }
  }
}

let homeViewManager = new HomeViewManager();

$(document).ready(function() {
  homeViewManager.displayUserName();
  homeViewManager.displayUserScores();
  dataManager.getUserScoresFromDB();
});
