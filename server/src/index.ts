import express, { type Express } from "express";
import "dotenv/config";
import { connectDB } from "./db/config";
import authRoute from "./routes/auth/route";

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// routes
app.use("/api/auth", authRoute);

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
