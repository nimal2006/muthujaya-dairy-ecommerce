const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, phone, password, role, address } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or phone already exists",
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        password,
        role: role || "user",
        address,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user with email or username
// @access  Public
router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("Username or email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { identifier, password } = req.body;

      // Find user by email or username and include password
      const user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
      }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
const { protect } = require("../middleware/auth");

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("subscription.products.product")
      .populate("assignedRoute")
      .populate("assignedLabour", "name phone");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate reset token (in production, send via email)
      const resetToken = Math.random().toString(36).substring(2, 15);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
      await user.save();

      // TODO: Send email with reset link
      res.json({
        success: true,
        message: "Password reset instructions sent to email",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}/oauth/callback?token=${token}&provider=google`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

// ============================================
// FACEBOOK OAUTH ROUTES
// ============================================

// @route   GET /api/auth/facebook
// @desc    Facebook OAuth login
// @access  Public
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

// @route   GET /api/auth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`,
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}/oauth/callback?token=${token}&provider=facebook`
      );
    } catch (error) {
      console.error("Facebook callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

module.exports = router;
