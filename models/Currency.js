const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Currency = mongoose.model("currency", CurrencySchema);
