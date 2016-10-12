(function($) {
  'use strict';

  $.fn.pills = function(options) {
    var defaults = {// Настройки по умолчанию
      active: 1, // Активная вкладка
      direction: true // направление true горизонтальное false вертикальное
    };

    options = $.extend(defaults, options);
    var that = this;
    var direction = "";
    var index = defaults.active;
    var $elems = $('.tabs ul', that).find('li:last-child').index()+1;

    this.each(function() {
      var index1 = $elems;
      if(defaults.active>index1){
        defaults.active = 1;
      }
      if (defaults.direction){
        that.addClass('horizontal');
        direction = 'horizontal';
        index1 = $elems;
        $('.tabs', that).css("width", index1 * 110 + 'px');
      }else{
        that.addClass('vertical');
        direction = 'vertical';
      }
      $('.content li').css("display", "none");
      $('.content li:nth-child('+ options.active +')').css("display", "block");
      $('.tabs li:nth-child('+ options.active +')', that).addClass('active');

      $('.tabs li', that).on('click', function() {
        $('.tabs li', that).removeClass('active');
        index = $('.tabs ul', that).find(this).index()+1;
        $('.tabs li:nth-child('+ index +')', that).addClass('active');
        $('.content li', that).fadeOut(300);
        setTimeout(function() {$('.content li:nth-child('+ index +')', that).fadeIn(300) }, 300);
      });

      function key(index1) {
        if(index1>$elems){//5
          index = 1;
        }
        else if (index1 < 1){
          index = $elems
        }
        $('.tabs li', that).removeClass('active');
        $('.tabs li:nth-child('+ index +')', that).addClass('active');
        $('.content li', that).fadeOut(300);
        setTimeout(function() {$('.content li:nth-child('+ index +')', that).fadeIn(300) }, 300);
      }

      $(this).attr('tabindex', 0).on('keyup', function(event) {
        console.log('keyup:' +  event.keyCode);
        if(direction == 'vertical'){
          if (event.keyCode === 38) {//up
            index--;
            key(index);
          }else if (event.keyCode === 40) {//down
            index++;
            key(index)
          }
        } else if(direction == 'horizontal') {
          if (event.keyCode === 39) {//r
            index++;
            key(index)
          }
          else if (event.keyCode === 37) {//l
            index--;
            key(index);
          }
        }
      });
    })
  }
})(jQuery);