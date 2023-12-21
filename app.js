// app.js
const express = require('express');
const bodyParser = require('body-parser');
const articlesRouter = require('./router/articlesRouter');
const batikRouter = require('./router/batikRouter');
const bookmarkRouter = require('./router/bookmarkRouter');
const searchRouter = require('./router/searchRouter');
const customRouter = require('./router/customRouter');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', articlesRouter); 
app.use('/api', batikRouter); 
app.use('/api', bookmarkRouter); 
app.use('/api', searchRouter); 
app.use('/api', customRouter); 

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
