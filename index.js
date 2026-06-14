import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import { connectMongoDB } from "./db/connectMongoDB.js";
import transactionRouter from "./routes/transactionRoutes.js";
import { notFoundHandler } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { errors } from "celebrate";
import userRoutes from "./routes/userRoutes.js";
import resetPassword from "./routes/resetPassword.js"
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "server running" });
});

app.use(cookieParser());

app.use('/api/auth', resetPassword)
app.use("/api/auth/", userRoutes);
app.use("/api/transaction", transactionRouter);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
