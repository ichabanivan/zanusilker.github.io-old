document.addEventListener("DOMContentLoaded", function(event) {
  // variables ********************************************************************************************
  var doc = document,
      // radio button
      radio = document.getElementsByName('Radios'),
      // complexity by default
      level = "normal",
      winners = 0, // 0 tie 1 user 2 comp
      scoreUser = 0,
      scoreComp = 0,
      scoreTie = 0,
      // rock && scissors && paper in DOM
      rock = doc.getElementById("rock"),
      scissors = doc.getElementById("scissors"),
      paper = doc.getElementById("paper"),
      // score
      victory = doc.getElementById("victory"),
      loss = doc.getElementById("loss"),
      draw = doc.getElementById("draw");

  // Tracking the selected difficulty *********************************************************************
  Radio1.onclick = function(){
    for (var i = 0; i < radio.length; i++) {
      if (radio[i].type === 'radio' && radio[i].checked) {
        rezultatRadio = radio[i].value;
        level = rezultatRadio;
      }
    }
  }
  Radio2.onclick = function(){
    for (var i = 0; i < radio.length; i++) {
      if (radio[i].type === 'radio' && radio[i].checked) {
        rezultatRadio = radio[i].value;
        level = rezultatRadio;
      }
    }
  }
  Radio3.onclick = function(){
    for (var i = 0; i < radio.length; i++) {
      if (radio[i].type === 'radio' && radio[i].checked) {
        rezultatRadio = radio[i].value;
        level = rezultatRadio;
      }
    }
  }
  // Processing of the user's choise *************************************************************************
  rock.onclick = function() {
    userChoice = "rock";
    computerChoice = computer(level, userChoice);
    compare (userChoice, computerChoice);
  };
  scissors.onclick = function() {
    userChoice = "scissors";
    computerChoice = computer(level, userChoice);
    compare (userChoice, computerChoice);
  };
  paper.onclick = function() {
    userChoice = "paper";
    computerChoice = computer(level, userChoice);
    compare (userChoice, computerChoice);
  };
  // Processing of the computer's choise  ************************************************************************
  function computer(complexity, userChoice){
  var computerChoice = Math.random();
  // Easy level
  if (complexity === "easy") {
    if (computerChoice < 0.6) {
      if (userChoice === "rock") {
        computerChoice = "scissors";
      }
      else if(userChoice === "paper") {
        computerChoice = "rock";
      }
      else {
        computerChoice = "paper";
      }
    }
    else {
      if (computerChoice < 0.34) {
          computerChoice = "rock";
      }
      else if(computerChoice <= 0.67 && computerChoice >= 0.34) {
          computerChoice = "paper";
      }
      else {
          computerChoice = "scissors";
      }
    }
  }
  // Normal level
  else if(complexity === "normal"){
    if (computerChoice < 0.34) {
        computerChoice = "rock";
    }
    else if(computerChoice <= 0.67 && computerChoice >= 0.34) {
        computerChoice = "paper";
    }
    else {
        computerChoice = "scissors";
    }
  }
  // hard level
  else{
    if (computerChoice < 0.5 ){
      if (userChoice === "rock") {
        computerChoice = "paper";
      }
      else if(userChoice === "paper") {
        computerChoice = "scissors";
      }
      else {
        computerChoice = "rock";
      }
    }
    else{
      var computerChoice = Math.random();
      if (computerChoice < 0.34) {
          computerChoice = "rock";
      }
      else if(computerChoice <= 0.67 && computerChoice >= 0.34) {
          computerChoice = "paper";
      }
      else {
          computerChoice = "scissors";
      }
    }
  }
  return computerChoice;
}

// Processing of winnings *********************************************************************************
  function compare(choice1,choice2){
    if (choice1 === choice2){ // result1 = "The result is a tie!";
      winners = 0;
    }
    else if (choice1 === "rock"){
      if (choice2 === "scissors"){ // result1 = "Rock wins!";
        winners = 1;
      }else{ // result1 = "Paper wins!";
        winners = 2;
      }
    }
    else if (choice1 === "paper"){
      if (choice2 === "rock"){ // result1 = "Paper wins!";
        winners = 1;
      }else{ // result1 = "Scissors wins!";
        winners = 2;
      }
    }
    else if (choice1 === "scissors"){
      if (choice2 === "paper"){ // result1 = "Scissors wins!";
        winners = 1;
      }else{ // result1 = "Rock wins!";
        winners = 2;
      }
    }
    comp1 = 'Computer choice: ' + choice2;
    user1 = "Your choise: " + choice1;
    text = comp1 + "\t" + user1;// qestion fo teacher \t ??????????????????????????????????????????????????
    inHtml(text, winners);
  };
  // Hystory steps *************************************************************************************
  function inHtml(text, winners) {
    var elem = doc.createElement("p"),
        content = doc.createTextNode(text),
        other_id = doc.getElementById("other_id");

    elem.classList.add('history_battle');
    elem.appendChild(content); //вставить узел в другой
    other_id.parentNode.appendChild(elem);
    //style
    var body = doc.getElementsByTagName('body'),
        style = body[0].style;
    // Score
    if (winners === 1) {
      scoreUser += 1;
      victory.innerHTML = "Побед: " + scoreUser;
      style.backgroundColor = 'rgba(19, 156, 28, 0.22)';
    }
    else if (winners === 2) {
      scoreComp += 1;
      loss.innerHTML = "Проиграшей: " + scoreComp;
      style.backgroundColor = 'rgba(191, 33, 109, 0.17)';
    }
    else{
      scoreTie += 1;
      draw.innerHTML = "Ничьих: " + scoreTie;
      style.backgroundColor = '#fff';
    }
    //$Recycle.Bin\
    var body = doc.getElementsByTagName('body'),
        style = body[0].style;
  }
});
