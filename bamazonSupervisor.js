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

  function addDep(prod, depa, price, quan) {
    // console.log("Add Prod Check");
    // console.log(prod);
    // console.log(depa);
    // console.log(price);
    // console.log(quan);
    var query = connection.query('INSERT INTO departments (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);', [prod, depa, price, quan], function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //updateProduct2(productID, added);
        // console.log("Results: "+ JSON.stringify(res, null, 2));
        console.log("You have added "+ quan + " of '"+ prod+ "' at "+price+".")
        displayAll(true);
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
            name: "product",
            validate: function(value) {
              if (!value.trim()){
                return "Please give a name to the new department.";
              } else if (departmentsByName.indexOf(value) != -1) {
                return "Department already exists.";
              }
              return true;
            }
          },
          {
            type: 'input',
            name: 'quantity',
            message: 'How many are being added?',
            validate: function(value) {
              if(value == parseFloat(value, 10).toFixed(2) && value >= 0) {
                var valid = true;
              }
              // var valid = !isNaN(parseInt(value));
              return valid || 'Please enter a price.';
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
          fs.appendFile( "log.txt", "\nProduct: "+inquirerResponse.product+", Department: "+inquirerResponse.department+", Price: "+inquirerResponse.price+", Quantity: "+inquirerResponse.quantity+", Confirmed: "+inquirerResponse.confirm, function(error) {
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
            addProdCheck(inquirerResponse.product, inquirerResponse.department, inquirerResponse.price, inquirerResponse.quantity);
          } else {
            action();
          }
          
        });
  }

//Display all products

  function displayAll(hidden) {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log("ID | Department | Product Name | Price | Quantity in Stock")
      productsById = [];
      for (var i = 0; i < res.length; i++) {
        productsById[i] = res[i].id;
        productsByName[i] = res[i].product_name;
        if (!hidden)  {
          if (res[i].stock_quantity < 1) {
            console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity+ " | OUT OF STOCK");
          } else {
            console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
          }
        }
        
      }
      
    action();
    });
    
  }
//Display one Department
  function displayByDepartment(department) {
    var query = connection.query("SELECT * FROM products WHERE department_name=?", [department], function(err, res) {
        console.log("ID | Department | Product Name | Price | Quantity in Stock");
          for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 1) {
              console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity+ " | OUT OF STOCK");
            } else {
              console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
            }
          }
          action();
      });
	}
//Inquirer for displaying by department
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
//Inquirer between products
  //* If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  //   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  //   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
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
                displayByDepInq();
                break;
              case "Create New Department":
                addDepartment();
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