// a User function for creating user's
function User(username, email, fullname, password, lastLoginDate, permissions) {
    this.username = username;
    this.email = email;
    this.fullname = fullname;
    this.password = password;
    this.lastLoginDate = lastLoginDate;
    this.permissions = permissions;
}

const users = getUsers();

// so we dont need to create the Users over and over again we keep them in the sessionStorage and check their permissions
function getUsers() {
    if (!!sessionStorage.getItem('users')) {
        const users = JSON.parse(sessionStorage.getItem('users'));
        users.forEach(user => user[1].permissions = new Set(user[1].permissions));
        return new Map(users);
    }
    else {
        // if the users are not located in the session then we create them here and save them
        // as key(user email) value(all the user info)
        const user1 = new User("user1", "user1@gmail.com", "User 1", "A123456", null, ['ADD_TO_CART', 'DISCOUNT_15']);
        const user2 = new User("user2", "user2@gmail.com", "User 2", "A123456", null, ['EMPTY_CART', 'ADD_TO_CART']);
        const user3 = new User("user3", "user3@gmail.com", "User 3", "A123456", null, ['DISCOUNT_15', 'EMPTY_CART', 'ADD_TO_CART']);
        const user4 = new User("user4", "user4@gmail.com", "User 4", "A123456", null, ['ADD_TO_CART', 'REMOVE_FROM_CART', 'EMPTY_CART', 'DISCOUNT_15']);
        const user5 = new User("user5", "user5@gmail.com", "User 5", "A123456", null, ['DISCOUNT_15']);

        const users = [
            [user1.email, user1],
            [user2.email, user2],
            [user3.email, user3],
            [user4.email, user4],
            [user5.email, user5],
        ];

        sessionStorage.setItem('users', JSON.stringify(users));
        users.forEach(user => user[1].permissions = new Set(user[1].permissions));
        //  the reason we keep them in a map is the key value method
        return new Map(users);
    }
}

const loginForm = document.querySelector(".form-login");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!validate(email, password)) {
            alert("Email or password are invalid!");
        } else if (!isUserExist(email, password)) {
            alert("User was not found for the given credentials");
        } else {
            updateUserLastLoginDate(email);
            sessionStorage.setItem("loggedInUserEmail", email);
            window.location.href = "./index/index.html";
        }
    });
}

function validate(email, password) {
    const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    return (
        emailRegex.test(email) &&
        password.length >= 6 &&
        password.toLowerCase() !== password
    );
}

//Check the sessionStorage for the user's existence
// first with the email & then the password
function isUserExist(email, password) {
    if (users.has(email)) {
        return users.get(email).password === password;
    }
    return false;
}

// "DD-MM-YYYY HH:mm"
function updateUserLastLoginDate(email) {
    const now = new Date();
    const day = now.getDate() < 10 ? "0" + now.getDate() : "" + now.getDate();
    const month =
        now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : "" + (now.getMonth() + 1);

    const year = "" + now.getFullYear();

    const hours =
        now.getHours() < 10 ? "0" + now.getHours() : "" + now.getHours();
    const minutes =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : "" + now.getMinutes();

    let datetime = `${day}-${month}-${year} ${hours}:${minutes}`;

    // the user that has past all the validation's we add to his "lastLoginDate" the exact time he enterd
    users.get(email).lastLoginDate = datetime;
}
