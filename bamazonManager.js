var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
});

beginPrompt();

function beginPrompt() {

    inquirer
        .prompt([{
            type: "list",
            message: "Pick an option below:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "manageOptions"
        }])
        .then(res => {
            switch (res.manageOptions) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowQuantity();
                    break;
                case "Add to Inventory":
                    addMore();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                case "Exit":
                    console.log("Exiting application.");
                    connection.end(function(err) {
                        // The connection is terminated now
                    });
                    break;
            }
        });

};
function viewProducts() {
    connection.query("SELECT * FROM products;", function (err, res, fields) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log("-------------------------")
            console.log("ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Price: $" + res[i].price);
            console.log("Stock Quantity: " + res[i].stock_quantity);
        }
        beginPrompt();
    })
};

function viewLowQuantity() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res, fields) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log("-------------------------")
            console.log("RUNNING LOW!")
            console.log("ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Price: $" + res[i].price);
            console.log("Stock Quantity: " + res[i].stock_quantity);
        }
        beginPrompt();
    })
}

function addMore() {
    inquirer
        .prompt([{
            type: "input",
            message: "Input the ID of the item you want to restock:",
            name: "purchaseID"
        }])
        .then(res => {
            var productID = res.purchaseID;
            inquirer
                .prompt([{
                    type: "input",
                    message: "Input the quantity you wish to restock:",
                    name: "addQuantity"
                }])
                .then(res => {
                    var addQuantity = res.addQuantity
                    connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [addQuantity, productID], function (err, res, fields) {
                        if (err) throw err;
                        console.log(addQuantity + " more added!");
                        beginPrompt();
                    })
                });
        });
}

function addNewProduct() {
    inquirer
        .prompt([{
            type: "input",
            message: "What is the name of the product you wish to add?",
            name: "productName"
        }])
                .then(res => {
                    var productName = res.productName;
                    inquirer
                        .prompt([{
                            type: "input",
                            message: "What is the price of the product?",
                            name: "productPrice"
                        }])
                        .then(res => {
                            var productPrice = res.productPrice;
                            inquirer
                                .prompt([{
                                    type: "input",
                                    message: "How much of this product would you like to stock?",
                                    name: "productStock"
                                }])
                                .then(res => {
                                    var productStock = res.productStock;
                                    connection.query(`INSERT INTO products 
                                                    SET product_name = ?,
                                                    price = ?,
                                                    stock_quantity = ?`, [productName, productPrice, productStock], function (err, res, fields) {
                                            if (err) throw err;
                                            console.log("-------------------------")
                                            console.log("Product Name: " + productName);
                                            console.log("Price: $" + productPrice);
                                            console.log("Stock Quantity: " + productStock);
                                            console.log("-------------------------")
                                            console.log("New product added!");
                                            beginPrompt();
                                        })
                                });
                        });
          
        });
};