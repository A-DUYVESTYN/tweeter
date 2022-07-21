/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function () {

  const createTweetElement = function (tweetObj) {
    /* Your code for creating the tweet element */
    const tweetArticle = $(`
    <article class="tweet">
    <header>
      <h3><img src=${tweetObj.user.avatars}> ${tweetObj.user.name}</h3>
      <h3 class="userHandle">${tweetObj.user.handle}</h3>
    </header>
    <p>
    ${tweetObj.content.text}
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
    )
    return tweetArticle;
  }

  const renderTweets = function (tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container- NOW PREPENDS TO SHOW NEW TWEETS FIRST
    for (const tweetObj of tweets) {
      const tweetElement = createTweetElement(tweetObj);
      $('#tweets-container').prepend(tweetElement);
    }
  }
  const reloadTweets = function () {
    $('#tweets-container').empty()
    loadTweets()
  }

  const $submitTweet = $('.new-tweet form');
  const $tweetText = $('#tweet-text');
  
  $submitTweet.submit((event) => {
    event.preventDefault()
    if (!$tweetText.val()) {
      return alert("Invalid tweet!")
    }
    if ($tweetText.val().length > 140) {
      return alert("Exceeded tweet character limit!")
    }
    console.log($($submitTweet).serialize()) //DEBUG

    $.ajax({
      type: "POST",
      url:`/tweets`,
      data: $($submitTweet).serialize(),
    })
    
    reloadTweets() // blunt method to show the most recent tweet by clearing and reloading the database, noticable delay
  })
  
  const loadTweets = function() {
    $.ajax({
      url:`/tweets`,
      success: (response) => {
        renderTweets(response)
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  
  loadTweets()
});



