//Require
	var inquirer = require("inquirer");
	var fs = require("fs");
	var mysql = require("mysql");

//Variables
	//If later going to make products searchable by name
	// var products = [];
	var productsById = [];
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

	function buyCheck(productID, decr) {
		var query = connection.query("SELECT * FROM products WHERE id=?", [productID], function(err, res) {
		    if (err) throw err;
		    // Log all results of the SELECT statement
		    //updateProduct2(productID, decr);
		    // console.log("Results: "+ JSON.stringify(res, null, 2));
		    updateProduct2(productID, decr, res[0].stock_quantity, res[0].product_sales, res[0].product_name, res[0].price);
		  });

		// logs the actual query being run

	}
	function updateProduct2(productID, decr, quan, sales, productName, productPrice) {
		// console.log("Quantity: " + quan);
		var newResult = parseInt(quan - decr);
		var newResultSales = (parseFloat(sales) + (productPrice*parseFloat(decr).toFixed(2))).toFixed(2);
		// console.log("New quantity:" + newResult);
		// console.log("decr:" + decr);
		if(newResult >= 0 ) {
			//Purchase can be made
			var query = connection.query(
				"UPDATE products SET ? WHERE ?",
				[
			    	{
			    		stock_quantity: newResult,
			    		product_sales: newResultSales,
			    	},
			    	{
			        	id: productID,
			    	}
		    	],
		    	function(err, res) {
		    		if (err) throw err;
		    		console.log("You have bought "+ decr + " of "+ productName+ ". Total cost: "+Number(productPrice*parseFloat(decr)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }));

		    		// + " You bought the"+res.affectedRows.product_name+"!\n"
		    		action();
		    	}
		  	);
		} else {
			switch (quan) {
				case 0:
					console.log("Product is not in stock.");
					break;
				case 1:
					console.log("Not enough product in stock. There is only one left.");
					break;
				default:
					console.log("Not enough product in stock. There are " + quan + " left.");
			}
			action();
	
		}
		
	}
//Display all products

	function displayAll() {
	  connection.query("SELECT * FROM products", function(err, res) {
	    if (err) throw err;
	    console.log("ID | Department | Product Name | Price")
	    productsById = [];
	    for (var i = 0; i < res.length; i++) {
	    	productsById[i] = res[i].id;
	    	if (res[i].stock_quantity < 1) {
	    		console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | OUT OF STOCK");
	    	} else {
	    		console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price);
	    	}
	    	//If later going to make products searchable by name
	    	// products[i] = {
	    	// 	id: res[i].id,
	    	// 	name: res[i].name,
	    	// };
	    }
	    
	  action();
	  });
	  
	}
//Display one Department or product
	function querySpecific(department, product) {
		if(!product) {
			var query = connection.query("SELECT * FROM products WHERE department_name=?", [department], function(err, res) {
				console.log("ID | Department | Product Name | Price");
			    for (var i = 0; i < res.length; i++) {
			    	if (res[i].stock_quantity < 1) {
			    		console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | OUT OF STOCK");
			    	} else {
			    		console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price);
			    	}
			    }
			});

			// logs the actual query being run
			  console.log(query.sql);
			
		} else {
			var query = connection.query("SELECT * FROM products WHERE product_name=?", [product], function(err, res) {
				console.log("ID | Department | Product Name | Price");
			    for (var i = 0; i < res.length; i++) {

			    	if (res[i].stock_quantity < 1) {
			    		console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price + " | OUT OF STOCK");
			    	} else {
			    		console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | $" + res[i].price);
			    	}
			    }
			});

			// logs the actual query being run
			console.log(query.sql);
		}
		
	}
//Inquirer for Buying
	function buy() {
		inquirer
		    .prompt([
		      {
		        type: "input",
		        message: "Select product ID to buy:",
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
				message: 'How many do you need?',
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
		    		buyCheck(inquirerResponse.product, inquirerResponse.quantity);
		    	} else {
		    		action();
		    	}
		    	
		    });
	}

//Inquirer between products

	function action() {
		inquirer
		    .prompt([
		      {
		        type: "list",
		        message: "What would you like to do?",
		        choices: ["Buy a product","View products", "Leave store"],
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
		    			case "Buy a product":
		    				buy();
		    				break;
		    			case "View products":
		    				displayAll();
		    				break;
		    			case "Leave store":
		    				connection.end();
		    				console.log("Goodbye. Thank you for shopping with us.");
		    		}
		    	} else {
		    		action();
		    	}
		    	
		    });
	}