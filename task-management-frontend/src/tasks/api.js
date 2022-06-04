const API = 'http://localhost:3001';

export const getTask = taskId => {
    return fetch(`${API}/getTask`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            taskId: taskId,            
        })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

