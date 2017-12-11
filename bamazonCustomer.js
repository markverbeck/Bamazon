var mysql  = require('mysql');
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'temporary',
  database : 'bamazon'
});

var update = function(a,b){
	var sql = "UPDATE products SET stock_quantity = " + a + " WHERE item_id = " + b;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log(result.affectedRows + " record(s) updated");
		
	});
};



	
var buy = function(){
	console.log("");
	console.log("Hello and welcome to Bamazon!!");
	console.log("We stock to world's leading worthless junk!!")
	console.log("How much money would you like to give us?");
	console.log("==============================");
	console.log("");
	connection.query("SELECT * FROM products", function(err, results, fields){
		if(err) throw err;
			var buyerChoices = [];
			for (var i = 0; i < results.length; i++) {
				console.log("id: " + results[i].item_id + ",", "Product: " + results[i].product_name + ",", "Price: $" + results[i].price);			
				buyerChoices.push(String(results[i].item_id));
				
			};
			console.log("");
			console.log("==============================")
			console.log("");
		inquirer.prompt([
				{
					type: "rawlist",
					message: "Select Id # of item you would like to purchase.",
					name: "purchase",
					choices: buyerChoices

					
				},
				{
					type: "input",
					message: "How many units would you like to purchase?",
					name: "unitNum"
				}
				
			]).then(function(answer){
				var idOfPurchase = answer.purchase;
				var b = idOfPurchase - 1;
				var stock = results[b].stock_quantity;
				var name = results[b].product_name;

				if(stock >= answer.unitNum){
					var price = results[b].price;
					var unit = answer.unitNum;
					var total = price * unit;
					var unitLeft = stock - unit;
					console.log("");
					console.log("Item: " + name);
					console.log("");
					console.log("Quantity: " + unit);
					console.log("");
					console.log("Price Per Unit: " + "$" + price);
					console.log("==============================");
					console.log("Grand Total: " + "$" + total);
					console.log("");
					
					inquirer.prompt([
							{
								type: "confirm",
								message: "Complete Transaction?",
								name: "transaction",
								default: false
							}
						]).then(function(answer){
							if(answer.transaction === true){
								update(unitLeft, idOfPurchase);
								console.log("Thank you for shopping Bamazon!!");
								console.log("Have a wonderful day!!");
								connection.end();
							}else{
								console.log("Thank you for shopping Bamazon!!");
								console.log("Have a wonderful day!!");
								connection.end();
							}
						})




				}else{
					console.log("");
					console.log("Insufficiant Qauntity!!");
					console.log("==============================");
					console.log("Amount Currently in stock: " + stock);
					console.log("");

					inquirer.prompt([
							{
								type: "confirm",
								message: "Would you like to replace your order?",
								name:"confirm",
								default: true
							}
						]).then(function(answer){
							if(answer.confirm === true){
								buy();
							}else{
								console.log("Thank you for shopping Bamazon!!");
								console.log("Have a wonderful day!!");
								connection.end();
							}
						});
				};
				
			});
		
	})
	
};
buy();














