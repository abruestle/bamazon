# bamazon
Amazon-like storefront with the MySQL and Node


## Customer

* Choose from options to buy or view products, or to leave store
* Viewing a product will tell you when out of stock
* You will not be able to buy a product if the stocks are too low.
* Price will be calculated, told to Customer, and product sales will be updated.
* Validation for all Inquirer prompts that deal with money or amount.

## Manager

* Choose from viewing products (as customer but with quantity in stock shown), viewing just low inventory, adding to the inventory, or adding a completely new product.
* As with Customer, validation is on the appropriate Inquirer prompts.

## Supervisor (still in progress)

* Choose from viewing products by department or creating a new department
* Sees over head costs, product sales, and total profit. This is taken from the departments table as well as combined data from products and calculated data for the total profit.

## npm Used

* mysql
* inquirer
* fs

## To Do

[x] Finish Customer
[x] Finish Manager
[x] Test Customer
[x] Test Manager
[x] Finish Supervisor
[x] Test Supervisor
[ ] Add viewing by department to Customer
[ ] Add to Supervisor ability to switch to Manager, and Manager the abiltiy to act as a Customer with special manager privileges (as online stores may want to have a purchase made with cash go through the system)
[ ] Option for supervisors to view just one department with more detail (so with the sale results they see with all but per product)
[ ] Each table results given makes a pseudo table in the console by seeing how long each piece it is getting back and adjusting accordingly. If results are too long, truncate for customers but not for employees.
[ ] Customers can view specific products using checklist to make a 'shopping list', and afterwards check out.
