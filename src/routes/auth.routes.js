import express from "express";
import { register, login, validateRegistration, validateLogin } from "../services/auth.js";

const authRouter = express.Router();

authRouter.post('/register', validateRegistration, register);

authRouter.post('/login', validateLogin, login);

export default authRouter;
