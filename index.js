const connectToMongo=require('./db');
const express = require('express');
const router = require('./routes/auth');
connectToMongo();
const app = express()
const port = 5000
var cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.get('/', (req, res) => {
  res.send('Hello Shivam!')
})

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})