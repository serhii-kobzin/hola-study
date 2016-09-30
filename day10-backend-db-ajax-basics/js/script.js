var userId, filter;

function createUserRequest(userName, userPassword) {
    var filter = 'all';
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/create/user/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_name: userName,
            user_password: userPassword,
            filter: filter
        }),
        dataType: 'json',
        success: function (response) {
            console.log('create user');
            if (response.status != 'ok') {
                alert(response.data);
                return;
            }
            userId = response.data;
            hideLogin();
            applyFilter(filter);
        }
    });
}

function updateUserRequest(userId, filter) {
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/update/user/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            filter: filter
        }),
        dataType: 'json',
        success: function () {
        }
    });
}

function readUserRequest(userName, userPassword) {
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/read/user/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_name: userName,
            user_password: userPassword
        }),
        dataType: 'json',
        success: function (response) {
            if (response.status != "ok") {
                alert(response.data);
                return;
            }
            userId = response.data.user_id;
            filter = response.data.filter;
            hideLogin();
            applyFilter(filter);
            $('#new_task_text_editor').focus();
        }
    });
}

function createTaskRequest(userId, taskText) {
    var taskComplete = false;
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/create/task/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            task_text: taskText,
            task_complete: taskComplete
        }),
        dataType: 'json',
        success: function (response) {
            addTaskListItem(response.data, taskText, taskComplete);
            updateActiveTasksCounter(response.count);
        }
    });
}

function updateTaskRequest(userId, taskId, taskText, taskComplete) {
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/update/task/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            task_id: taskId,
            task_text: taskText,
            task_complete: taskComplete
        }),
        dataType: 'json',
        success: function (response) {
            updateTaskListItem(taskId, taskText, taskComplete, filter);
            updateActiveTasksCounter(response.count);
        }
    });
}

function readTasksRequest(userId, filter) {
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/read/tasks/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            filter: filter
        }),
        dataType: 'json',
        success: function (response) {
            updateTasksList(response.data);
            updateActiveTasksCounter(response.count);
        }
    });
}

function deleteTaskRequest(userId, taskId) {
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/delete/task/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId,
            task_id: taskId
        }),
        dataType: 'json',
        success: function (response) {
            removeTaskListItem(taskId);
            updateActiveTasksCounter(response.count);
        }
    });
}

function deleteCompletedTasksRequest(userId) {
    $.ajax({
        method: 'POST',
        url: '/skobzin/day10-backend-db-ajax-basics/delete/tasks/',
        contentType: 'application/json',
        data: JSON.stringify({
            user_id: userId
        }),
        dataType: 'json',
        success: function (response) {
            applyFilter(filter);
            updateActiveTasksCounter(response.count);
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

function updateTaskListItem(taskId, taskText, taskComplete, filter) {
    var taskListItem = $('#' + taskId);
    if ((filter == 'active') || (filter == 'complete')) {
        taskListItem.css('display', 'none');
    } else {
        taskListItem.children('.task_complete').prop('checked', taskComplete);
        taskListItem.children('.task_text').text(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none');
        taskListItem.children('.task_text_editor').val(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none');
    }
    updateCompleteAllTasksState();
}

function removeTaskListItem(taskId) {
    $('#' + taskId).remove();
    updateCompleteAllTasksState();
}

function addTaskListItem(taskId, taskText, taskComplete) {
    $('#tasks_list').append($('<div>').attr('class', 'task').attr('id', taskId).mouseover(function () {
        showTaskRemove(taskId);
    }).mouseout(function () {
        hideTaskRemove(taskId);
    }).append($('<input>').attr('type', 'checkbox').attr('class', 'task_complete').prop('checked', taskComplete).click(function () {
        taskComplete = $(this).prop('checked');
        updateTaskRequest(userId, taskId, taskText, taskComplete);
    })).append($('<div>').attr('class', 'task_text').text(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none').css('display', 'block').dblclick(function () {
        showTaskTextEditor(taskId);
    })).append($('<input>').attr('type', 'text').attr('class', 'task_text_editor').val(taskText).css('text-decoration', (taskComplete) ? 'line-through' : 'none').css('display', 'none').blur(function () {
        hideTaskTextEditor(taskId);
        updateTaskListItem(taskId, taskText, taskComplete, filter);
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
        updateTaskRequest(userId, taskId, taskText, taskComplete);
    })).append($('<div>').text('x').attr('class', 'task_remove').click(function () {
        deleteTaskRequest(userId, taskId);
    })));
    updateCompleteAllTasksState();
}

function updateTasksList(tasks) {
    var tasksList = $('#tasks_list');
    tasksList.empty();
    tasks.forEach(function (task) {
        addTaskListItem(task.task_id, task.task_text, task.task_complete);
    });
}

function updateCompleteAllTasksState() {
    $('#complete_all_tasks').prop('checked', !($('.task_complete:not(:checked)').length));
}

function updateActiveTasksCounter(count) {
    $('#active_tasks_counter').text('Remain tasks: ' + count);
}

function hideLogin() {
    $('#login').css('display', 'none');
    $('#new_task').css('display', 'flex');
    $('#tasks').css('display', 'flex');
}

function applyFilter(filter) {
    switch (filter) {
        case 'all':
            $('#all_tasks').click();
            break;
        case 'active':
            $('#active_tasks').click();
            break;
        case 'complete':
            $('#completed_tasks').click();
            break;
    }
}

$('#user_name').keyup(function (event) {
    if (event.keyCode != 13) {
        return;
    }
    var userPassword = $('#user_password');
    if (userPassword.val()) {
        $('input:submit').click();
    } else {
        userPassword.focus();
    }
});

$('#user_password').keyup(function (event) {
    if (event.keyCode != 13) {
        return;
    }
    var userName = $('#user_name');
    if (userName.val()) {
        $('input:submit').click();
    } else {
        userName.focus();
    }
});

$('input:submit').click(function () {
    var userName = $('#user_name').val();
    var userPassword = $('#user_password').val();
    if ((!userName) || (!userPassword)) {
        alert('User name or password is empty!');
        return;
    }
    readUserRequest(userName, userPassword);
});

$('input:button').click(function () {
    var userName = $('#user_name').val();
    var userPassword = $('#user_password').val();
    if ((!userName) || (!userPassword)) {
        alert('User name or password is empty!');
        return;
    }
    createUserRequest(userName, userPassword);
});

$('#complete_all_tasks').click(function () {
    $('.task_complete'+ (($(this).prop('checked')) ? ':not(:checked)' : ':checked')).click();
});

$('#remove_completed_tasks').click(function () {
    deleteCompletedTasksRequest(userId);
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

$('#all_tasks').click(function () {
    $(this).css('backgroundColor', '#ad6069');
    $('#active_tasks').css('backgroundColor', '#fcfcfc');
    $('#completed_tasks').css('backgroundColor', '#fcfcfc');
    filter = 'all';
    updateUserRequest(userId, filter);
    readTasksRequest(userId, filter);
});

$('#active_tasks').click(function () {
    $('#all_tasks').css('backgroundColor', '#fcfcfc');
    $(this).css('backgroundColor', '#ad6069');
    $('#completed_tasks').css('backgroundColor', '#fcfcfc');
    filter = 'active';
    updateUserRequest(userId, filter);
    readTasksRequest(userId, filter);
});

$('#completed_tasks').click(function () {
    $('#all_tasks').css('backgroundColor', '#fcfcfc');
    $('#active_tasks').css('backgroundColor', '#fcfcfc');
    $(this).css('backgroundColor', '#ad6069');
    filter = 'complete';
    updateUserRequest(userId, filter);
    readTasksRequest(userId, filter);
});

$('#user_name').focus();