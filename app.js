const express = require('express');
const path = require('path')
const app = express();
const root = path.join(__dirname);

const port = process.env.PORT||3000 

// !important 
app.use(express.static('public'));

// built in middleware to handle urlencoded from data
app.use(express.urlencoded({ extended: true }))

// built in middleware for json
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join('public', 'views', 'index.html'), { root: root })
  })
   
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })