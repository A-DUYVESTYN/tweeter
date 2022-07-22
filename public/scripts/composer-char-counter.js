$(document).ready(function() {

  $("#tweet-text").on("input", function() {

    let charCount = 140 - $(this).val().length;

    let counterRef = $(this).parents("form").find("output");

    $(counterRef).html(charCount);

    charCount < 0 ? 
    $(counterRef).addClass("error") : 
    $(counterRef).removeClass("error");

  });
});