function isUserLoggedIn() {
    // truth or false
    return !!sessionStorage.getItem("loggedInUserEmail");
}

if (!isUserLoggedIn()) {
    window.location.href = "../login/login.html";
}

function initSession() {
    // we get the user's (who is logged in) email
    const loggedInUserEmail = sessionStorage.getItem("loggedInUserEmail");
    // we get the array of users with all the information
    const users = JSON.parse(sessionStorage.getItem("users"));
    // we do the "find" loop and check which key of user's (the key is the email address of the users) so we can confirm the user and take out it's fullname
    const loggedInUser = users.find(user => user[0] === loggedInUserEmail)[1];
    document.getElementById('welcome-username').innerText = `welcome ${loggedInUser.fullname}`
}

function logout() {
    sessionStorage.removeItem('loggedInUserEmail');
    sessionStorage.removeItem('shopping-cart');
    window.location.href = "../login/login.html";
}