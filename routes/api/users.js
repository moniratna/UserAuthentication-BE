const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post(
	"/register",
	[
		check("firstname", "Name is required").not().isEmpty(),
		check("lastname", "Lastname is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please Enter a password with 6 or more charecters"
		).isLength(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		console.log(req.body);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(400).json({ errors: errors.array() });
		}

		const { firstname, lastname, email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "user already exists" }] });
			}

			user = new User({
				firstname,
				lastname,
				email,
				password,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();
			const payload = {
				user: {
					id: user.id,
					name: user.firstname,
				},
			};
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.send({ token });
				}
			);

			// res.send('user route')
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
		console.log(req.body);
	}
);

module.exports = router;
