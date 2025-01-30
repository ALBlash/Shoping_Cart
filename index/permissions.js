const permissionsSet = new Set([
    'ADD_TO_CART',
    'REMOVE_FROM_CART',
    'EMPTY_CART',
    'DISCOUNT_15'
]);

const loggedInUserEmail = sessionStorage.getItem("loggedInUserEmail");
const usersFromSession = JSON.parse(sessionStorage.getItem("users"));
// Key:loggedInUserEmail,  Value:example@gmail.com  //// searching for the name of the user that loggedIn

//  we iterate through the users, and try to find and compare, user במקום האפס which is the email, 
// and the email that is now looged in the session storage, and then we get his object ( [1] ) that contains his information
const loggedInUser = usersFromSession.find(user => user[0] === loggedInUserEmail)[1];




// depends what permissions the user has thats what he will be able to do
const userPermissions = new Set(loggedInUser.permissions);

// removing options depends by the permissions the user got
if (!userPermissions.has('ADD_TO_CART')) {
    document.querySelectorAll('.add-to-cart').forEach(elem => elem.remove());
}

if (!userPermissions.has('REMOVE_FROM_CART')) {
    document.querySelectorAll('.remove-from-cart').forEach(elem => elem.remove());
}

if (!userPermissions.has('ADD_TO_CART') && !userPermissions.has('REMOVE_FROM_CART')) {
    document.querySelectorAll('.cart-action').forEach(elem => elem.remove());
}

if (!userPermissions.has('EMPTY_CART')) {
    document.getElementById('btnEmpty').remove();
}

updateUserDiscount();


// calculate the discount
function updateUserDiscount() {
    if (userPermissions.has('DISCOUNT_15')) {
        const totalAmount = document.getElementById('totalAmount');
        const tbody = document.getElementById('cartTableBody');

        // slice remove's the $ sign
        tbody.innerHTML += `
            <tr>
                <td colspan="3">Discount 15%</td>
                <td class="text-right">-$${Number(totalAmount.innerText.slice(1)) * 0.15}</td>
            </tr>
        `;
        totalAmount.innerText = `$${Number(totalAmount.innerText.slice(1)) * 0.85}`;
    }
}