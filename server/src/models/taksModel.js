const mongoose = require('mongoose');
const { type } = require('os');
const { promiseHooks } = require('v8');

const taskSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        default: '',
    },
    type: {
        type: String,
        required: true,
        enum: ['work', 'personal', 'study', 'health', 'other'],
        default: 'other',
    },
    deadline: {
        type: Date,
    },
    priority: {
        type: Number,
        default: 2,
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,}
    
})