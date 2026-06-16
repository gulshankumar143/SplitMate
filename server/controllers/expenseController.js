import Expense from '../models/Expense.js';
import Group from '../models/Group.js';
import Settlement from '../models/Settlement.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const splitExpense = (expense) => {
  const totalMembers = expense.sharedWith.length + 1;
  if (expense.splitType === 'equal') {
    const share = parseFloat((expense.amount / totalMembers).toFixed(2));
    return expense.sharedWith.map(userId => ({ user: userId, amount: share, percent: parseFloat((100 / totalMembers).toFixed(2)) }));
  }
  return expense.splitDetails;
};

export const createExpense = catchAsync(async (req, res) => {
  const payload = { ...req.body, paidBy: req.user._id };
  if (!payload.sharedWith?.length) payload.sharedWith = [req.user._id];
  const expense = await Expense.create(payload);
  const splitDetails = splitExpense(expense);
  expense.splitDetails = splitDetails;
  await expense.save();

  return successResponse(res, { expense }, 'Expense added successfully');
});

export const getExpenses = catchAsync(async (req, res) => {
  const filter = { $or: [{ paidBy: req.user._id }, { sharedWith: req.user._id }] };
  if (req.query.group) filter.group = req.query.group;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.dateFrom || req.query.dateTo) filter.date = {};
  if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom);
  if (req.query.dateTo) filter.date.$lte = new Date(req.query.dateTo);

  const expenses = await Expense.find(filter).populate('paidBy sharedWith group attachments').populate('splitDetails.user');
  return successResponse(res, { expenses }, 'Expenses retrieved');
});

export const getExpenseById = catchAsync(async (req, res) => {
  const expense = await Expense.findById(req.params.id).populate('paidBy sharedWith group attachments').populate('splitDetails.user');
  if (!expense) return errorResponse(res, 'Expense not found', 404);
  return successResponse(res, { expense }, 'Expense loaded');
});

export const updateExpense = catchAsync(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return errorResponse(res, 'Expense not found', 404);
  if (expense.paidBy.toString() !== req.user._id.toString()) return errorResponse(res, 'Permission denied', 403);
  Object.assign(expense, req.body);
  await expense.save();
  return successResponse(res, { expense }, 'Expense updated');
});

export const deleteExpense = catchAsync(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return errorResponse(res, 'Expense not found', 404);
  if (expense.paidBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') return errorResponse(res, 'Permission denied', 403);
  await Expense.findByIdAndDelete(req.params.id);
  return successResponse(res, {}, 'Expense deleted');
});
