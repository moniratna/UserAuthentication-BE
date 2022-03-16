const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error");
	}
});

router.post(
	"/login",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "password required").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		console.log(req.body);
		if (!errors.isEmpty()) {
			console.log(req.body);
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.json({
					errors: [{ msg: "Invalid Credentials" }],
					status: 401,
				});
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.json({
					errors: [{ msg: "Invalid Credentials" }],
					status: 401,
				});
			}

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
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
		console.log(req.body);
	}
);

module.exports = router;
