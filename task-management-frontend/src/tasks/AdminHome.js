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

function AdminHome() {
	const history = useHistory();
	const [users, setUsers] = useState([]);
	const [userName, setUserName] = useState("");
	const [tasks, setTasks] = useState([]);
	const logged_userId = getUserId();
	useEffect(() => {
		GetUsers();
		GetTasks();
	}, []);

	const GetUsers = () => {
		fetch(api + '/users')
			.then(res => res.json())
			.then(data => setUsers(data))
			.catch((err) => console.error("Error: ", err));
	}

	const GetTasks = () => {
		fetch(api + '/tasks')
			.then(res => res.json())
			.then(data => setTasks(data))
			.catch((err) => console.error("Error: ", err));
	}
	
	const deleteUser = async id => {
		const data = await fetch(api + '/user/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

    setUsers(users => users.filter(user => user._id !== data.result._id));
	setTasks(tasks => tasks.filter(task => task.userId !== data.result._id));
	alert("User Deleted");
	}

	const deleteTask = async id => {
		const data = await fetch(api + '/task/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

    setTasks(tasks => tasks.filter(task => task._id !== data.result._id));
	alert("Task Deleted");
	}

	const Logout = () =>
	{
		localStorage.clear();
		history.push("/");
	}

    const getClassName = (isEnabled) =>
    {
        if(isEnabled === true)
            return "Low";
        return "High";
    }

    const buttonContent = (isEnabled) =>
    {
        if(isEnabled === true)
            return "DISABLE";
        return "ENABLE";
    }

    const changeUserStatus = async (isEnabled, id) => 
    {
        if(isEnabled === true)
            await fetch(api + '/user/disable/' + id, { method: "PUT" });
        else
            await fetch(api + '/user/enable/' + id, { method: "PUT" });
        GetUsers();
    }
	const getDate = dateToChange => {
		var todayDate = new Date(dateToChange)
		return todayDate.toISOString().slice(0, 10);
	}
	
	// 

	return (
    <div className="group">
	<h2>Admin View</h2>
	<h3>Users</h3>
		<div>{users.length > 0 ? users.map(user => (
			<div className={getClassName(user.isEnabled)}>
				<div>{user.email}</div>

				<div className='taskButton' onClick={() =>changeUserStatus(user.isEnabled, user._id)}>{buttonContent(user.isEnabled)}</div>

				<div className='icons'>
				<RiCloseCircleLine
					onClick={() => deleteUser(user._id)}
					className='deleteButton'/>
				</div>

          
          </div>
				)) : (
					<p style={{"color": "#7583c4"}}>No users added yet</p>
				)}
      </div>
	  <h3>Tasks</h3>
		<div>{tasks.length > 0 ? tasks.map(task => (
			<div className={task.priority}>
				<div>{task.text}</div>
				<div>{getDate(task.due_date)}</div>
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

export default AdminHome;
