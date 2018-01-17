USE bamazon_db;

 -- item_id (unique id for each product)

 --   * product_name (Name of product)

 --   * department_name

 --   * price (cost to customer)

 --   * stock_quantity (how much of the product is available in stores)

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(90) NOT NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books",500.20), ("Industrial & Scientific",1300), ("Home",300), ("Automotive",20000), ("Computers",9999.99), ("Health & Personal Care",5), ("Electronics",20000), ("Clothing",.99), ("Shoes",1000000), ("Toys",50), ("Music",0), ("Sports & Outdoors",5100), ("Jewelry",9181.29), ("Garden",10), ("Other",601);