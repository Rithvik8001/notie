import express, { type Express } from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./db/config";
import authRoute from "./routes/auth/route";
import { errorHandlingMiddleware } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth/auth";
import cookieParser from "cookie-parser";
import notesRoute from "./routes/notes/route";

const app: Express = express();
const port = process.env.PORT;
const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/api/notes", authMiddleware, notesRoute);

// error handling middleware
app.use(errorHandlingMiddleware);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
