import "./Task.css";
import { RiCloseCircleLine, RiEdit2Fill } from 'react-icons/ri';
import React, { useState, useEffect } from 'react';
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { getTask } from './api.js'
import { useHistory } from "react-router-dom";

//import { IconName } from "react-icons/ri";
import DatePicker from "react-datepicker";

import Icon from "react-crud-icons";

//import "../node_modules/react-crud-icons/dist/react-crud-icons.css";
import "react-datepicker/dist/react-datepicker.css";
const api = 'http://localhost:3001';

const UpdateTask = ({ match }) => {
    const history = useHistory();
    const [taskName, setTaskName] = useState("");
    const [subTasks, setSubTasks] = useState([]);
    const [newSubTask, setNewSubTask] = useState("");
    const [subValue, setSubValue] = useState("default");
    const [updateTaskId, setUpdateTaskId] = useState("");
    const [prevTaskName, setPrevTaskName] = useState("");
    const [prevPriority, setPrevPriority] = useState("");
    const [prevDueDate, setPrevDueDate] = useState(new Date());
    const [value, setValue] = useState("default");
    const [DueDate, setDueDate] = useState(new Date());
	const [values, setValues] = useState({
		task_name: '',
		date: '',
		task_priority: '',
		error: false
	});

	const init = taskId => {
        console.log("hello",taskId);
		getTask(taskId).then(data => {
            setTaskName(data.text);
            setValue(data.priority);
            setUpdateTaskId(taskId);
            setDueDate(new Date(data.due_date));
		})
	}

    useEffect(() => {
        init(match.params.taskId);
        GetSubTasks();

    }, []);

    const GetSubTasks = () => {
		fetch(api + `/subtasks/${updateTaskId}`)
			.then(res => res.json())
			.then(data => setSubTasks(data))
			.catch((err) => console.error("Error: ", err));
	}


   //  console.log('hello ',taskId);
     const addPriority = (e) => {
	 	setValue(e.target.value);
	 }

     const addSubPriority = (e) => {
        setSubValue(e.target.value);
    }

    const addSubTask = async () => {
		if (subValue === "default") {
			alert("Set priority");
		}
		else {
			if (newSubTask === "") {
				alert("Set Sub-Task name")
			}
			else {
			const data = await fetch(api + "/subtask/new", {
				method: "POST",
				headers: {
					"Content-Type": "application/json" 
				},
				body: JSON.stringify({
                    subTaskName: newSubTask,
                    taskId: updateTaskId,
                    priority: subValue,
				})
			}).then(res => res.json());
            
			
			if (newSubTask !== "") {
			setSubTasks([...subTasks, data]);
			}
			setNewSubTask("");
			setSubValue("default");
				}	
			}
	}

    const deleteSubTask = async id => {
		const data = await fetch(api + '/subtask/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

		setSubTasks(subTasks => subTasks.filter(subTask => subTask._id !== data.result._id));
	}

    
    const updateTask = async id => 
    {
        //console.log(DueDate)
        const data = await fetch(api + "/task/update/"+ updateTaskId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                text: taskName,
                due_date: DueDate,
                priority: value
                
            })
        }).then(res => res.json());
        history.push("/home");
	}
	

        return(
            <div className="group">
        <h2>Update the task</h2>
        <div className="inputGroup">
          <input 
              type="text" 
              onChange={e => setTaskName(e.target.value)} 
              value={taskName} 
              placeholder={taskName}
              name='text'
              className='taskInput'
          />
  
        <DatePicker selected={DueDate} onChange={(date:Date) => setDueDate(date)} />
  
          
          <select defaultValue={value} value={value} onChange={addPriority} id="framework">
              <option value={value} disabled hidden>{value}</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option> 
          </select>
          <div className='taskButton' onClick={updateTask}>Update</div>
        </div>
        <h2>ADD A NEW SUB-TASK</h2>
      <div className="inputGroup">
        <input 
            type="text" 
            onChange={e => setNewSubTask(e.target.value)} 
            value={newSubTask} 
            placeholder='Sub-Task name'
            name='text'
            className='taskInput'
        />
        <select defaultValue="default" value={subValue} onChange={addSubPriority} id="framework">
            <option value="default" disabled hidden>Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option> 
        </select>
    	<div className='taskButton' onClick={addSubTask}>Add</div>
          
      </div>

		<div>{subTasks.length > 0 ? subTasks.map(subtask => (
			<div className={subtask.priority}>
				<div>{subtask.subTaskName}</div>

				<div className='icons'>
				<RiCloseCircleLine
					onClick={() => deleteSubTask(subtask._id)}
					className='deleteButton'/>
				</div>
          </div>
				)) : (
					<p style={{"color": "#7583c4"}}>No sub-tasks added yet</p>
				)}
      </div>
</div>
	);
}

export default UpdateTask;

