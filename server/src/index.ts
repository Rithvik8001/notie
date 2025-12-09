import express, { type Express } from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./db/config";
import authRoute from "./routes/auth/route";
import { errorHandlingMiddleware } from "./middleware/errorHandler";

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

// routes
app.use("/api/auth", authRoute);

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
