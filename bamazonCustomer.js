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
    console.log("connected as id " + connection.threadId);

});

function initial(cb) {

    connection.query("SELECT item_id, product_name, price FROM products;", function (err, res, fields) {

        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            console.log("-------------------------")
            console.log("ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Price: $" + res[i].price);

        }

        cb();

    })

}

initial(function () {
    inquirer
        .prompt([{
            type: "input",
            message: "Input the ID of the item you wish to purchase.",
            name: "purchaseID"
        }])
        .then(res => {

            var productID = res.purchaseID;

            inquirer
                .prompt([{
                    type: "input",
                    message: "How many units do you wish to purchase?",
                    name: "purchaseNumber"
                }])
                .then(res => {

                    var purchaseNumber = res.purchaseNumber;

                    connection.query("SELECT stock_quantity, price FROM products WHERE item_id = ?", [productID], function (err, res, fields) {

                        if (err) throw err;

                        var itemPrice = res[0].price;
                        var stockQuantity = res[0].stock_quantity;

                        if (purchaseNumber > stockQuantity) {
                            console.log("Insufficient quantity! Goodbye!")
                            connection.end(function (err) {
                                // The connection is terminated now
                            });
                        } else if (purchaseNumber <= stockQuantity) {

                            var newQuantity = stockQuantity - purchaseNumber;
                            var totalCost = purchaseNumber * itemPrice

                            connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [newQuantity, totalCost, productID], function (err, res, fields) {

                                if (err) throw err;

                                console.log("The total cost of your purchase was $" + totalCost + ". Have a nice day!");

                                connection.end(function (err) {
                                    // The connection is terminated now
                                });




                            })
                        }

                    }

                    )

                });

        });
});