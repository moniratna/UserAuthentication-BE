const express = require("express");
const router = express.Router();
const Currency = require("../../models/Currency");
const config = require("config");

router.post("/addCurrency", async (req, res) => {
	const { name, price } = req.body;
	try {
		let currency = await Currency.findOne({ name });
		if (currency) {
			return res
				.status(400)
				.json({ errors: [{ msg: "currency already exists" }] });
		}

		currency = new Currency({
			name,
			price,
		});
		await currency.save();
		res.json(currency);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
	console.log(req.body);
});

router.get("/currency", async (req, res) => {
	// Currency.find()
	// .then(currency => res.json(currency))
	// .catch(err => res.status(404).json({noCurrency: 'No currency found'}))

	const currency = await Currency.find();
	res.json(currency);
});

module.exports = router;
