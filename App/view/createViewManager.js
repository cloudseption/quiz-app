class CreateViewManager {
  constructor() {}

  generateQuestionsFromLocalStorage() {
    console.log(localStorage);
    let quizType = dataManager.getCurrentQuizType();
    let myQuestion = JSON.parse(localStorage.getItem("storage"));
    let answers = [];
    myQuestion.questions.forEach(element => {
      if (element.quizType == quizType) {
        answers.push(element.answer1);
        answers.push(element.answer2);
        answers.push(element.answer3);
        answers.push(element.answer4);
        this.generateQuestion(element.question, answers);
      }
      answers = [];
    });
  }

  generateQuestion(question, answers) {
    let latestQuestionID = "";
    let latestQuestion = "";
    let latestQuestionCount = 0;
    let questionText = question;
    let answerList = answers;
    let questionsDiv = document.getElementById("questions");
    let newQuestion = document.createElement("div");
    console.log("generateQuestion");
    if ($("#questions").children().length == 0) {
      latestQuestionID = "q_0";
    } else {
      latestQuestion = $("#questions")
        .children()
        .last()
        .attr("id");
      latestQuestionCount = ++latestQuestion.split("_")[1];
      latestQuestionID = "q_" + latestQuestionCount;
    }

    newQuestion.setAttribute("id", latestQuestionID);
    newQuestion.style.border = "1px solid black";
    newQuestion.style.padding = "20px";
    newQuestion.style.margin = "20px";
    this.generateQuestionChildren(
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
    /**
     * <label for="q_1box">Question: </label>
        <div id = "q_1box" class="form-group">
            <textarea class = "form-control" rows = "5" id="q_1text"></textarea>
        </div>
        <label for="q_1answerbox">Answers: </label>
        <div id = "q_1answerbox" class="form-group">
     */
    let qlabel = document.createElement("label");
    let qbox = document.createElement("div");
    let textarea = document.createElement("textarea");
    let alabel = document.createElement("label");
    let abox = document.createElement("div");
    let deleteBtn = document.createElement("button");
    let dbox = document.createElement("div");

    qlabel.setAttribute("for", latestQuestionID + "box");
    qlabel.innerHTML = "Question: ";
    qbox.setAttribute("id", latestQuestionID + "box");
    qbox.setAttribute("class", "form-group");
    textarea.setAttribute("class", "form-control");
    textarea.setAttribute("rows", "5");
    textarea.setAttribute("id", latestQuestionID + "text");
    textarea.value = questionText;
    alabel.setAttribute("for", latestQuestionID + "answerbox");
    alabel.innerHTML = "Answers: ";
    abox.setAttribute("id", latestQuestionID + "answerbox");
    abox.setAttribute("class", "form-group");
    deleteBtn.setAttribute("class", "btn btn-danger");
    deleteBtn.setAttribute("onclick", "createViewManager.removeQuestion(this)");
    deleteBtn.innerHTML = "Delete";

    qbox.appendChild(textarea);
    newQuestion.appendChild(qlabel);
    newQuestion.appendChild(qbox);
    newQuestion.appendChild(alabel);
    this.generateAnswerBoxChildren(abox, latestQuestionID, answerList);
    newQuestion.appendChild(abox);
    newQuestion.appendChild(dbox);
    newQuestion.appendChild(deleteBtn);
  }

  generateAnswerBoxChildren(answerbox, latestQuestionID, answerList) {
    /**
     * <div class = input-group>
            <span class="input-group-addon">
                <input type = "checkbox" class= "q_1a" onchange="cbChange(this)">
            </span>
            <input type="text" class="form-control" id="q_1a1">
        </div>
     */
    for (let i = 0; i < 4; i++) {
      let inputGroup = document.createElement("div");
      let spanElement = document.createElement("span");
      let textinput = document.createElement("input");
      let checkboxElement = document.createElement("input");
      inputGroup.setAttribute("class", "input-group");
      spanElement.setAttribute("class", "input-group-addon");
      textinput.setAttribute("type", "text");
      textinput.setAttribute("class", "form-control");
      textinput.setAttribute("id", latestQuestionID + "a" + i);
      textinput.setAttribute(
        "onchange",
        "createViewManager.clearCheckBox(this)"
      );
      textinput.value = answerList[i];
      checkboxElement.setAttribute("type", "checkbox");
      checkboxElement.setAttribute("class", latestQuestionID + "a");
      checkboxElement.setAttribute(
        "onchange",
        "createViewManager.cbChange(this)"
      );

      spanElement.appendChild(checkboxElement);
      inputGroup.appendChild(spanElement);
      inputGroup.appendChild(textinput);
      answerbox.appendChild(inputGroup);
    }
  }

  cbChange(element) {
    let checkboxes = document.getElementsByClassName($(element).attr("class"));
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    element.checked = true;
  }

  clearCheckBox(element) {
    let questionClass = $(element)
      .attr("id")
      .slice(0, -1);
    let checkboxes = document.getElementsByClassName(questionClass);
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  }

  getIdsFromView() {
    let questionObject = $("#questions").children();
    let questionCount = $("#questions").children().length;
    let ids = [];
    let temp = "";
    for (let i = 0; i < questionCount; i++) {
      temp = questionObject[i].id;
      ids.push(temp);
    }
    return ids;
  }

  getQuestionsFromView() {
    let questionObject = $("#questions").children();
    let questionCount = $("#questions").children().length;
    let questionsList = [];
    for (let i = 0; i < questionCount; i++) {
      let questionText = questionObject[i].children[1].children[0].value;
      questionsList.push(questionText);
    }
    console.log("getQuestionsFromView", questionsList);
    return questionsList;
  }

  getAnswersFromView() {
    let questionObject = $("#questions").children();
    let questionCount = $("#questions").children().length;
    let answersObject = {};
    let answersList = [];
    let answer = "";
    let correctAnswer = "";

    for (let i = 0; i < questionCount; i++) {
      answersList = [];
      for (let j = 0; j < 4; j++) {
        answer = questionObject[i].children[3].children[j].children[1].value;
        if (
          questionObject[i].children[3].children[j].children[0].children[0]
            .checked
        ) {
          correctAnswer = answer;
        }
        answersList.push(answer);
      }
      answersList.push(correctAnswer);
      answersObject[i] = answersList;
    }
    return answersObject;
  }

  removeQuestion(element) {
    $(element)
      .parent()
      .remove();
  }

  removeChildren(element) {
    $(element)
      .children()
      .remove();
  }
  enableButtons() {
    document.getElementById("addButton").disabled = false;
    document.getElementById("saveButton").disabled = false;
  }
}

let createViewManager = new CreateViewManager();

$(document).ready(function() {
  dataManager.setCurrentQuizType("JavaScript");
  console.log("current quiz", dataManager.getCurrentQuizType());
  dataManager.getQuestionsFromDB();
});
