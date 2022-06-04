const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubTaskSchema = new Schema({
	subTaskName: {
		type: String,
		required: true
	},
    taskId: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: false
    }
});

const SubTask = mongoose.model("SubTask", SubTaskSchema);

module.exports = SubTask;