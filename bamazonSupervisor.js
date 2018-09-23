

var inquirer = require("inquirer");
var mysql = require("mysql");
const { table } = require('table');

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

function superInit() {
inquirer.prompt([{
    type: "list",
    message: "Select option:",
    choices: ["View Product Sales by Department", "Create New Department", "Exit"],
    name: "superOptions"
}])
    .then(res => {

        switch (res.superOptions) {
            case "View Product Sales by Department":
                departmentSales();
                break;
            case "Create New Department":
                createNewDepartment();
                break;
            case "Exit":
                console.log("Exiting application.");
                connection.end(function (err) {
                    // The connection is terminated now
                });
                break;
        }


    });
};


superInit();

function departmentSales() {


    let data,
        output;

    data = [
        ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"]
    ];

    connection.query(`SELECT department_id, departments.department_name, product_sales, over_head_costs 
                    FROM products
                    RIGHT JOIN departments ON products.department_name = departments.department_name
                    GROUP BY departments.department_name`, function (err, res, fields) {

            if (err) throw err;


            var n = res.length;

            for (let i = 0; i < n; i++) {

                if (res[i].product_sales === null) {

                    res[i].product_sales = 0;
                }
                var totalProfit = res[i].product_sales - res[i].over_head_costs;

                let departmentArr = [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, totalProfit];
                data.push(departmentArr);

            }

            output = table(data);

            console.log(output);

            superInit();

        });

}

function createNewDepartment() {

    inquirer
        .prompt([{
            type: "input",
            message: "What is the name of the department you wish to add?",
            name: "departmentName"
        }])
        .then(res => {
            var departmentName = res.departmentName;

            inquirer
                .prompt([{
                    type: "input",
                    message: "What are the overhead costs of the department?",
                    name: "departmentOverhead"
                }])
                .then(res => {
                    var departmentOverhead = res.departmentOverhead;

                    connection.query(`INSERT INTO departments
                    set department_name = ?,
                        over_head_costs = ?`, [departmentName, departmentOverhead], function (err, res, fields) {
                            if (err) throw err;

                            console.log(departmentName + " added!");
                            superInit();
                        })

        

                });


        });

};