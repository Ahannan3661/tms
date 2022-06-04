import "./Task.css";
import { RiCloseCircleLine, RiEdit2Fill } from 'react-icons/ri';
import React, { useState, useEffect } from 'react';
import { EditText, EditTextarea } from 'react-edit-text';
import { Link } from "react-router-dom";
import 'react-edit-text/dist/index.css';
import DatePickerWithTimezone from "./DatePickerWithTimeZone.js"
import { getUserId } from "./common";
//import { IconName } from "react-icons/ri";
import DatePicker from "react-datepicker";

import Icon from "react-crud-icons";

//import "../node_modules/react-crud-icons/dist/react-crud-icons.css";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
const api = 'http://localhost:3001';

function TaskList() {
	const history = useHistory();
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
  	const [value, setValue] = useState("default");
	const logged_userId = getUserId();
	useEffect(() => {
		GetTasks();
	}, []);

	const GetTasks = () => {
		fetch(api + `/tasks/${logged_userId}`)
			.then(res => res.json())
			.then(data => setTasks(data))
			.catch((err) => console.error("Error: ", err));
	}

	
	const addPriority = (e) => {
		setValue(e.target.value);
	}

	const [DueDate, setDueDate] = useState("");
	
	const addTask = async () => {
		if (value === "default") {
			alert("Set priority");
		}
		else if (DueDate === "") {
			alert("Set Due date");
		}
		else {
			if (newTask === "") {
				alert("Set Task name")
			}
			else {
			const data = await fetch(api + "/task/new", {
				method: "POST",
				headers: {
					"Content-Type": "application/json" 
				},
				body: JSON.stringify({
					text: newTask,
					due_date: DueDate,
					priority: value,
					userId: logged_userId
				})
			}).then(res => res.json());
            
			
			if (newTask !== "") {
			setTasks([...tasks, data]);
			}
			setNewTask("");
			setValue("default");
				}	
			}
	}
	const deleteTask = async id => {
		const data = await fetch(api + '/task/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

		setTasks(tasks => tasks.filter(task => task._id !== data.result._id));
	}

	const getDate = dateToChange => {
		var todayDate = new Date(dateToChange)
		return todayDate.toISOString().slice(0, 10);
	}

	const Logout = () =>
	{
		localStorage.clear();
		history.push("/");
	}
	

	return (
    <div className="group">
	<h2>ADD A NEW TASK</h2>
      <div className="inputGroup">
        <input 
            type="text" 
            onChange={e => setNewTask(e.target.value)} 
            value={newTask} 
            placeholder='Task name'
            name='text'
            className='taskInput'
        />

		<DatePickerWithTimezone selected={DueDate} onChange={(date:Date) => setDueDate(date)} />

		
        <select defaultValue="default" value={value} onChange={addPriority} id="framework">
            <option value="default" disabled hidden>Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option> 
        </select>
    	<div className='taskButton' onClick={addTask}>Add</div>
          
      </div>
		<div>{tasks.length > 0 ? tasks.map(task => (
			<div className={task.priority}>
				<div>{task.text}</div>
				<div>{getDate(task.due_date)}</div>

				<Link to={'/update/'+task._id}>Update</Link>

				<div className='icons'>
				<RiCloseCircleLine
					onClick={() => deleteTask(task._id)}
					className='deleteButton'/>
				</div>

          
          </div>
				)) : (
					<p style={{"color": "#7583c4"}}>No tasks added yet</p>
				)}
      </div>
	  <div className='taskButton' onClick={Logout}>Logout</div>
    </div>
	);
}

export default TaskList;
