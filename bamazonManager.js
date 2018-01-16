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
  var departmentsList = ["Books", "Industrial & Scientific", "Home", "Automotive", "Computers", "Health & Personal Care", "Electronics", "Clothing", "Shoes", "Toys", "Music", "Sports & Outdoors", "Jewelry", "Garden", "Other"];
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
    displayAll();
  });

//Update product in database

  function addInvCheck(productID, added) {
    var query = connection.query("SELECT * FROM products WHERE id=?", [productID], function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //updateProduct2(productID, added);
        // console.log("Results: "+ JSON.stringify(res, null, 2));
        updateProduct2(productID, added, res[0].stock_quantity, res[0].product_name, res[0].price);
      });

    // logs the actual query being run

  }
  function updateProduct2(productID, added, quan, productName, productPrice) {
    // console.log("Quantity: " + quan);
    var newResult = parseInt(quan + added);
    // console.log("New quantity:" + newResult);
    // console.log("added:" + added);
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
              stock_quantity: newResult
            },
            {
                id: productID
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log("You have added "+ added + " of "+ productName+ ". Total product now in stock: "+newResult+".");

            action();
          }
    );
    
  }
//Inquirer for Adding to Inventory
  function addInventory() {
    inquirer
        .prompt([
          {
            type: "input",
            message: "Select product ID to add inventory to:",
            name: "product",
          validate: function(value) {
            var valid;
            if(productsById.indexOf(value) != -1) {
              valid = true;
            }
            //!isNaN(parseInt(value))
            return valid || 'Please select the ID of a product.';
          },
          filter: Number
            },
            {
          type: 'input',
          name: 'quantity',
          message: 'How many are being added?',
          validate: function(value) {
            if(value == parseInt(value, 10) && value > 0) {
              var valid = true;
            }
            // var valid = !isNaN(parseInt(value));
            return valid || 'Please enter an integer greater than 0.';
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
          fs.appendFile( "log.txt", "\nProduct: "+inquirerResponse.product+", Quantity: "+inquirerResponse.quantity+", Confirmed: "+inquirerResponse.confirm, function(error) {
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
            addInvCheck(inquirerResponse.product, inquirerResponse.quantity);
          } else {
            action();
          }
          
        });
  }
//Update product in database

  function addInvCheck(productID, added) {
    var query = connection.query("SELECT * FROM products WHERE id=?", [productID], function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //updateProduct2(productID, added);
        // console.log("Results: "+ JSON.stringify(res, null, 2));
        updateProduct2(productID, added, res[0].stock_quantity, res[0].product_name, res[0].price);
      });

    // logs the actual query being run

  }
  function updateProduct2(productID, added, quan, productName, productPrice) {
    // console.log("Quantity: " + quan);
    var newResult = parseInt(quan + added);
    // console.log("New quantity:" + newResult);
    // console.log("added:" + added);
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
              stock_quantity: newResult
            },
            {
                id: productID
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log("You have added "+ added + " of '"+ productName+ "'. Total product now in stock: "+newResult+".");

            action();
          }
    );
    
  }
//Add a new product

  function addProdCheck(prod, depa, price, quan) {
    // console.log("Add Prod Check");
    // console.log(prod);
    // console.log(depa);
    // console.log(price);
    // console.log(quan);
    var query = connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);', [prod, depa, price, quan], function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //updateProduct2(productID, added);
        // console.log("Results: "+ JSON.stringify(res, null, 2));
        console.log("You have added "+ quan + " of '"+ prod+ "' at "+price+".")
        displayAll(true);
      });
  }
//Inquirer for adding completely new product
  function addProduct() {
    // console.log(JSON.stringify(productsByName, null, 2));
    inquirer
        .prompt([
          {
            type: "input",
            message: "Select new product name:",
            name: "product",
            validate: function(value) {
              if (!value.trim()){
                return "Please give a name to the new product.";
              } else if (productsByName.indexOf(value) != -1) {
                return "Product already exists.";
              }
              return true;
            }
          },
          {
            type: "list",
            message: "Select new product department:",
            name: "department",
            choices: departmentsList
          },
          {
            type: 'input',
            name: 'price',
            message: 'What is the price?',
            validate: function(value) {
              var regex  = /^\d+(?:\.\d{0,2})?$/;
              if (regex.test(value))
                  var valid = true;
              // var valid = !isNaN(parseInt(value));
              return valid || 'Please enter a price greater than 0.';
            },
            filter: Number
          },
          {
            type: 'input',
            name: 'quantity',
            message: 'How many are being added?',
            validate: function(value) {
              if(value == parseInt(value, 10) && value > 0) {
                var valid = true;
              }
              // var valid = !isNaN(parseInt(value));
              return valid || 'Please enter an integer greater than 0.';
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
          // console.log("Add Product");
          // console.log(inquirerResponse.product);
          // console.log(inquirerResponse.department);
          // console.log(inquirerResponse.price);
          // console.log(inquirerResponse.quantity);
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
//Display one Department or product
  function querySpecific(department, product) {
    if(!product) {
      var query = connection.query("SELECT * FROM products WHERE department_name=?", [department], function(err, res) {
        console.log("ID | Department | Product Name | Price | Quantity in Stock");
          for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 1) {
              console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity+ " | OUT OF STOCK");
            } else {
              console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
            }
          }
      });

      // logs the actual query being run
        // console.log(query.sql);
      
    } else {
      var query = connection.query("SELECT * FROM products WHERE product_name=?", [product], function(err, res) {
        console.log("ID | Department | Product Name | Price | Quantity in Stock");
          for (var i = 0; i < res.length; i++) {

            if (res[i].stock_quantity < 1) {
              console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity + " | OUT OF STOCK");
            } else {
              console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
            }
          }
          action();
      });
    }
    
  }
//Display Low Inventory
  function queryLow() {
    var query = connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
      console.log("ID | Department | Product Name | Price | Quantity in Stock");
        for (var i = 0; i < res.length; i++) {
          if (res[i].stock_quantity < 1) {
            console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity + " | OUT OF STOCK");
          } else {
            console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
          }
        }
        action();
    });

    // // logs the actual query being run
    //   console.log(query.sql);
    
    
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
            choices: ["View Products for Sale","View Low Inventory", "Add to Inventory","Add New Product","Leave"],
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
              case "View Products for Sale":
                displayAll();
                break;
              case "View Low Inventory":
                queryLow();
                break;
              case "Add to Inventory":
                addInventory();
                break;
              case "Add New Product":
                addProduct();
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