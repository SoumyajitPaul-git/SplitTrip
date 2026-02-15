import Expense from "../models/Expense.js";
import Tour from "../models/Tour.js";

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const {
      tour,
      description,
      amount,
      category,
      paidBy,
      participants,
      splitType,
      customSplits,
    } = req.body;

    // Verify tour exists and user is a member
    const tourDoc = await Tour.findById(tour);
    if (!tourDoc) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const isMember = tourDoc.members.some((m) => m.user.equals(req.user.id));
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this tour",
      });
    }

    // Verify paidBy and participants are tour members
    const memberIds = tourDoc.members.map((m) => m.user.toString());

    if (!memberIds.includes(paidBy)) {
      return res.status(400).json({
        success: false,
        message: "Payer must be a tour member",
      });
    }

    const invalidParticipants = participants.filter(
      (p) => !memberIds.includes(p)
    );
    if (invalidParticipants.length > 0) {
      return res.status(400).json({
        success: false,
        message: "All participants must be tour members",
      });
    }

    const expense = await Expense.create({
      tour,
      description,
      amount,
      category,
      paidBy,
      participants,
      splitType,
      customSplits,
      createdBy: req.user.id,
    });

    await expense.populate("paidBy", "name email");
    await expense.populate("participants", "name email");
    await expense.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating expense",
      error: error.message,
    });
  }
};

// @desc    Get all expenses for a tour
// @route   GET /api/expenses/tour/:tourId
// @access  Private
export const getExpensesByTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // Check if user is a member
    const isMember = tour.members.some((m) => m.user.equals(req.user.id));
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these expenses",
      });
    }

    const expenses = await Expense.find({ tour: req.params.tourId })
      .populate("paidBy", "name email")
      .populate("participants", "name email")
      .populate("createdBy", "name email")
      .sort("-date");

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("paidBy", "name email")
      .populate("participants", "name email")
      .populate("createdBy", "name email")
      .populate({
        path: "tour",
        populate: {
          path: "members.user",
          select: "name email",
        },
      });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check if user is a tour member
    const isMember = expense.tour.members.some((m) =>
      m.user._id.equals(req.user.id)
    );
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this expense",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expense",
      error: error.message,
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id).populate("tour");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check if user created the expense or is tour captain
    const tour = await Tour.findById(expense.tour._id);
    const isCreator = expense.createdBy.equals(req.user.id);
    const isCaptain = tour.captain.equals(req.user.id);

    if (!isCreator && !isCaptain) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this expense",
      });
    }

    const {
      description,
      amount,
      category,
      paidBy,
      participants,
      splitType,
      customSplits,
    } = req.body;

    // Verify participants are tour members if provided
    if (participants) {
      const memberIds = tour.members.map((m) => m.user.toString());
      const invalidParticipants = participants.filter(
        (p) => !memberIds.includes(p)
      );

      if (invalidParticipants.length > 0) {
        return res.status(400).json({
          success: false,
          message: "All participants must be tour members",
        });
      }
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        category,
        paidBy,
        participants,
        splitType,
        customSplits,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("paidBy", "name email")
      .populate("participants", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating expense",
      error: error.message,
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("tour");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check if user created the expense or is tour captain
    const tour = await Tour.findById(expense.tour._id);
    const isCreator = expense.createdBy.equals(req.user.id);
    const isCaptain = tour.captain.equals(req.user.id);

    if (!isCreator && !isCaptain) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this expense",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: error.message,
    });
  }
};
