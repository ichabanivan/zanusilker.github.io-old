"use strict";

(function ($) {
  $(document).ready(function () {

    // Высота блока 100vh
    heightDetect();
    function heightDetect() {
      $('header').css('height', $(window).height());
      $('.about').css('min-height', $(window).height());
      $('.resume').css('min-height', $(window).height());
      $('.contacts').css('min-height', $(window).height());
      $('.portfolio').css('min-height', $(window).height());
    }

    $(window).resize(function () {
      heightDetect();
    });

    $("#form").submit(function () {
      $.ajax({
        type: "POST",
        url: "mail.php",
        data: $(this).serialize()
      }).done(function () {
        $(this).find("input").val("");
        alert("Спасибо за заявку! Скоро мы с вами свяжемся.");
        // $("#form").trigger("reset");
      });
      return false;
    });

    $("#sandwich, .menu_item").click(function () {
      $("#sandwich").toggleClass("active");
    });

    //  menu
    $('#sandwich').on('click', function () {
      $('.menu').toggleClass('active');
    });

    var timerId = setInterval(function () {
      $('#mouse').toggleClass('active');
    }, 1000);

    $(".bar-1 .bar").progress();
    $(".bar-2 .bar").progress();
    $(".bar-3 .bar").progress();
    $(".bar-4 .bar").progress();
    $(".bar-5 .bar").progress();
    $(".bar-6 .bar").progress();
    $(".bar-7 .bar").progress();
    $(".bar-8 .bar").progress();
    $(".bar-9 .bar").progress();
    $(".bar-10 .bar").progress();
    $(".bar-11 .bar").progress();
    $(".bar-12 .bar").progress();
    $(".bar-13 .bar").progress();
    $(".bar-14 .bar").progress();
    $(".bar-15 .bar").progress();
    $(".bar-16 .bar").progress();
  });
})(jQuery);

(function ($) {
  $.fn.progress = function () {
    var percent = this.data("percent");
    this.css("width", percent + "%");
  };
})(jQuery);

$(document).ready(function () {
  $("html").niceScroll({
    cursorcolor: "#fff", // change cursor color in hex
    cursorwidth: "5px", // cursor width in pixel (you can also write "5px")
    cursorborder: "1px solid #fff", // css definition for cursor border
    cursorborderradius: "0px", // border radius in pixel for cursor
    scrollspeed: 100,
    autohidemode: false // how hide the scrollbar works, possible values:
  });
});