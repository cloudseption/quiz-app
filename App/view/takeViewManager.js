class TakeViewManager {
  constructor() {}

  generateTableOfQuizzes(usersObject) {
    let quizTypes = dataManager.getQuizTypes();
    let trElement;
    let tdElement;
    let tableBodyElement = document.getElementById("quizTable");
    $("#quizTable").empty();

    console.log("generateTableOfQuizzes");
    usersObject.users.forEach(u => {
      if (u["userId"] != dataManager.getCurrentUser()) {
        quizTypes.forEach(qt => {
          trElement = document.createElement("tr");
          trElement.addEventListener("click", function() {
            takeController.rowClickAction(this);
          });
          tableBodyElement.appendChild(trElement);
          tdElement = document.createElement("td");
          tdElement.innerHTML = u["userId"];
          trElement.appendChild(tdElement);
          tdElement = document.createElement("td");
          tdElement.innerHTML = qt;
          trElement.appendChild(tdElement);
        });
      }
    });
  }

  getQuestionsFromThisElement(rowElement) {
    console.log(rowElement);
  }

  generateFromDatabaseObject() {
    let dbQuestions = getDbObjectQuestions();
    let dbAnswers = getDbObjectAnswers();
    let dbIds = getDbIds();
    let dbCount = dbQuestions.length;

    if (dbCount == 0) {
      $("#defaultHeader").html("<h1>No questions</h1>");
    } else {
      for (let i = 0; i < dbCount; i++) {
        if (difficulty == dbDiffs[i]) {
          generateQuestion(dbIds[i], dbQuestions[i], dbAnswers[i]);
        } else {
          $("#" + dbIds[i]).remove();
        }
      }
    }
  }

  generateQuestion(id, question, answers) {
    let latestQuestionID = id;
    let questionText = question;
    let answerList = answers;
    let questionsDiv = document.getElementById("questions");
    let newQuestion = document.createElement("div");

    newQuestion.setAttribute("id", latestQuestionID);
    newQuestion.style.border = "1px solid black";
    newQuestion.style.padding = "20px";
    newQuestion.style.margin = "20px";
    generateQuestionChildren(
      newQuestion,
      latestQuestionID,
      questionText,
      answerList
    );
    questionsDiv.appendChild(newQuestion);
  }

  generateQuestionChildren(
    newQuestion,
    latestQuestionID,
    questionText,
    answerList
  ) {
    let qindex = ++latestQuestionID.split("_")[1];
    let qlabel = document.createElement("label");
    let qbox = document.createElement("div");
    let textarea = document.createElement("h2");
    let alabel = document.createElement("label");
    let abox = document.createElement("div");

    qlabel.setAttribute("fors", latestQuestionID + "box");
    qlabel.innerHTML = "Question " + qindex + ":";
    qbox.setAttribute("id", latestQuestionID + "box");
    qbox.setAttribute("class", "form-group");
    textarea.setAttribute("id", latestQuestionID + "text");
    textarea.innerHTML = questionText;
    alabel.setAttribute("for", latestQuestionID + "answerbox");
    alabel.innerHTML = "Answers: ";
    abox.setAttribute("id", latestQuestionID + "answerbox");
    abox.setAttribute("class", "form-group");

    qbox.appendChild(textarea);
    newQuestion.appendChild(qlabel);
    newQuestion.appendChild(qbox);
    newQuestion.appendChild(alabel);
    generateAnswerBoxChildren(abox, latestQuestionID, answerList);
    newQuestion.appendChild(abox);
  }

  generateAnswerBoxChildren(answerbox, latestQuestionID, answerList) {
    for (let i = 0; i < 4; i++) {
      let checkBoxDiv = document.createElement("div");
      let labelElement = document.createElement("label");
      let checkboxElement = document.createElement("input");
      checkBoxDiv.setAttribute("id", latestQuestionID + "d" + i);
      checkboxElement.setAttribute("type", "checkbox");
      checkboxElement.setAttribute("id", latestQuestionID + "cb" + i);
      checkboxElement.setAttribute(
        "class",
        "form-check-input" + latestQuestionID + "a"
      );
      checkboxElement.setAttribute("onchange", "cbChange(this)");
      checkboxElement.style.width = "25px";
      checkboxElement.style.height = "25px";
      labelElement.setAttribute("class", "form-check-label");
      labelElement.setAttribute("for", latestQuestionID + "cb" + i);
      labelElement.setAttribute("id", latestQuestionID + "lbl" + i);
      labelElement.style.fontSize = "150%";
      labelElement.innerHTML = answerList[i];
      checkBoxDiv.appendChild(checkboxElement);
      checkBoxDiv.appendChild(labelElement);
      answerbox.appendChild(checkBoxDiv);
    }
  }

  /**
   * GENERATE SUBMIT BUTTON
   */
  generateSubmitButton() {
    //data-toggle="modal" data-target="#scoreModal"
    let buttonDiv = document.getElementById("btnDIV");
    let submitButton = document.createElement("button");
    buttonDiv.appendChild(getScoreModal());
    buttonDiv.appendChild(getErrorModal());
    submitButton.setAttribute("id", "submit");
    submitButton.setAttribute("type", "button");
    submitButton.setAttribute("class", "btn btn-success btn-lg");
    submitButton.setAttribute("onclick", "submitAnswers()");
    submitButton.setAttribute("data-toggle", "modal");
    submitButton.innerHTML = "Submit";
    buttonDiv.appendChild(submitButton);
  }

  /**
   * RIGHT OR WRONG STYLE RENDERING
   */
  renderAnswerCorrect(qId, userAnswer) {
    let lblId = qId + "lbl";
    let lblIdIndex = "";
    let qdivId = qId + "d";
    let qdivIdIndex = "";
    let ans = "";

    for (let i = 0; i < 4; i++) {
      lblIdIndex = lblId + i;
      ans = $("#" + lblIdIndex).text();

      if (userAnswer == ans) {
        qdivIdIndex = qdivId + i;
        $("#" + qdivIdIndex).css("background-color", "green");
      }
    }
  }

  renderAnswerWrong(qId, userAnswer, correctAnswer) {
    let qdivId = qId + "d";
    let qdivIdIndex = "";
    let lblId = qId + "lbl";
    let lblIdIndex = "";
    let ans = "";
    let newDiv = document.createElement("div");
    let correctAnswerText = document.createElement("h3");
    let qAnsBoxId = qId + "answerbox";
    correctAnswerText.innerHTML = "Correct Answer: " + correctAnswer;
    correctAnswerText.style.color = "green";
    newDiv.appendChild(correctAnswerText);

    for (let i = 0; i < 4; i++) {
      lblIdIndex = lblId + i;
      ans = $("#" + lblIdIndex).text();
      if (userAnswer == ans) {
        qdivIdIndex = qdivId + i;
        $("#" + qdivIdIndex).css("background-color", "red");
        qAnsElement = document.getElementById(qAnsBoxId);
        qAnsElement.append(newDiv);
      }
    }
  }
  /**
   * GETTING THE USER ANSWERS FROM HTML
   */
  getUserAnswers() {
    let questionObject = $("#questions").children();
    let questionCount = $("#questions").children().length;
    let userAnswers = [];
    let answer = "";
    console.log(questionObject);
    for (let i = 0; i < questionCount; i++) {
      answersList = [];
      for (let j = 0; j < 4; j++) {
        if (questionObject[i].children[3].children[j].children[0].checked) {
          answer =
            questionObject[i].children[3].children[j].children[1].textContent;
        }
      }
      userAnswers.push(answer);
    }

    return userAnswers;
  }

  /**
   * GETTING THE QUESTION ID FROM VIEW
   */

  getQuestionIdFromView() {
    let questionObject = $("#questions").children();
    let ids = [];
    for (let i = 0; i < questionObject.length; i++) {
      ids.push(questionObject[i].id);
    }
    return ids;
  }

  /**
   * CHECKBOX STUFF
   */
  checkCount() {
    //[1].children[3].children[2].children[""0""].checked
    let questionObject = $("#questions").children();
    let questionCount = $("#questions").children().length;
    let count = 0;
    let pass = false;
    for (let i = 0; i < questionCount; i++) {
      answersList = [];
      for (let j = 0; j < 4; j++) {
        if (questionObject[i].children[3].children[j].children[0].checked) {
          count = count + 1;
        }
      }
    }
    if (count == questionCount) {
      pass = true;
    }

    return pass;
  }

  cbChange(element) {
    let checkboxes = document.getElementsByClassName($(element).attr("class"));
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    element.checked = true;
  }

  /**
   * MODAL STUFF
   */
  setModalScore() {
    let btn = document.getElementById("submit");
    btn.setAttribute("data-target", "#scoreModal");
  }

  setModalError() {
    let btn = document.getElementById("submit");
    btn.setAttribute("data-target", "#errorModal");
  }

  setScoreInModal(score) {
    let scoreElement = document.getElementById("score");
    let percent = score * 100;
    scoreElement.innerHTML = percent + "%";
  }

  getScoreModal(score) {
    let modalDiv = document.createElement("div");
    let html = '<div class="modal fade" id="scoreModal" role="dialog">';
    html += '<div class="modal-dialog modal-sm">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html +=
      '<button type="button" class="close" data-dismiss="modal">&times;</button>';
    html += '<h4 class="modal-title">Score</h4>';
    html += "</div>";
    html += '<div class="modal-body">';
    html += '<p id="score"></p>';
    html += "</div>";
    html += '<div class="modal-footer">';
    html +=
      '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    modalDiv.innerHTML = html;
    return modalDiv;
  }

  getErrorModal() {
    let modalDiv = document.createElement("div");
    let html = '<div class="modal fade" id="errorModal" role="dialog">';
    html += '<div class="modal-dialog modal-sm">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html +=
      '<button type="button" class="close" data-dismiss="modal">&times;</button>';
    html += '<h4 class="modal-title">Error</h4>';
    html += "</div>";
    html += '<div class="modal-body">';
    html += "<p>Please choose an answer for each question.</p>";
    html += "</div>";
    html += '<div class="modal-footer">';
    html +=
      '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    modalDiv.innerHTML = html;
    return modalDiv;
  }
}

let takeViewManager = new TakeViewManager();

$(document).ready(function() {
  dataManager.getAllUsersFromDB();
});

$(document).ajaxComplete(function(event, request, settings) {
  let usersObject = JSON.parse(localStorage.getItem("users"));
  console.log(localStorage);
  takeViewManager.generateTableOfQuizzes(usersObject);
});
