DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

 -- item_id (unique id for each product)

 --   * product_name (Name of product)

 --   * department_name

 --   * price (cost to customer)

 --   * stock_quantity (how much of the product is available in stores)

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(300) NOT NULL,
  department_name VARCHAR(90) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2) NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Anti-Viral Facial Tissue Cube, Pack of 3", "Industrial & Scientific", 11.19, 2749, 0),
("15.6-Inch Laptop and Tablet Bag", "Computers", 14.99, 20, 0),
("Home Furniture Convertible Linen Tufted Splitback Futon Couch W/ Pillows (Brown)", "Home", 184.99, 2, 0),
("The Philosophy of Magic", "Books", 2.49, 1, 0),
("A Smarter Way to Learn JavaScript: The new approach that uses technology to cut your effort in half", "Books", 19.95, 1103, 0),
("Vintage Aircraft Instrument Coaster Set - Set of 6", "Home", 13.02, 4, 0),
("Wet and Dry Ultra Vac with Air Inflator", "Automotive", 20.49, 89, 0),
("Sleep Medicine with Easy Open Arthritis Cap, Caplets with Naproxen Sodium, 220mg (NSAID) Pain Reliever/Fever Reducer/Sleep Aid, 80 Count", "Health & Personal Care", 8.31, 2841, 0),
("Active Noise Cancelling Bluetooth Headphones with Microphone Hi-Fi Deep Bass Wireless Headphones Over Ear, Comfortable Protein Earpads, 30H Playtime for Travel Work TV Computer Iphone - Black", "Electronics", 53.19, 10, 0),
("Cell Phone Stand, Dock : Cradle, Holder, Stand For Switch, all Android Smartphone, iPhone 6 6s 7 8 X Plus 5 5s 5c charging, Accessories Desk - Black", "Industrial & Scientific", 7.48, 0, 0);