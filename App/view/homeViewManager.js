class HomeViewManager {
  constructor() {
    console.log("Constructing homeViewManager");
  }

  displayUserName() {
    $("#welcomeUser").html("Welcome, " + dataManager.getCurrentUserName());
  }

  displayUserScores() {
    console.log(this.data);
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
  dataManager.getUserScoresFromDB();
});
