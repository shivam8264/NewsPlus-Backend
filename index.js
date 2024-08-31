const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const connectToMongo = require('./db');
const Comment = require('./models/Comment');
require('dotenv').config({ path: '.env.local' });
connectToMongo();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/forget_password'));
app.use('/api/auth', require('./routes/reset_password'));
app.use('/api/comments', require('./routes/comment'));
app.use('/api',require('./routes/userCount'))

io.on('connection', (socket) => {
    // console.log('New client connected');
    Comment.find().sort({ timestamp: 1 }).then((comments) => {
        socket.emit('messages', comments);
    }).catch((error) => {
        console.error('Error fetching messages:', error);
    });
    socket.on('message', async (message) => {
        try {
            const newComment = new Comment(message);
            await newComment.save();
            io.emit('message', newComment);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });
    socket.on('disconnect', () => {
        // console.log('Client disconnected');
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`NewsPlus app listening on port ${port}`);
});
