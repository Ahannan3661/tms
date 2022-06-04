const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const utils = require('./utils');
const cors = require('cors');
require('dotenv').config()
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true, 
	useUnifiedTopology: true })
	.then(() => console.log("connected to db"))
	.catch(console.error);

const Task = require('./models/task');
const User = require('./models/user');
const SubTask = require('./models/subTask');

app.get('/tasks/:userId', async (req, res) => {
	const tasks = await Task.find({userId: req.params.userId});

	res.json(tasks);
});

app.get('/subtasks/:taskId', async (req, res) => {
	const subtasks = await SubTask.find({userId: req.params.taskId});

	res.json(subtasks);
});

app.get('/users', async (req, res) => {
	const users = await User.find({ userRole: { $ne: 1 } });
	
	res.json(users);
});

app.get('/tasks', async (req, res) => {
	const tasks = await Task.find();

	res.json(tasks);
});

app.get('/user:id', async (req, res) => {
	const user = await User.findById(req.params.id);

	res.json(user);
});

app.post('/getTaskByName', async (req, res) => {
	const task = await Task.findOne({_id: req.body.taskName});
	res.json(task);
});

app.post('/task/new', (req, res) => {
	const task = new Task({
		text: req.body.text,
		due_date: req.body.due_date,
		priority: req.body.priority,
		userId: req.body.userId
	})
	task.save();
	res.json(task);
});

app.post('/subtask/new', (req, res) => {
	const subTask = new SubTask({
		subTaskName: req.body.subTaskName,
		taskId: req.body.taskId,
		priority: req.body.priority,
	})
	subTask.save();
	res.json(subTask);
});

app.post('/user/new', async (req, res) => {

	encript_pass = await bcrypt.hash(req.body.password, 8);
	const user = new User({
		email: req.body.email,
		password: encript_pass
	})
	user.save();
	res.json(user);
});

app.post('/user/login', async (req, res) => {
	encript_pass = await bcrypt.hash(req.body.password, 8);
	const user = await User.findOne({email: req.body.email});
	if(user)
	{
		const rand = await bcrypt.compare(req.body.password, user.password);
		if(!rand)
		{
			return res.status(400).json({
				error: true,
				message: "Username or Password incorrect." 
			});
		}
		const token = utils.generateToken(user);
		return res.json({ user: user, token});
	}
	else
	{
		return res.status(400).json({
            error: true,
            message: "Username or Password incorrect." 
        });
	}
});

app.delete('/task/delete/:id', async (req, res) => {
	const result = await Task.findByIdAndDelete(req.params.id);
	const results2 = await SubTask.remove({taskId: req.params.id});
	res.json({result});
});

app.delete('/subtask/delete/:id', async (req, res) => {
	const result = await SubTask.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.delete('/user/delete/:id', async (req, res) => {
	const result = await User.findByIdAndDelete(req.params.id);
	const results2 = await Task.remove({userId: req.params.id});
	res.json({result});
});

app.put('/user/disable/:id', async (req, res) => {
	const user = await User.findById(req.params.id);

	user.isEnabled = false;
	user.save();

	res.json(user);
});

app.post('/getTask', async (req,res) => {
	const task = await Task.findById(req.body.taskId);
	res.json(task);
})

app.put('/user/enable/:id', async (req, res) => {
	const user = await User.findById(req.params.id);

	user.isEnabled = true;
	user.save();

	res.json(user);
});

app.put('/task/update/:id', async (req, res) => {
	const task = await Task.findById(req.params.id);

	task.text = req.body.text;
	task.due_date = req.body.due_date;
	task.priority = req.body.priority;
	task.save();

	res.json(task);
});

app.post('/verifyToken', function (req, res){
    var token = req.body.token;
    if(!token){
        return res.status(400).json({
            error: true,
            message: "Token is required."
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, function(err, user){
        if(err) return res.status(401).json({
            error: true,
            message: "Invalid Token."
        });

        if(user._id !== localStorage.getItem("userId")){
            return res.status(401).json({
                error: true,
                message: "Invalid User."
            });
        }
        return res.json({ user: user, token});
    });
});

app.listen(3001);