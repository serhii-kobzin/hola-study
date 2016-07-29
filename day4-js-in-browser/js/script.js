var newTaskTextEditor = document.getElementById('new_task_text_editor');
var tasksList = document.getElementById('tasks_list');
var completeAllTasks = document.getElementById('complete_all_tasks');
var removeCompletedTasks = document.getElementById('remove_completed_tasks');
var allTasks = document.getElementById('all_tasks');
var activeTasks = document.getElementById('active_tasks');
var completeTasks = document.getElementById('complete_tasks');
var filter = 'all';

completeAllTasks.onclick = function() {
    var tasks = tasksList.getElementsByClassName('task');
    for (var i = 0; i < tasks.length; ++i) {
        var completeTask = tasks[i].getElementsByClassName('task_complete')[0];
        if (completeTask.checked != this.checked) {
            completeTask.click();
        }
    }
};

newTaskTextEditor.onkeyup = function(event) {
    if (event.keyCode == 27) {
        this.value = '';
        return;
    }
    if (event.keyCode != 13) {
        return;
    }
    var taskText = this.value;
    if (taskText == '') {
        alert('Task is empty!');
        return;
    }
    addTask(false, taskText);
    this.value = '';
};

removeCompletedTasks.onclick = function() {
    var tasks = tasksList.getElementsByClassName('task');
    for (var i = 0; i < tasks.length; ++i) {
        var completeTask = tasks[i].getElementsByClassName('task_complete')[0];
        var removeTask = tasks[i].getElementsByClassName('task_remove')[0];
        if (completeTask.checked) {
            removeTask.click();
            --i; // crutch ))
        }
    }
};

allTasks.onclick = function() {
    allTasks.style.backgroundColor = '#ad6069';
    activeTasks.style.backgroundColor = '#fcfcfc';
    completeTasks.style.backgroundColor = '#fcfcfc';
    var tasks = tasksList.getElementsByClassName('task');
    for (var i = 0; i < tasks.length; ++i) {
        tasks[i].style.display = '';
    }
    filter = 'all';
    saveToLocalStorage();
};

activeTasks.onclick = function() {
    allTasks.style.backgroundColor = '#fcfcfc';
    activeTasks.style.backgroundColor = '#ad6069';
    completeTasks.style.backgroundColor = '#fcfcfc';
    var tasks = tasksList.getElementsByClassName('task');
    for (var i = 0; i < tasks.length; ++i) {
        if (tasks[i].getElementsByClassName('task_complete')[0].checked) {
            tasks[i].style.display = 'none';
        } else {
            tasks[i].style.display = '';
        }
    }
    filter = 'active';
    saveToLocalStorage();
};

completeTasks.onclick = function() {
    allTasks.style.backgroundColor = '#fcfcfc';
    activeTasks.style.backgroundColor = '#fcfcfc';
    completeTasks.style.backgroundColor = '#ad6069';
    var tasks = tasksList.getElementsByClassName('task');
    for (var i = 0; i < tasks.length; ++i) {
        if (tasks[i].getElementsByClassName('task_complete')[0].checked) {
            tasks[i].style.display = '';
        } else {
            tasks[i].style.display = 'none';
        }
    }
    filter = 'complete';
    saveToLocalStorage();
};

function addTask(complete, text) {
    addTaskListItem(complete, text);
    updateCompleteAllTasks();
    updateActiveTasksCounter();
    saveToLocalStorage();
}

function addTaskListItem(complete, text) {
    // Create checkbox
    var completeTask = document.createElement('input');
    completeTask.type = 'checkbox';
    completeTask.checked = complete;
    completeTask.className = 'task_complete';
    completeTask.onclick = function() {
        taskText.style.textDecoration = (this.checked) ? 'line-through' : 'none';
        updateActiveTasksCounter();
        saveToLocalStorage();
    };

    // Create text
    var taskText = document.createElement('div');
    taskText.innerHTML = text;
    taskText.className = 'task_text';
    taskText.style.textDecoration = (complete) ? 'line-through' : 'none';
    taskText.style.display = 'block';
    taskText.ondblclick = function() {
        taskTextEditor.value = this.innerHTML;
        this.style.display = 'none';
        taskTextEditor.style.display = 'block';
        taskTextEditor.focus();
    };

    //Create text editor
    var taskTextEditor = document.createElement('input');
    taskTextEditor.style = 'text';
    taskTextEditor.className = 'task_text_editor';
    taskTextEditor.style.textDecoration = (complete) ? 'line-through' : 'none';
    taskTextEditor.style.display = 'none';
    taskTextEditor.onkeyup = function(event) {
        if (event.keyCode == 27) {
            this.style.display = 'none';
            taskText.style.display = 'block';
            return;
        }
        if (event.keyCode != 13) {
            return;
        }
        if (this.value == '') {
            alert('Task is empty!');
            return;
        }
        taskText.innerHTML = this.value;
        this.style.display = 'none';
        taskText.style.display = 'block';
        saveToLocalStorage();
    };
    taskTextEditor.onblur = function() {
        this.style.display = 'none';
        taskText.style.display = 'block';
    };

    // Create X
    var removeTask = document.createElement('div');
    removeTask.innerHTML = 'x';
    removeTask.className = 'task_remove';
    removeTask.onclick = function() {
        task.remove();
        updateActiveTasksCounter();
        saveToLocalStorage();
    };

    // Create new task and append it on the task list
    var task = document.createElement('div');
    task.className = 'task';
    task.appendChild(completeTask);
    task.appendChild(taskText);
    task.appendChild(taskTextEditor);
    task.appendChild(removeTask);
    task.onmouseover = function() {
        removeTask.style.visibility = 'visible';
    };
    task.onmouseout = function() {
        removeTask.style.visibility = 'hidden';
    };
    tasksList.appendChild(task);
}

function updateCompleteAllTasks() {
    var tasks = tasksList.getElementsByClassName('task');
    for (var i = 0; i < tasks.length; ++i) {
        if (!tasks[i].getElementsByClassName('task_complete')[0].checked) {
            completeAllTasks.checked = false;
            return;
        }
    }
    completeAllTasks.checked = true;
}

function updateActiveTasksCounter() {
    var tasks = tasksList.getElementsByClassName('task');
    var counter = 0;
    for (var i = 0; i < tasks.length; ++i) {
        if (!tasks[i].getElementsByClassName('task_complete')[0].checked) {
            ++counter;
        }
    }
    var activeTasksCounter = document.getElementById('active_tasks_counter');
    activeTasksCounter.innerHTML = 'Remain tasks: ' + counter;
}

function saveToLocalStorage() {
    var allTasks = tasksList.getElementsByClassName('task');
    var tasks = [];
    for (var i = 0; i < allTasks.length; ++i) {
        tasks[i] = [allTasks[i].getElementsByClassName('task_complete')[0].checked, allTasks[i].getElementsByClassName('task_text')[0].innerHTML];
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('filter', filter);
}

function restoreFromLocalStorage() {
    filter = localStorage.getItem('filter');
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    for (var i = 0; i < tasks.length; ++i) {
        addTaskListItem(tasks[i][0], tasks[i][1]);
    }
}

function applyFilter() {
    switch (filter) {
        case 'all':
            allTasks.click();
            break;
        case 'active':
            activeTasks.click();
            break;
        case 'complete':
            completeTasks.click();
            break;
    }
}

restoreFromLocalStorage();
updateActiveTasksCounter();
applyFilter();
newTaskTextEditor.focus();
