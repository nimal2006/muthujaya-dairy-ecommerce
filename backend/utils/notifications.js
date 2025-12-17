const nodemailer = require("nodemailer");
const Notification = require("../models/Notification");

// Email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send Email
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Muthujaya Dairy Farm" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html:
        html ||
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🥛 Muthujaya Dairy Farm</h1>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <p style="color: #374151; line-height: 1.6;">${text}</p>
          </div>
          <div style="background: #1f2937; padding: 15px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              🥰 "Nambi vanga sandhosam ah ponga"
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

// Send SMS via Twilio
const sendSMS = async (phoneNumber, message) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log(`📱 SMS (mock): ${phoneNumber} - ${message}`);
      return true;
    }

    const twilio = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await twilio.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`📱 SMS sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error("SMS error:", error);
    return false;
  }
};

// Create in-app notification
const createNotification = async (
  userId,
  title,
  message,
  type = "system",
  priority = "medium"
) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      priority,
      channels: ["push"],
    });
    return notification;
  } catch (error) {
    console.error("Notification error:", error);
    return null;
  }
};

// Send notification via all channels
const sendNotification = async (
  user,
  title,
  message,
  type = "system",
  priority = "medium"
) => {
  const results = {
    push: false,
    email: false,
    sms: false,
  };

  // Create in-app notification
  const notification = await createNotification(
    user._id,
    title,
    message,
    type,
    priority
  );
  if (notification) results.push = true;

  // Send email if enabled
  if (user.notificationPreferences?.email) {
    results.email = await sendEmail(user.email, title, message);
  }

  // Send SMS if enabled
  if (user.notificationPreferences?.sms) {
    results.sms = await sendSMS(user.phone, `${title}: ${message}`);
  }

  return results;
};

module.exports = {
  sendEmail,
  sendSMS,
  createNotification,
  sendNotification,
};
