//We set our node package dependencies for this application
var mysql = require('mysql');
var inquirer = require('inquirer');

//Here we store the info needed to connect to the bamazon database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Yankees02",
    database: "bamazon_db"
});

//Then we establish connection to the datbase
connection.connect(function (err) {
    if (err) throw err;
    //After connection is successful, log the welcome message for the customer
    console.log(`
    ################################################
    
    #####    ##   #    #   ##   ######  ####  #    # 
    #    #  #  #  ##  ##  #  #      #  #    # ##   # 
    #####  #    # # ## # #    #    #   #    # # #  # 
    #    # ###### #    # ######   #    #    # #  # # 
    #    # #    # #    # #    #  #     #    # #   ## 
    #####  #    # #    # #    # ######  ####  #    #
    
    ################################################
    
    ##### Welcome to Bamazon, Valued Customer! #####
    
    ### We Are Your One Stop Shop for Everything! ###
    
    `);
    //Ask the customer if they wish to shop at Bamazon
    inquirer.prompt({
        name: "shoppingPrompt",
        type: "list",
        message: "Would you like to check out our inventory?",
        choices: ["Yes, please!", "No, thank you!"]
    }).then(function (response) {
        //If the customer chooses to shop, then run the app
        if (response.shoppingPrompt.toLowerCase() === "yes, please!") {
            startApp();
        }
        //Otherwise, thank the user for stopping by
        else {
            console.log(`
            ####################################
            Aww man, thank you for stopping by!
            ####################################
            `);
            connection.end();
        }
    });
});

//Preliminary function that gets our app going
var startApp = function () {
    //We query the inventory data from the database
    connection.query("SELECT * FROM products", function (error, results, fields) {
        if (error) throw error;
        //Loop through the results array to display data for each product in the inventory
        for (i = 0; i < results.length; i++) {
            console.log(`
    ################################################
    | ID: ${results[i].position} | | Product: ${results[i].product_name} |
    | Price: ${results[i].price} |
    ################################################
            `)
        }
        console.log(`
    ################################################
    See anything you like? Be sure to make note of 
    the ID of items that interest you!
    ################################################
        `)
        //Check if the customer wants to make a purchase
        inquirer.prompt({
            name: "purchasePrompt",
            type: "list",
            message: "Did you find anything you want to purchase?",
            choices: ["Sure did!", "Not at this time."]
        }).then(function (response) {
            //If the customer confirms, run the purchasing function
            if (response.purchasePrompt.toLowerCase() === "sure did!") {
                purchase();
            }
            //Otherwise, thank the user for stopping by
            else {
                console.log(`
                ####################################
                Aww man, thank you for stopping by!
                ####################################
                `);
                connection.end();
            }
        });
        
    });
};

//Function that only runs when someone wants to make a purchase (this is the main function of the app)
var purchase = function() {
    //Prompt the customer for the id of the item they wish to purchase
    inquirer.prompt({
        name: "productId",
        type: "input",
        message: "What is the ID of the item you wish to purchase?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }).then(function (choice) {
        //If the customer inputs an id of 10 or less
        if (choice.productId <= 10) {
            //Store the user's product id choice and query statement
            var idChoice = choice.productId;
            var sql = "SELECT * FROM products WHERE position = ?";
            //Grab the row object where the position is the same as the customer's choice
            connection.query(sql, [idChoice], function (error, result) {
                if (error) throw err;
                //And print the item data that they selected
                console.log(`
            ################################
            Product Selected: ${result[0].product_name}
            Price per item: ${result[0].price}
            Amount in Stock: ${result[0].stock_quantity}
            ################################
                `);
                //Then ask the user to confirm that this was in fact their chosen product
                inquirer.prompt({
                    name: "confirmChoice",
                    type: "list",
                    message: "Is the product above the one you wanted to purchase?",
                    choices: ["Yes, it is!", "No, I made a mistake."]
                }).then(function (response) {
                    //If yes, then proceed to ask how much they want to buy
                    if (response.confirmChoice.toLowerCase() === "yes, it is!") {
                        inquirer.prompt({
                            name: "purchaseQuantity",
                            type: "input",
                            message: "How much would you like to purchase?",
                            validate: function(value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        }).then(function (response) {
                            //If the quantity requested is more than what is in stock, reject the purchase and start the order over
                            if (response.purchaseQuantity > result[0].stock_quantity) {
                                console.log("Insufficient Quantity! Please try again.")
                                purchase();
                            }
                            //Otherwise, proceed with the order
                            else {
                                //Store the total cost of the order
                                var totalCost = (result[0].price * response.purchaseQuantity);
                                //Round the cost to 2 decimal places
                                var roundedCost = (Math.round(totalCost * 100) / 100);
                                //And print the receipt for the customer
                                console.log(`
            ################################
            Purchase Summary
            --------------------------------
            You purchased: ${result[0].product_name}
            Quantity purchased: ${response.purchaseQuantity}
            Your Total Is: $${roundedCost}
            ################################
                                `);
                                //After the purchase is complete, update the inventory in the database accordingly
                                updateInventory(choice.productId, response.purchaseQuantity, result[0].stock_quantity);
                            };
                        });
                    }
                    //If no, rerun the purchase function
                    else {
                        purchase();
                    }
                });
            })
        }
        //Otherwise, ask the user to enter a valid id
        else {
            console.log(`
            ################################
            Please enter a valid product id
            ################################
            `);
            //And rerun the purchase function
            purchase();
        }
    });
};
//Function that takes in the purchase quantity, stock quantity, and item id as arguments to then use to update inventory after a purchase
var updateInventory = function(idPurchased, amountPurchased, amountInStock) {
    var updateStatement = "UPDATE products SET stock_quantity = ? WHERE position = ?";
    //Subtract amount of product purchased from stock quantity and store it into a variable
    var newStockQuantity = (amountInStock - amountPurchased);
    //Updates the inventory quantity of the product based on the new stock quantity that is calculated
    connection.query(updateStatement, [newStockQuantity, idPurchased], function (error, result) {
        if (error) throw error;
        //Let the user know how much of the product is left
        console.log(`
        ################################
        Thank you for your purchase!

        This item's stock quantity has been reduced to ${newStockQuantity}
        ################################
                            `);
        //Once updated, ask the user if they want to make another purchase
        inquirer.prompt({
            name: "newPurchase",
            type: "list",
            message: "Would you like to make another purchase?",
            choices: ["Of Course!", "No, thank you!"]
        }).then(function (response) {
            //If the customer confirms, then rerun the start function to allow another purchase
            if (response.newPurchase.toLowerCase() === "of course!") {
                startApp();
            }
            //Otherwise, thank the user for stopping by
            else {
                console.log(`
        ####################################
        Aww man, thank you for stopping by!
        ####################################
                `);
                connection.end();
            }
        });
    });
};
