var mysql  = require('mysql');
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'temporary',
  database : 'bamazon'
});


var menueChoices = function(){
	inquirer.prompt([
			{
				type: "list",
				message: "Please choose a command.",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
				name: "choices"
			}
		]).then(function(answer){
		
			switch(answer.choices){
				case "View Products for Sale":
				productSale();
				break;
				case "View Low Inventory":
				lowInv();
				break;
				case "Add to Inventory":
				updateInv();
				break;
				case "Add New Product":
				addNew();
				break;
			};
		});
};
menueChoices();

var productSale = function(){
	connection.query("SELECT * FROM products", function(err, results, fields){
		if(err) throw err;
		
			for (var i = 0; i < results.length; i++) {
				console.log("id: " + results[i].item_id + ",", "Product: " + results[i].product_name + ",", "Price: $" + results[i].price + ", " + "Quantity: " + results[i].stock_quantity);			
				};
			anotherCommand();
	})
};

var anotherCommand = function(){
	inquirer.prompt([
			{
				type: "confirm",
				message: "Would you like to perform another command?",
				default: true,
				name: "confirm"

			}
		]).then(function(answer){
			if(answer.confirm === true){
				menueChoices();

			}else{
				console.log("");
				console.log("Logging Out..");
				console.log("");
				connection.end();
			}
		});
};

var lowInv = function(){
	connection.query("SELECT * FROM products", function(err, results, fields){
		if(err) throw err;

			console.log("");
			console.log("Low Inventory");
			console.log("==============================");
		for (var i = 0; i < results.length; i++) {
			if(results[i].stock_quantity <= 5){
				console.log("id: " + results[i].item_id + ",", "Product: " + results[i].product_name + ",", "Price: $" + results[i].price + ", " + "Quantity: " + results[i].stock_quantity);
				
			}
		}
		anotherCommand();
	});
};

var updateInv = function(){
	connection.query("SELECT * FROM products",function(err, results, fields){
		if(err) throw err;
		var buyerChoices = [];
			for (var i = 0; i < results.length; i++) {
				console.log("id: " + results[i].item_id + ",", "Product: " + results[i].product_name + ",", "Price: $" + results[i].price + ", " + "Quantity: " + results[i].stock_quantity);			
				buyerChoices.push(String(results[i].item_id));
				
			};

			console.log("");
			console.log("==============================")
			console.log("");
		inquirer.prompt([
				{
					type: "rawlist",
					message: "Select Id # of item inventory you would like to update.",
					name: "purchase",
					choices: buyerChoices

					
				},
				{
					type: "input",
					message: "How many units would you like to add to the inventory?",
					name: "unitNum"
				}
			]).then(function(answer){
				var idOfPurchase = answer.purchase;
				var b = idOfPurchase - 1;
				var stock = parseFloat(results[b].stock_quantity);
				var answ = parseFloat(answer.unitNum)
				var invUp = stock + answ;
				update(invUp, idOfPurchase);

			});

	});

};

var update = function(a,b){
	var sql = "UPDATE products SET stock_quantity = " + a + " WHERE item_id = " + b;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log(result.affectedRows + " record(s) updated");
		anotherCommand();
		
	});
};

var addNew = function(){
	inquirer.prompt([
			{
				type: "input",
				message: "What is the item name?",
				name: "itemName"
			},
			{
				type: "input",
				message:"What is the item department?",
				name: "itemDepartment"
			},
			{
				type: "input",
				message: "What is the item's price?",
				name: "itemPrice"
			},
			{
				type: "input",
				message: "How many units added to inventory?",
				name: "itemInventory"
			}
		]).then(function(answer){
			var name = answer.itemName;
			var department = answer.itemDepartment;
			var price = answer.itemPrice;
			var inventory = answer.itemInventory;
			var info = name, department, price, inventory;
			var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('" + name + "', '" + department + "', '" + price + "', '" + inventory + "')";

			
				connection.query(sql, function(err, results, fields){
					if(err) throw err;
					console.log("1 record inserted");

					
				});
			anotherCommand();
			
		})
		
}

