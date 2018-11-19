class HomeViewManager {
  constructor(data) {
    console.log("Constructing homeViewManager");
    this.data = data;
  }

  displayUserName() {
    $("#welcomeUser").html("Welcome, " + inQuizite.email);
  }

  displayUserScores() {
    console.log(this.data);
  }

  generateScoresTable() {
    let scores = this.data;
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

let homeViewManager = new HomeViewManager(dataManager.getUserScoresFromDB());

$(document).ready(function() {
  homeViewManager.displayUserName();
  homeViewManager.generateScoresTable();
});
