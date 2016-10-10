# Autotag

Autotag is a web service created for the hackNY 2016 Fall hackathon. It generates hashtags for your images and tweets the image and hashtag. Users visit our website, authenticate with their Twitter account and enter their phone number. They will receive a phone number. Now they can text images to that number, and we will tweet that image along with the hash tags.

We used the Twilio API to send and receive text messages and the Clarifai API to generate relevant tags. Finally we used the Twitter API to make tweets. For our server, we used Express.js on top of Node.js, powered by a MongoDB database. Our frontend was made using AngularJS.



