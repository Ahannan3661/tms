
import { RiCloseCircleLine } from 'react-icons/ri';
import React, { useState, useEffect } from 'react';
import { getUserId } from "../tasks/common";
const api = 'http://localhost:3001';

function Overview() {
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

	const deleteTask = async id => {
		const data = await fetch(api + '/task/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

		setTasks(tasks => tasks.filter(task => task._id !== data.result._id));
	}
	

	return (
    <div>
      <h2>OVERVIEW</h2>
	  <h3>HIGH PRIORITY TASKS</h3>
	  <div>{tasks.length > 0 ? tasks.map(task => (
			<div>
				

				{task.priority === 'High' &&
				<div className={task.priority}>{task.text} 
					<RiCloseCircleLine
						onClick={() => deleteTask(task._id)}
						className='deleteButton'/>
				</div>
				}
          </div>
				)) : (
					<p style={{"color": "#7583c4"}}>No tasks added yet</p>
				)}
      </div>
	  <h3>MEDIUM PRIORITY TASKS</h3>
	  <div>{tasks.length > 0 ? tasks.map(task => (
			<div>
				

				{task.priority === 'Medium' &&
				<div className={task.priority}>{task.text} 
					<RiCloseCircleLine
						onClick={() => deleteTask(task._id)}
						className='deleteButton'/>
				</div>
				}
          </div>
				)) : (
					<p style={{"color": "#7583c4"}}>No tasks added yet</p>
				)}
      </div>

	  <h3>LOW PRIORITY TASKS</h3>
	  <div>{tasks.length > 0 ? tasks.map(task => (
			<div>
				

				{task.priority === 'Low' &&
				<div className={task.priority}>{task.text} 
					<RiCloseCircleLine
						onClick={() => deleteTask(task._id)}
						className='deleteButton'/>
			</div>
				}
          </div>
				)) : (
					<p style={{"color": "#7583c4"}}>No tasks added yet</p>
				)}
      </div>
	  
    </div>
	);
}

export default Overview;
