import mongoose from "mongoose";

export const BlacklistedToken = mongoose.model('BlacklistedToken', new mongoose.Schema({
    token: String,
  }));