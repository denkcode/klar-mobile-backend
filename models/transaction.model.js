import { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
  category: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["income", "expense"],
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export const Transaction = model("Transaction", TransactionSchema);
