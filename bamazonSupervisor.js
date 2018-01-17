// , (product_sales - over_head_costs) total_profit

  // * Create a new Node application called `bamazonManager.js`. Running this application will:

  //   * List a set of menu options:

  //     * View Products for Sale
      
  //     * View Low Inventory
      
  //     * Add to Inventory
      
  //     * Add New Product

  //   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  //   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  //   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

//Require
  var inquirer = require("inquirer");
  var fs = require("fs");
  var mysql = require("mysql");
//Variables
  var productsById = [];
  var productsByName = [];
  var departmentsList = [];
//Connect to bamazon database
  var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    makeDepArray(action);
  });
//First view for adding departments
	function makeDepArray(func) {
	    var query = connection.query("SELECT department_name FROM departments GROUP BY department_name;", function(err, res) {
	    	departmentsList = [];
			for (var i = 0; i < res.length; i++) {
				departmentsList.push(res[i].department_name);
			}
			func();
	    });

	}
//Add a new department

  function addDep(depa, cost) {
    var query = connection.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?);', [depa, cost], function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //updateProduct2(productID, added);
        // console.log("Results: "+ JSON.stringify(res, null, 2));
        console.log("You have added '"+ depa + "' with a "+Number(cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' })+" over head cost.")
        makeDepArray(action);
      });
  }
//Inquirer for adding completely new department
  function addDepInq() {
    // console.log(JSON.stringify(productsByName, null, 2));
    inquirer
        .prompt([
          {
            type: "input",
            message: "Select new department name:",
            name: "department",
            validate: function(value) {
              if (!value.trim()){
                return "Please give a name to the new department.";
              } else if (departmentsList.indexOf(value) != -1) {
                return "Department already exists.";
              }
              return true;
            }
          },
          {
            type: 'input',
            name: 'cost',
            message: 'What are the over head costs?',
            validate: function(value) {
              if(value == parseFloat(value, 10).toFixed(2) && value >= 0) {
                var valid = true;
              }
              // var valid = !isNaN(parseInt(value));
              return valid || 'Please enter a cost.';
            },
            filter: Number
          },
          {
            type: "confirm",
            message: "Are you sure?",
            name: "confirm"
          }
        ])
        .then(function(inquirerResponse) {
          fs.appendFile( "log.txt", "\nDepartment: "+inquirerResponse.department+", Price: "+inquirerResponse.price+", Quantity: "+inquirerResponse.quantity+", Confirmed: "+inquirerResponse.confirm, function(error) {
          if (error) {
            console.log(error);
            fs.appendFile( "log.txt", "\n"+ JSON.stringify(error, null, 2), function(err) {
            // If an error was experienced we say it.
            if (err) {
              console.log(err);
            }
            });
          }
        });
          if(inquirerResponse.confirm) {
            addDep(inquirerResponse.department, inquirerResponse.cost);
          } else {
            action();
          }
          
        });
  }
//Display all products

  function displayAll(hidden) {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(" | ID | Department | Product Name | Price | Quantity in Stock |")
      productsById = [];
      for (var i = 0; i < res.length; i++) {
        productsById[i] = res[i].id;
        productsByName[i] = res[i].product_name;
        if (!hidden)  {
          if (res[i].stock_quantity < 1) {
            console.log(" | " + res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity+ " | OUT OF STOCK");
          } else {
            console.log(" | " + res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
          }
        }
        
      }
      
    action();
    });
    
  }
//Display one Department
  function displayByDep() {
    var query = connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, (products.product_sales - departments.over_head_costs) total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_id;", function(err, res) {
        console.log(" | ID | Department | Over Head Costs | Product Sales | Total Profit |");
          for (var i = 0; i < res.length; i++) {
            console.log(" | " + res[i].department_id + " | " + res[i].department_name + " | " + Number(res[i].over_head_costs).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) + " | " + Number(res[i].product_sales).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) + " | " + Number(res[i].total_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' })+ " |");
          }
          action();
      });
	}


  // 5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

  // | department_id | department_name | over_head_costs | product_sales | total_profit |
  // | ------------- | --------------- | --------------- | ------------- | ------------ |
  // | 01            | Electronics     | 10000           | 20000         | 10000        |
  // | 02            | Clothing        | 60000           | 100000        | 40000        |
//Inquirer for displaying by department if later making an option to view just one in detail
	function displayByDepInq() {
		inquirer
        .prompt([
          {
            type: "list",
            message: "Which Department would you like to display",
            choices: departmentsList,
            name: "department"
          },
          {
            type: "confirm",
            message: "Are you sure?",
            name: "confirm"
          }
        ])
        .then(function(inquirerResponse) {
          fs.appendFile( "log.txt", "\nDepartment: "+inquirerResponse.department+", Confirmed: "+inquirerResponse.confirm, function(error) {
          if (error) {
            console.log(error);
            fs.appendFile( "log.txt", "\n"+ JSON.stringify(error, null, 2), function(err) {
            // If an error was experienced we say it.
            if (err) {
              console.log(err);
            }
            });
          }
        });
          if(inquirerResponse.confirm) {
            displayByDepartment(inquirerResponse.department)
          } else {
            action();
          }
          
        });
	}
//Inquirer between action
  function action() {
    inquirer
        .prompt([
          {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department","Create New Department","Leave"],
            name: "action"
          },
          {
            type: "confirm",
            message: "Are you sure?",
            name: "confirm"
          }
        ])
        .then(function(inquirerResponse) {
          fs.appendFile( "log.txt", "\nAction: "+inquirerResponse.action+", Confirmed: "+inquirerResponse.confirm, function(error) {
          if (error) {
            console.log(error);
            fs.appendFile( "log.txt", "\n"+ JSON.stringify(error, null, 2), function(err) {
            // If an error was experienced we say it.
            if (err) {
              console.log(err);
            }
            });
          }
        });
          if(inquirerResponse.confirm) {
            switch (inquirerResponse.action){
              case "View Product Sales by Department":
                displayByDep();
                break;
              case "Create New Department":
                addDepInq();
                break;
              case "Leave":
                connection.end();
                console.log("Goodbye.");
            }
          } else {
            action();
          }
          
        });
  }