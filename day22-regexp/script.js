"use strict";

$("form").submit(event => {
  event.preventDefault();

  let text = $("#text").val();

  let regExpText = $("#regexp").val();
  let regExpFlags = regExpText.replace(/.*\/([gimy]*)/, "$1");
  let regExpPattern = regExpText.replace(/\/(.*)\/[gimy]*/, "$1");
  let regExp = new RegExp(regExpPattern, regExpFlags);

  $("#highlighter").html(text.replace(regExp, "<mark>$&</mark>"));

  $("#text").css("display", "none");
  $("#highlighter").css("display", "block");
});

$("#highlighter").click(() => {
  $("#highlighter").css("display", "none");
  $("#text").css("display", "block");
  $("#text").focus();
});