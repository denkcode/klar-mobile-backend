import createHttpError from "http-errors";
import { Transaction } from "../models/transaction.model.js";

export const getAllTransaction = async (req, res) => {
  try {
    const { _id } = req.user;
    const { type, page, perPage, search } = req.query;
    const skip = (page - 1) * perPage;

    const filter = {
      userId: _id,
    };

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const transaction = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(perPage);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { _id } = req.user;

    const filterObject = {
      _id: transactionId,
      userId: _id,
    };

    const transaction = await Transaction.findOne(filterObject);
    if (!transaction) {
      throw createHttpError(404, "Transaction not found");
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  const { title, amount, category, type } = req.body;
  const { _id } = req.user;
  const transactionObject = {
    title,
    amount,
    category,
    type,
    userId: _id,
  };
  try {
    const transaction = await Transaction.create(transactionObject);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { _id } = req.user;
    const { transactionId } = req.params;

    const filterObject = {
      _id: transactionId,
      userId: _id,
    };
    const transaction = await Transaction.findOneAndDelete(
      filterObject
    );
    if (!transaction) {
      throw createHttpError(404, "Transaction not found");
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { _id } = req.user;
    
    const filterObjectUpdate = {
      userId: _id,
      _id: transactionId
    }
    const transaction = await Transaction.findOneAndUpdate(
      filterObjectUpdate,
      req.body,
      { returnDocument: "after" },
    );
    if (!transaction) {
      throw createHttpError(404, "Transaction not found");
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { _id } = req.user
    const expense = await Transaction.find({ type: "expense", userId: _id });
    const income = await Transaction.find({ type: "income", userId: _id });

    const totalExpense = expense.reduce((acc, item) => acc + item.amount, 0);
    const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
    const balance = totalIncome - totalExpense;
    res.status(200).json({ totalExpense, totalIncome, balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
