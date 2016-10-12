$(document).ready(function(){
  $('#block').pills({
    active: 7 // Активная вкладка
  });
  $('#block1').pills({
    active: 4, // Активная вкладка
    direction: false
  });
  $('#block2').pills();
});
