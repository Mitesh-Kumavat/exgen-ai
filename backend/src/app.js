import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import adminRouter from "./routes/admin.routes.js"
import studentRouter from "./routes/student.routes.js";
import examRouter from "./routes/exam.routes.js";
import examPaperRouter from "./routes/examPaper.routes.js";
import queryRouter from "./routes/query.routes.js";

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/exam", examRouter);
app.use("/api/v1/exam-paper", examPaperRouter);
app.use("/api/v1/query", queryRouter);

// Error handling middleware
import { globalErrorHandler } from "./middleware/errorHandler.js";
app.use(globalErrorHandler);

export { app };