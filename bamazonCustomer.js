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
            Aww man, thank you for stopping by!
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
    See anything you like? Be sure to make note of the ID of items that interest you!
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
                Aww man, thank you for stopping by!
                `);
                connection.end();
            }
        });
        
    });
};

//Function that only runs when someone wants to make a purchase
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
            console.log(`
            insert purchase logic here
            `)
        }
        //Otherwise, ask the user to enter a valid id
        else {
            console.log(`
            Please enter a valid product id
            `);
            //And rerun the purchase function
            purchase();
        }
    });
}