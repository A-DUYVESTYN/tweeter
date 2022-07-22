/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const { response } = require("express");


$(document).ready(function () {

  // escaping text function for unsafe inputs. e.g. <script>alert('malicious code!');</script>
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // create tweet elements
  const createTweetElement = function (tweetObj) {
    const tweetArticle = $(`
    <article class="tweet">
    <header>
      <h3><img src=${tweetObj.user.avatars}> ${tweetObj.user.name}</h3>
      <h3 class="userHandle">${tweetObj.user.handle}</h3>
    </header>
    <p>
    ${escape(tweetObj.content.text)}
    </p>
    <footer>
      <time>
      ${timeago.format(tweetObj.created_at)}
      </time>
      <ul>
      <i class="fa-solid fa-flag"></i>
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-solid fa-heart"></i>
      </ul>
    </footer>
  </article>`
    );
    return tweetArticle;
  };

  const renderTweets = function (tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and PREPENDS it to the tweets container
    for (const tweetObj of tweets) {
      const tweetElement = createTweetElement(tweetObj);
      $('#tweets-container').prepend(tweetElement);
    };
  };

  //initialze jquery variables for tweet submission
  const $submitTweet = $('.new-tweet form');
  const $tweetText = $('#tweet-text');

  $submitTweet.submit((event) => {
    $('.errorMsg').empty()
    event.preventDefault()
    if (!$tweetText.val()) {
      return $('.errorMsg').append("<div class= errorStyle>Invalid tweet!</div>");
    };
    if ($tweetText.val().length > 140) {
      return $('.errorMsg').append("<div class= errorStyle> Exceeded tweet character limit!</div>");
    };

    $.ajax({
      method: "POST",
      url: `/tweets`,
      data: $($submitTweet).serialize(),
    }).then(() => {
      $.ajax(
        `/tweets`,
        { method: "GET" }
      ).then((res) => {
        $('#tweet-text').val('')
        $('.counter').val(140)
        renderTweets([res[res.length - 1]])
      });
    });
  });

  const loadTweets = function () {
    $.ajax({
      url: `/tweets`,
      success: (response) => {
        renderTweets(response)
      },
      error: (error) => {
        console.error(error);
      }
    });
  };
  loadTweets();
});
