const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
	text: {
		type: String,
		required: true
	},
    due_date: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true
    }
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;