//products that will be created in a the function showProductGallery(),
// they include all the necessary information that we need (id, title, price, img/src);

const productItem = [
    new Product(1, "FinePix Pro2 3D Camera", "1800.00", "camera.jpg"),
    new Product(2, "EXP Portable HD", "800.00", "external-hard-drive.jpg"),
    new Product(3, "Luxury Ultra thin Wrist Watch", "500.00", "watch.jpg"),
    new Product(4, "XP 1155 Intel Core Laptop", "1000.00", "laptop.jpg"),
    new Product(5, "Apple Watch", "1400.00", "daniel-korpai-hbTKIbuMmBI-unsplash.jpg"),
    new Product(6, "Air-Pods Pro 2", "700.00", "airpods.png"),
    new Product(7, "Water Bottle", "60.00", "ryan-hoffman-Kf6UgCx5mb8-unsplash.jpg"),
];

showProductGallery(productItem);
showCartTable();

function Product(id, name, price, photo) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.photo = photo;
}

function addToCart(element) {
    let productParent = element.closest("div.product-item");
    let id = productParent.querySelector(".productid").value;
    let price = productParent.querySelector(".price span").innerText;
    let name = productParent.querySelector(".productname").innerText;
    let quantity = productParent.querySelector(".product-quantity").value;

    let cartItem = {
        id: id,
        name: name,
        price: price,
        quantity: quantity,
    };

    let cartArray = new Array();
    // If javascript shopping cart session is not empty
    if (sessionStorage.getItem("shopping-cart")) {
        cartArray = JSON.parse(sessionStorage.getItem("shopping-cart"));
        const itemIndex = cartArray.findIndex((item) => item.id === id);
        if (itemIndex !== -1) {
            cartArray[itemIndex].quantity =
                Number(cartArray[itemIndex].quantity) + Number(quantity);
        } else {
            cartArray.push(cartItem);
        }
    } else {
        cartArray.push(cartItem);
    }

    let cartJSON = JSON.stringify(cartArray);
    sessionStorage.setItem("shopping-cart", cartJSON);

    showCartTable();
    updateUserDiscount();
}

function removeFromCart(element) {
    let productParent = element.closest("div.product-item");
    let id = productParent.querySelector(".productid").value;
    let quantity = productParent.querySelector(".product-quantity").value;

    let cartArray = new Array();
    // If shopping cart session is not empty
    if (sessionStorage.getItem("shopping-cart")) {

        // parse the item that's in the session and add it to the cartArray
        cartArray = JSON.parse(sessionStorage.getItem("shopping-cart"));
        //comparing between the 2 products id's
        const itemIndex = cartArray.findIndex((item) => item.id === id);

        // Check if the item with the given id is found in the cartArray
        if (itemIndex !== -1) {
            // Update the quantity in the cartArray, ensuring it's not negative
            //Math.max makes sure that the quantity dont go below zero
            cartArray[itemIndex].quantity = Math.max(
                Number(cartArray[itemIndex].quantity) - Number(quantity),
                0
            );



            // If the quantity becomes zero, remove the item from the cartArray
            if (!cartArray[itemIndex].quantity) {
                cartArray = cartArray.filter(
                    (value, index) => index !== itemIndex
                );
            }
        } else {
            alert("This item is not in your cart");
        }
    }

    let cartJSON = JSON.stringify(cartArray);
    sessionStorage.setItem("shopping-cart", cartJSON);

    showCartTable();
    updateUserDiscount();
}




// every we time we update the table its also being saved in the session
// so if we press empty it will remove it from the session and
// we call the function thats incharge on the table
function emptyCart() {
    if (sessionStorage.getItem("shopping-cart")) {
        sessionStorage.removeItem("shopping-cart");
        showCartTable();
    }
}




// every time a user add's something to the list this function will builed and update the table
// and other calculations like what the user can buy and discount... (permissions)
// are located in the permissions.js
function showCartTable() {
    let cartRowHTML = "";
    let itemCount = 0;
    let grandTotal = 0;

    let price = 0;
    let quantity = 0;
    let subTotal = 0;


    //if the user has been here and he refreshed the page 
    // the item's will show becouse its saved on the sessionStorage
    if (sessionStorage.getItem("shopping-cart")) {
        let shoppingCart = JSON.parse(sessionStorage.getItem("shopping-cart"));

        //Iterate javascript shopping cart array
        shoppingCart.forEach(function (item) {
            // to do the math we convert the number's 
            //using [parseFloat] and [parseInt];
            price = parseFloat(item.price);
            quantity = parseInt(item.quantity);
            subTotal = price * quantity;
            itemCount += quantity;

            cartRowHTML +=
                "<tr>" +
                "<td>" +
                item.name +
                "</td>" +
                "<td class='text-right'>$" +
                // ensures that the price will be max of two digits after the dot ("10.00" and not "10.0000231")
                price.toFixed(2) +
                "</td>" +
                "<td class='text-right'>" +
                quantity +
                "</td>" +
                "<td class='text-right'>$" +
                subTotal.toFixed(2) +
                "</td>" +
                "</tr>";

            grandTotal += subTotal;
        });
    }

    document.querySelector("#cartTableBody").innerHTML = cartRowHTML;
    document.querySelector("#itemCount").innerText = itemCount;
    document.querySelector("#totalAmount").innerText =
        "$" + grandTotal.toFixed(2);
}

function showProductGallery(product) {
    //Iterate javascript shopping cart array
    let productHTML = "";
    product.forEach((item) => {
        productHTML +=
            '<div class="product-item">' +
            '<input class="productid" type="hidden" value="' + item.id + '">' +
            '<img class="img-size" src="../product-images/' + item.photo + '">' +
            '<div class="productname">' + item.name + "</div>" +
            '<div class="price">$<span>' + item.price + "</span></div>" +
            '<div class="cart-action">' +
            '<input type="number" class="product-quantity" name="quantity" value="1" size="2" min="1" />' +
            '<input type="submit" value="Add" class="add-to-cart" onClick="addToCart(this)" />' +
            '<input type="submit" value="Remove" class="remove-from-cart" onClick="removeFromCart(this)" />' +
            "</div>" +
            "</div>";
        ("<tr>");
    });

    document.querySelector("#product-item-container").innerHTML = productHTML;
}
