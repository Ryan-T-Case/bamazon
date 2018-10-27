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
connection.connect(function(err) {
    if (err) throw err;
    //After connection is made successfully, display all items for sale
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
    
});