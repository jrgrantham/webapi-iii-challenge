const express = require('express');
const server = express();
const userRouter = require('./users/userRouter')

server.use(express.json())
server.use((req, res, next) => {
  console.log('Method: ' + req.method + ', URL: ' + req.url + ', Time: ')
  next()
})
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log('Method: ' + req.method + ', URL: ' + req.url + ', Time: ')
};

module.exports = server;
