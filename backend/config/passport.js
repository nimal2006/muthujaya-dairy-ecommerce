const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          });

          if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value || "",
            isEmailVerified: true,
            role: "user",
            address: {
              street: "",
              city: "",
              state: "",
              pincode: "",
            },
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
          process.env.FACEBOOK_CALLBACK_URL || "/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "email", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({
            $or: [
              { facebookId: profile.id },
              { email: profile.emails?.[0]?.value },
            ],
          });

          if (user) {
            // Update Facebook ID if not set
            if (!user.facebookId) {
              user.facebookId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
            avatar: profile.photos?.[0]?.value || "",
            isEmailVerified: true,
            role: "user",
            address: {
              street: "",
              city: "",
              state: "",
              pincode: "",
            },
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
