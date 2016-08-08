var userName;
var userPassword;

$('input:submit').click(function () {
    userName = $('#user_name').val();
    userPassword = $('#user_password').val();
    readUserRequest(userName, userPassword);
});

$('div').click(function () {
    userName = $('#user_name').val();
    userPassword = $('#user_password').val();
    createUserRequest(userName, userPassword);
});