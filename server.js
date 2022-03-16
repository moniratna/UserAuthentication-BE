const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const Currency = require("./models/Currency");
const app = express();
var server = app.listen(5000 || process.env.PORT);
var io = require("socket.io")(server, {
	cors: {
		origin: "https://dashboard-3yapb1b0h-moniratna.vercel.app/",
		methods: ["GET", "POST"],
	},
});
// connect DB

connectDB();
app.use(express.json());
app.use(cors());
// const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

let interval;

// const io = new Server(server, {
// 	cors: {
// 		origin: ["http://localhost:3000"],
// 		methods: ["GET", "POST"],
// 	},
// });

io.on("connection", (socket) => {
	console.log("New client connected");
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket), 1000);
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		clearInterval(interval);
	});
});

const getApiAndEmit = (socket) => {
	const response = new Date();
	// Emitting a new message. Will be consumed by the client
	socket.emit("FromAPI", response.toLocaleTimeString());
};

console.log(server);
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/currency", require("./routes/api/currency"));

app.get("/", (req, res) => {
	res.send("API Running");
});

// server.listen(PORT, () => console.log(`server started on port ${PORT}`));
