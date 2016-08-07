const USER_NAME = 'sergey';
const USER_PASSWORD = 'sergey';

var userName, filter;

function updateUserRequest(userId, userName, userPassword, filter) {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/update/user/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            user_name: userName,
            user_password: userPassword,
            filter: filter
        }),
        dataType: 'json',
        success: function () {
            console.log('ready');
        }
    });
}

function readUserRequest(userName, userPassword) {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/read/user/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_name: userName,
            user_password: userPassword
        }),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.length) {
                alert('Wrong user name and password!');
                return;
            }
            userId = response.data[0].user_id;
            filter = response.data[0].filter;
            readTasksRequest(userId, filter);
        }
    });
}

function createTaskRequest(userId, taskText) {
    var taskComplete = false;
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/create/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            task_text: taskText,
            task_complete: taskComplete
        }),
        dataType: 'json',
        success: function (response) {
            addTaskListItem(response.data, taskText, taskComplete);
        }
    });
}

function updateTaskRequest(taskId, taskText, taskComplete) {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/update/',
        contentType: 'application/json',
        data: JSON.stringify({
            task_id: taskId,
            task_text: taskText,
            task_complete: taskComplete
        }),
        dataType: 'json',
        success: function () {
            updateTaskListItem(taskId, taskText, taskComplete);
        }
    });
}

function readTasksRequest(userId, filter) {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/read/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            filter: filter
        }),
        dataType: 'json',
        success: function (response) {
            updateTasksList(response.data);
        }
    });
}

function deleteTaskRequest(taskId) {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/delete/',
        contentType: 'application/json',
        data: JSON.stringify({
            task_id: taskId
        }),
        dataType: 'json',
        success: function () {
            removeTaskListItem(taskId);
        }
    });
}

function showTaskTextEditor(taskId) {
    var taskListItem = $('#' + taskId);
    taskListItem.children('.task_text').css('display', 'none');
    taskListItem.children('.task_text_editor').css('display', 'block').focus();
}

function hideTaskTextEditor(taskId) {
    var taskListItem = $('#' + taskId);
    taskListItem.children('.task_text_editor').css('display', 'none');
    taskListItem.children('.task_text').css('display', 'block');
}

function showTaskRemove(taskId) {
    $('#' + taskId).children('.task_remove').css('visibility', 'visible');
}

function hideTaskRemove(taskId) {
    $('#' + taskId).children('.task_remove').css('visibility', 'hidden');
}

function updateTaskListItem(taskId, taskText, taskComplete) {
    var taskListItem = $('#' + taskId);
    taskListItem.children('.task_complete').prop('checked', taskComplete);
    taskListItem.children('.task_text').text(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none');
    taskListItem.children('.task_text_editor').val(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none');
    updateCompleteAllTasks();
}

function removeTaskListItem(taskId) {
    $('#' + taskId).remove();
    updateCompleteAllTasks();
}

function addTaskListItem(taskId, taskText, taskComplete) {
    $('#tasks_list').append($('<div>').attr('class', 'task').attr('id', taskId).mouseover(function () {
        showTaskRemove(taskId);
    }).mouseout(function () {
        hideTaskRemove(taskId);
    }).append($('<input>').attr('type', 'checkbox').attr('class', 'task_complete').prop('checked', taskComplete).click(function () {
        taskComplete = $(this).prop('checked');
        updateTaskRequest(taskId, taskText, taskComplete);
    })).append($('<div>').attr('class', 'task_text').text(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none').css('display', 'block').dblclick(function () {
        showTaskTextEditor(taskId);
    })).append($('<input>').attr('type', 'text').attr('class', 'task_text_editor').val(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none').css('display', 'none').blur(function () {
        hideTaskTextEditor(taskId);
        updateTaskListItem(taskId, taskText, taskComplete);
    }).keyup(function (event) {
        if (event.keyCode == 27) {
            $(this).blur();
            return;
        }
        if (event.keyCode != 13) {
            return;
        }
        taskText = $(this).val();
        if (taskText == '') {
            alert('Task is empty!');
            return;
        }
        hideTaskTextEditor(taskId);
        updateTaskRequest(taskId, taskText, taskComplete);
    })).append($('<div>').text('x').attr('class', 'task_remove').click(function () {
        deleteTaskRequest(taskId);
    })));
    updateCompleteAllTasks();
}

function updateTasksList(tasks) {
    var tasksList = $('#tasks_list');
    tasksList.empty();
    tasks.forEach(function (task) {
        addTaskListItem(task.task_id, task.task_text, task.task_complete);
    });
}

function updateCompleteAllTasks() {
    $('#complete_all_tasks').prop('checked', !($('.task_complete:not(:checked)').length));
}

$('#complete_all_tasks').click(function () {
    $('.task_complete'+ (($(this).prop('checked')) ? ':not(:checked)' : ':checked')).click();
});

$('#remove_completed_tasks').click(function () {
    readTasksRequest(userId, 'complete');
});

$('#new_task_text_editor').keyup(function (event) {
    if (event.keyCode == 27) {
        $(this).val('');
        return;
    }
    if (event.keyCode != 13) {
        return;
    }
    var taskText = $(this).val();
    if (taskText == '') {
        alert('Task is empty!');
        return;
    }
    $(this).val('');
    createTaskRequest(userId, taskText);
});

// removeCompletedTasks.onclick = function() {
//     var tasks = tasksList.getElementsByClassName('task');
//     for (var i = 0; i < tasks.length; ++i) {
//         var completeTask = tasks[i].getElementsByClassName('task_complete')[0];
//         var removeTask = tasks[i].getElementsByClassName('task_remove')[0];
//         if (completeTask.checked) {
//             removeTask.click();
//             --i; // crutch ))
//         }
//     }
// };

$('#all_tasks').click(function () {
    $(this).css('backgroundColor', '#ad6069');
    $('#active_tasks').css('backgroundColor', '#fcfcfc');
    $('#completed_tasks').css('backgroundColor', '#fcfcfc');
    filter = 'all';
    readTasksRequest(userId, filter);
});

$('#active_tasks').click(function () {
    $('#all_tasks').css('backgroundColor', '#fcfcfc');
    $(this).css('backgroundColor', '#ad6069');
    $('#completed_tasks').css('backgroundColor', '#fcfcfc');
    filter = 'active';
    readTasksRequest(userId, filter);
});

$('#completed_tasks').click(function () {
    $('#all_tasks').css('backgroundColor', '#fcfcfc');
    $('#active_tasks').css('backgroundColor', '#fcfcfc');
    $(this).css('backgroundColor', '#ad6069');
    filter = 'complete';
    readTasksRequest(userId, filter);
});

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

function applyFilter() {
    if (!filter) {
        filter = 'all';
    }
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

readUserRequest(USER_NAME, USER_PASSWORD);

// updateActiveTasksCounter();
// applyFilter();
