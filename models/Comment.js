const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema = new Schema({
    username: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Comment', commentSchema);
