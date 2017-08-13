var express = require('express');
var cors = require('cors');
const json = require('body-parser').json;
const app = express();
var Client = require('twiser');

app.use(json())
app.use(cors())


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Express server is running on port: ${PORT}!`);
});


app.post('/follow', (req,res) => {
  console.log(req.body)
  var following = req.body.following;
  var duration = req.body.duration;
  var client = new Client({
    username: req.body.username,
    password: req.body.password
  });
  client.api.login();

  let count = 0;
  console.log(following.length);

  //LOOPS THROUGH LIST OF USERS TO FOLLOW
  var followLoop = function(x) {
      // LOGIC FOR LOOPING THROUGH FOLLOWING LIST, AND FOLLOWING 40 PER HOUR
      if (following[x] && count > 40) {
          setTimeout(function(){
              client.api.follow(following[x])
              count = 0;
              followLoop(x + 1)
          }, 3600000);
      } else if(following[x]){
          if(following[x].toString().length < 15){
              client.api.follow(following[x])
                .then(res => {
                  console.log(`Following ${following[x]}`)
                })
                .catch(err => {
                  console.log(err)
                })
              
              followLoop(x + 1)
          }
      }
  }

  followLoop(0);

  setTimeout(() => {
    unfollowLoop(0)
  }, 20000)

  //GRADUALLY UNFOLLOWS TO LOOK HUMAN
  var unfollowLoop = function(x) {
      if (following[x]) {
          setTimeout(function(){
              client.api.unfollow(following[x])
                .then(res => {
                  console.log(`Unfollowing ${following[x]}`)
                })
                .catch(err => console.log(err))
                
              unfollowLoop(x + 1)
          }, Math.random() * 15000);
      }
  }
})
