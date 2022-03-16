const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const app = express();

// connect DB

connectDB();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});
io.on("connection", (socket) => {
	console.log("socket connected");

	socket.on("join_room", (data) => {
		socket.join(data);
		console.log(`user with ID: ${socket.id} joined room: ${data}`);
	});

	socket.on("send_message", (data) => {
		socket.to(data.room).emit("receive_message", data);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});
});

console.log(server);
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/currency", require("./routes/api/currency"));

app.get("/", (req, res) => {
	res.send("API Running");
});

server.listen(PORT, () => console.log(`server started on port ${PORT}`));
