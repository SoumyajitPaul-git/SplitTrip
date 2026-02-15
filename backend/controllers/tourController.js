import Tour from "../models/Tour.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

// @desc    Create a new tour
// @route   POST /api/tours
// @access  Private
export const createTour = async (req, res) => {
  try {
    const { name, description, destination, startDate, endDate } = req.body;

    const tour = await Tour.create({
      name,
      description,
      destination,
      startDate,
      endDate,
      captain: req.user.id,
    });

    await tour.populate("captain", "name email");
    await tour.populate("members.user", "name email");

    res.status(201).json({
      success: true,
      tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating tour",
      error: error.message,
    });
  }
};

// @desc    Get all tours for current user
// @route   GET /api/tours
// @access  Private
export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find({
      $or: [{ captain: req.user.id }, { "members.user": req.user.id }],
      isActive: true,
    })
      .populate("captain", "name email")
      .populate("members.user", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: tours.length,
      tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tours",
      error: error.message,
    });
  }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Private
export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate("captain", "name email")
      .populate("members.user", "name email");

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // Check if user is a member
    const isMember = tour.members.some((m) => m.user._id.equals(req.user.id));
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this tour",
      });
    }

    res.status(200).json({
      success: true,
      tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tour",
      error: error.message,
    });
  }
};

// @desc    Join a tour using join code
// @route   POST /api/tours/join/:joinCode
// @access  Private
export const joinTour = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      joinCode: req.params.joinCode,
      isActive: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found or inactive",
      });
    }

    // Check if already a member
    const isMember = tour.members.some((m) => m.user.equals(req.user.id));
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this tour",
      });
    }

    // Add user to members
    tour.members.push({ user: req.user.id });
    await tour.save();

    await tour.populate("captain", "name email");
    await tour.populate("members.user", "name email");

    res.status(200).json({
      success: true,
      message: "Successfully joined the tour",
      tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error joining tour",
      error: error.message,
    });
  }
};

// @desc    Update tour status
// @route   PATCH /api/tours/:id/status
// @access  Private (Captain only)
export const updateTourStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // Check if user is captain
    if (!tour.captain.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Only the tour captain can update status",
      });
    }

    tour.status = status;
    await tour.save();

    await tour.populate("captain", "name email");
    await tour.populate("members.user", "name email");

    res.status(200).json({
      success: true,
      tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating tour status",
      error: error.message,
    });
  }
};

// @desc    Get tour settlement report
// @route   GET /api/tours/:id/report
// @access  Private
export const getTourReport = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate("captain", "name email")
      .populate("members.user", "name email");

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // Check if user is a member
    const isMember = tour.members.some((m) => m.user._id.equals(req.user.id));
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this report",
      });
    }

    // Get all expenses for this tour
    const expenses = await Expense.find({ tour: tour._id })
      .populate("paidBy", "name email")
      .populate("participants", "name email")
      .populate("createdBy", "name email")
      .sort("date");

    // Calculate balances
    const balances = {};
    const memberIds = tour.members.map((m) => m.user._id.toString());

    // Initialize balances
    memberIds.forEach((memberId) => {
      balances[memberId] = {
        userId: memberId,
        totalPaid: 0,
        totalShare: 0,
        netBalance: 0,
      };
    });

    // Calculate total paid and total share for each member
    expenses.forEach((expense) => {
      const paidById = expense.paidBy._id.toString();

      // Add to total paid
      if (balances[paidById]) {
        balances[paidById].totalPaid += expense.amount;
      }

      // Calculate share for each participant
      if (expense.splitType === "equal") {
        const sharePerPerson = expense.amount / expense.participants.length;
        expense.participants.forEach((participant) => {
          const participantId = participant._id.toString();
          if (balances[participantId]) {
            balances[participantId].totalShare += sharePerPerson;
          }
        });
      } else if (expense.splitType === "custom") {
        expense.customSplits.forEach((split) => {
          const participantId = split.user.toString();
          if (balances[participantId]) {
            balances[participantId].totalShare += split.amount;
          }
        });
      }
    });

    // Calculate net balance (positive means they should receive, negative means they owe)
    Object.keys(balances).forEach((memberId) => {
      balances[memberId].netBalance =
        balances[memberId].totalPaid - balances[memberId].totalShare;
    });

    // Calculate settlements using simplified debt algorithm
    const settlements = calculateSettlements(balances, tour.members);

    // Calculate category-wise breakdown
    const categoryBreakdown = {};
    expenses.forEach((expense) => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = 0;
      }
      categoryBreakdown[expense.category] += expense.amount;
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({
      success: true,
      report: {
        tour: {
          id: tour._id,
          name: tour.name,
          destination: tour.destination,
          startDate: tour.startDate,
          endDate: tour.endDate,
          status: tour.status,
        },
        summary: {
          totalExpenses,
          totalMembers: tour.members.length,
          totalTransactions: expenses.length,
          categoryBreakdown,
        },
        memberBalances: Object.values(balances).map((balance) => {
          const member = tour.members.find(
            (m) => m.user._id.toString() === balance.userId
          );
          return {
            user: {
              id: member.user._id,
              name: member.user.name,
              email: member.user.email,
            },
            totalPaid: parseFloat(balance.totalPaid.toFixed(2)),
            totalShare: parseFloat(balance.totalShare.toFixed(2)),
            netBalance: parseFloat(balance.netBalance.toFixed(2)),
          };
        }),
        settlements,
        expenses: expenses.map((exp) => ({
          id: exp._id,
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          paidBy: {
            id: exp.paidBy._id,
            name: exp.paidBy.name,
          },
          participants: exp.participants.map((p) => ({
            id: p._id,
            name: p.name,
          })),
          date: exp.date,
          createdBy: {
            id: exp.createdBy._id,
            name: exp.createdBy.name,
          },
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating report",
      error: error.message,
    });
  }
};

// Helper function to calculate optimal settlements
function calculateSettlements(balances, members) {
  const settlements = [];

  // Create arrays of creditors (should receive) and debtors (owe money)
  const creditors = [];
  const debtors = [];

  Object.keys(balances).forEach((memberId) => {
    const balance = balances[memberId];
    const member = members.find((m) => m.user._id.toString() === memberId);

    if (balance.netBalance > 0.01) {
      creditors.push({
        userId: memberId,
        name: member.user.name,
        amount: balance.netBalance,
      });
    } else if (balance.netBalance < -0.01) {
      debtors.push({
        userId: memberId,
        name: member.user.name,
        amount: Math.abs(balance.netBalance),
      });
    }
  });

  // Sort creditors and debtors by amount (descending)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Use greedy algorithm to minimize transactions
  let i = 0,
    j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    if (settleAmount > 0.01) {
      settlements.push({
        from: {
          userId: debtor.userId,
          name: debtor.name,
        },
        to: {
          userId: creditor.userId,
          name: creditor.name,
        },
        amount: parseFloat(settleAmount.toFixed(2)),
      });
    }

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
}
