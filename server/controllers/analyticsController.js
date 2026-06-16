import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import Settlement from '../models/Settlement.js';
import Group from '../models/Group.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse } from '../utils/apiResponse.js';

const formatMonthLabel = (month, year) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

export const getDashboardOverview = catchAsync(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user._id);
  const expenseMatch = { $or: [{ paidBy: userId }, { sharedWith: userId }] };

  const [totals, topCategories, monthlyTotals, topGroups, recentExpenses, recentSettlements, groupsCount, settlementStats, owedToYouResult, activeUsersResult] = await Promise.all([
    Expense.aggregate([
      { $match: expenseMatch },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          pendingCount: {
            $sum: {
              $cond: [{ $in: ['$status', ['pending', 'partial']] }, 1, 0]
            }
          },
          expenseCount: { $sum: 1 }
        }
      }
    ]),
    Expense.aggregate([
      { $match: expenseMatch },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $project: { category: '$_id', total: 1, _id: 0 } }
    ]),
    Expense.aggregate([
      { $match: expenseMatch },
      {
        $project: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          amount: 1
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    Expense.aggregate([
      { $match: { ...expenseMatch, group: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$group',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'group'
        }
      },
      { $unwind: '$group' },
      {
        $project: {
          groupId: '$_id',
          name: '$group.name',
          total: 1,
          count: 1,
          _id: 0
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]),
    Expense.find(expenseMatch).populate('paidBy sharedWith group attachments').populate('splitDetails.user').sort({ date: -1 }).limit(5),
    Settlement.find({ $or: [{ payer: userId }, { payee: userId }] })
      .populate('payer payee expense')
      .sort({ createdAt: -1 })
      .limit(5),
    Group.countDocuments({ 'members.user': userId }),
    Settlement.aggregate([
      { $match: { $or: [{ payer: userId }, { payee: userId }] } },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]),
    Expense.aggregate([
      { $match: { paidBy: userId, sharedWith: { $exists: true, $ne: [] } } },
      {
        $project: {
          amount: 1,
          distinctCount: {
            $size: { $setUnion: [['$paidBy'], '$sharedWith'] }
          }
        }
      },
      {
        $project: {
          owedToYou: {
            $subtract: ['$amount', { $divide: ['$amount', '$distinctCount'] }]
          }
        }
      },
      { $group: { _id: null, totalOwed: { $sum: '$owedToYou' } } }
    ]),
    Expense.aggregate([
      { $match: expenseMatch },
      { $project: { users: { $concatArrays: [['$paidBy'], { $ifNull: ['$sharedWith', []] }] } } },
      { $unwind: '$users' },
      { $group: { _id: null, uniqueUsers: { $addToSet: '$users' } } },
      { $project: { activeUsers: { $size: '$uniqueUsers' } } }
    ])
  ]);

  const spendChangePercent = () => {
    if (monthlyTotals.length < 2) return 0;
    const latest = monthlyTotals[monthlyTotals.length - 1].total;
    const previous = monthlyTotals[monthlyTotals.length - 2].total;
    if (!previous) return latest > 0 ? 100 : 0;
    return Math.round(((latest - previous) / previous) * 100);
  };

  const formattedMonthly = monthlyTotals.map((item) => ({
    month: formatMonthLabel(item._id.month, item._id.year),
    total: item.total
  }));

  const settlementSummary = settlementStats.reduce((summary, item) => {
    summary[item._id] = { total: item.total, count: item.count };
    return summary;
  }, {});

  const overview = {
    totalSpent: totals[0]?.totalSpent || 0,
    pendingCount: totals[0]?.pendingCount || 0,
    expenseCount: totals[0]?.expenseCount || 0,
    owedToYou: owedToYouResult[0]?.totalOwed || 0,
    groupCount: groupsCount,
    activeUsers: activeUsersResult[0]?.activeUsers || 0,
    spendChangePercent: spendChangePercent(),
    categories: topCategories,
    monthly: formattedMonthly,
    topGroups,
    recentExpenses,
    recentSettlements,
    settlementSummary
  };

  return successResponse(res, { overview }, 'Dashboard overview loaded');
});

export const getAnalyticsSummary = catchAsync(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user._id);
  const expenseMatch = { $or: [{ paidBy: userId }, { sharedWith: userId }] };

  const [categoryTotals, monthlyTotals, groupTotals, settlementStats, topExpenses, activeUsersResult] = await Promise.all([
    Expense.aggregate([
      { $match: expenseMatch },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { category: '$_id', total: 1, count: 1, _id: 0 } }
    ]),
    Expense.aggregate([
      { $match: expenseMatch },
      {
        $project: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          amount: 1
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    Expense.aggregate([
      { $match: { ...expenseMatch, group: { $exists: true, $ne: null } } },
      { $group: { _id: '$group', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'groups', localField: '_id', foreignField: '_id', as: 'group' } },
      { $unwind: '$group' },
      { $project: { groupId: '$_id', name: '$group.name', total: 1, count: 1, _id: 0 } },
      { $sort: { total: -1 } },
      { $limit: 8 }
    ]),
    Settlement.aggregate([
      { $match: { $or: [{ payer: userId }, { payee: userId }] } },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]),
    Expense.aggregate([
      { $match: expenseMatch },
      { $sort: { amount: -1 } },
      { $limit: 6 },
      { $lookup: { from: 'users', localField: 'paidBy', foreignField: '_id', as: 'paidBy' } },
      { $unwind: '$paidBy' },
      { $project: { title: 1, amount: 1, category: 1, paidBy: '$paidBy.name', date: 1 } }
    ]),
    Expense.aggregate([
      { $match: expenseMatch },
      { $project: { users: { $concatArrays: [['$paidBy'], { $ifNull: ['$sharedWith', []] }] } } },
      { $unwind: '$users' },
      { $group: { _id: null, uniqueUsers: { $addToSet: '$users' } } },
      { $project: { activeUsers: { $size: '$uniqueUsers' } } }
    ])
  ]);

  const spendChangePercent = () => {
    if (monthlyTotals.length < 2) return 0;
    const latest = monthlyTotals[monthlyTotals.length - 1].total;
    const previous = monthlyTotals[monthlyTotals.length - 2].total;
    if (!previous) return latest > 0 ? 100 : 0;
    return Math.round(((latest - previous) / previous) * 100);
  };

  const analytics = {
    categories: categoryTotals,
    monthly: monthlyTotals.map((item) => ({
      month: formatMonthLabel(item._id.month, item._id.year),
      total: item.total
    })),
    groups: groupTotals,
    settlements: settlementStats.map((item) => ({ status: item._id, total: item.total, count: item.count })),
    topExpenses,
    activeUsers: activeUsersResult[0]?.activeUsers || 0,
    spendChangePercent: spendChangePercent()
  };

  return successResponse(res, { analytics }, 'Analytics summary loaded');
});
