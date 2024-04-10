let addNewTask = document.getElementById('add-new-task');
let modal = document.querySelector('[data-modal]');
let closeTaskForm = document.getElementById('close-form');
let taskTitleInput = document.getElementById('task-title');
let taskDescriptionInput = document.getElementById('task-description');
let addTaskFormBtn = document.getElementById('add-task');
let taskContentContainer = document.getElementById('content-container');
let formHighPriorityBtn = document.getElementById('hight-priority');
let formMediumPriorityBtn = document.getElementById('medium-priority');
let formLowPriorityBtn = document.getElementById('low-priority');
let priorityFormBtns = document.querySelectorAll('.form-container .priority-container button');
let buttons = document.querySelectorAll('button');
let colorFromFormBtns = '';
let date = new Date;
let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTask = {};

let setPreventDefaultToAllButtons = () => {
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener('click', e => e.preventDefault());
    }
}
setPreventDefaultToAllButtons();

addNewTask.addEventListener('click', () => {
    modal.showModal();
})

closeTaskForm.addEventListener('click', () => {
    modal.close();
    reset();
    detelteActiveClass();
})

let createTask = () => {
    taskContentContainer.innerHTML = '';
    allTasks.forEach(({id, title, description, color}) => {
        taskContentContainer.innerHTML += `
        <div class="task-box" id="${id}" style= background-color:${color}>
            <div class="top-field">
                <h3 class="title">${title}</h3>
                <button class="delete-task" onclick="deleteTask(this)"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <p class="description">${description}</p>
            <div class="bottom-field">
                <div class="priority-buttons">
                    <button class="hight-priority" value="#f34a4a" onclick="setTaskColor(this)"></button>
                    <button class="medium-priority" value="#f9b12c" onclick="setTaskColor(this)"></button>
                    <button class="low-priority" value="#0cc10c" onclick="setTaskColor(this)"></button>
                </div>
                <div class="action-buttons">
                <button class="update-task" onclick="updateTask(this)"><i class="fa-solid fa-pencil"></i></button>
                <button class="confirm-task" onclick="deleteTask(this)"><i class="fa-solid fa-check"></i></button>
            </div>
        </div>
        `
    })
}

let addOrUpdateTask = () => {
    let taskIndex = allTasks.findIndex((item) => item.id === currentTask.id);
    let taskObj = {
        id: `${Math.floor(Math.random() * 100)}-${taskTitleInput.value.charAt(0)}-${date.getMilliseconds()}-${Math.floor(Math.random() * 100)}`,
        title: taskTitleInput.value,
        description: taskDescriptionInput.value,
        color: colorFromFormBtns
    }
    if(taskIndex === -1){
        allTasks.unshift(taskObj);
    }else{
        allTasks[taskIndex] = taskObj;
    }
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    createTask();
    addTaskFormBtn.textContent = 'Add task';
    reset();
    colorFromFormBtns = '';
}

let deleteTask = (item) => {
    let taskIndex = allTasks.findIndex((task) => task.id === item.closest('.task-box').id);
    item.closest('.task-box').remove();
    allTasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
}

let updateTask = (item) => {
    let taskIndex = allTasks.findIndex((task) => task.id === item.closest('.task-box').id);
    modal.showModal();
    currentTask = allTasks[taskIndex];
    taskTitleInput.value = currentTask.title;
    taskDescriptionInput.value = currentTask.description;
    addTaskFormBtn.textContent = 'Update task';  
}

let setTaskColor = (button) => {
    let elementId = button.closest('.task-box').id;
    let color = button.getAttribute('value');
    let taskIndex = allTasks.findIndex((task) => task.id === button.closest('.task-box').id);
    if(taskIndex !== -1){
        allTasks[taskIndex].color = color;
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        let currentElement = document.getElementById(elementId);
        currentElement.style.backgroundColor = color;
    }
}

let getColorFromFormBtns = (buttonColor) => {
    let color = buttonColor;
    colorFromFormBtns = color;
}

let reset = () => {
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    currentTask = {};
    modal.close();
    detelteActiveClass();
}

if(allTasks.length){
    createTask();
}

priorityFormBtns.forEach((button) => {
    button.addEventListener('click', () => {
        detelteActiveClass();
        button.classList.add('selected');
    })
})

let detelteActiveClass = () => {
    priorityFormBtns.forEach((button) => {
        button.classList.remove('selected');
    })
}

addTaskFormBtn.addEventListener('click', () => {
    if(!taskTitleInput.value && !taskDescriptionInput.value){
        alert('You must enter at least the title or description of the task.');
        return;
    }else{
        addOrUpdateTask();
    }
})


