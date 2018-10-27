-- We prevent replication of our bamazon db if it is already created --
DROP DATABASE IF EXISTS bamazon_db;
-- We create a database called bamazon_db, which will hold our inventory data --
CREATE DATABASE bamazon_db;

USE bamazon_db;

-- We create a table to hold our inventory data --
CREATE TABLE products(
    position INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) default "Product name not defined!",
    department_name VARCHAR(100) default "Department not defined!",
    price DECIMAL(19,2) default 0,
    stock_quantity INT default 0
);

-- We populate the table with our intial inventory of products --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "Electronics", 299.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Turbo Blender", "Housewares", 39.95, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nike Sweatshirt", "Clothing", 32.79, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Kennel", "Pets", 99.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Super Smash Bros. Ultimate", "Electronics", 59.99, 32);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Instant Pot", "Housewares", 84.79, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Levi's Jeans", "Clothing", 56.99, 57);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gourmet Cat Food", "Pets", 23.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("16-Piece Dish Set", "Housewares", 17.59, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kindle Fire", "Electronics", 119.99, 45);