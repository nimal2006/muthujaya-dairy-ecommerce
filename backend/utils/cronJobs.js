const cron = require("node-cron");
const Bill = require("../models/Bill");
const User = require("../models/User");
const Delivery = require("../models/Delivery");
const { sendSMS, sendEmail } = require("./notifications");

// Schedule payment reminders - runs daily at 9 AM
const scheduleReminders = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running payment reminder job...");

    try {
      const today = new Date();

      // Find bills with upcoming due dates
      const upcomingBills = await Bill.find({
        status: { $in: ["generated", "sent", "partial"] },
        dueDate: {
          $gte: today,
          $lte: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        },
      }).populate("user");

      for (const bill of upcomingBills) {
        const daysUntilDue = Math.ceil(
          (bill.dueDate - today) / (1000 * 60 * 60 * 24)
        );

        if (bill.user && bill.user.notificationPreferences) {
          const message = `🥛 Reminder: Your milk bill of ₹${bill.pendingAmount} is due in ${daysUntilDue} days. Pay now to avoid late fees!`;

          if (bill.user.notificationPreferences.sms) {
            await sendSMS(bill.user.phone, message);
          }

          if (bill.user.notificationPreferences.email) {
            await sendEmail(
              bill.user.email,
              "Payment Reminder - Muthujaya Dairy Farm",
              message
            );
          }
        }
      }

      // Find overdue bills
      const overdueBills = await Bill.find({
        status: { $in: ["generated", "sent", "partial"] },
        dueDate: { $lt: today },
      }).populate("user");

      for (const bill of overdueBills) {
        bill.status = "overdue";
        await bill.save();

        if (bill.user && bill.user.notificationPreferences) {
          const message = `⚠️ URGENT: Your milk bill of ₹${bill.pendingAmount} is overdue. Please pay immediately to continue service.`;

          if (bill.user.notificationPreferences.sms) {
            await sendSMS(bill.user.phone, message);
          }

          if (bill.user.notificationPreferences.email) {
            await sendEmail(
              bill.user.email,
              "⚠️ Payment Overdue - Muthujaya Dairy Farm",
              message
            );
          }
        }
      }

      console.log("✅ Payment reminder job completed");
    } catch (error) {
      console.error("❌ Error in payment reminder job:", error);
    }
  });
};

// Schedule daily reports - runs at 10 PM
const scheduleDailyReports = () => {
  cron.schedule("0 22 * * *", async () => {
    console.log("⏰ Running daily report job...");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get today's delivery stats
      const deliveryStats = await Delivery.aggregate([
        {
          $match: {
            deliveryDate: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);

      console.log("📊 Daily Stats:", deliveryStats);

      // Notify admins
      const admins = await User.find({ role: "admin" });

      const delivered = deliveryStats.find((s) => s._id === "delivered") || {
        count: 0,
        totalAmount: 0,
      };
      const skipped = deliveryStats.find((s) => s._id === "skipped") || {
        count: 0,
      };

      const reportMessage =
        `📊 Daily Report (${today.toLocaleDateString()}):\n` +
        `✅ Delivered: ${delivered.count}\n` +
        `❌ Skipped: ${skipped.count}\n` +
        `💰 Revenue: ₹${delivered.totalAmount}`;

      for (const admin of admins) {
        if (admin.notificationPreferences?.email) {
          await sendEmail(
            admin.email,
            "Daily Report - Muthujaya Dairy Farm",
            reportMessage
          );
        }
      }

      console.log("✅ Daily report job completed");
    } catch (error) {
      console.error("❌ Error in daily report job:", error);
    }
  });

  // Schedule tomorrow's deliveries - runs at 6 AM
  cron.schedule("0 6 * * *", async () => {
    console.log("⏰ Creating scheduled deliveries...");

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Get active users with subscriptions
      const users = await User.find({
        isActive: true,
        "subscription.isActive": true,
      }).populate("subscription.products.product");

      for (const user of users) {
        for (const sub of user.subscription.products) {
          if (!sub.product) continue;

          // Check if delivery already exists
          const existingDelivery = await Delivery.findOne({
            user: user._id,
            deliveryDate: tomorrow,
            "items.product": sub.product._id,
          });

          if (!existingDelivery) {
            const totalPrice = sub.quantity * sub.product.pricePerUnit;

            await Delivery.create({
              user: user._id,
              labour: user.assignedLabour,
              route: user.assignedRoute,
              deliveryDate: tomorrow,
              deliveryTime:
                sub.deliveryTime === "both" ? "morning" : sub.deliveryTime,
              items: [
                {
                  product: sub.product._id,
                  quantity: sub.quantity,
                  pricePerUnit: sub.product.pricePerUnit,
                  totalPrice,
                },
              ],
              totalAmount: totalPrice,
              status: "scheduled",
              address: user.address,
            });
          }
        }
      }

      console.log("✅ Scheduled deliveries created");
    } catch (error) {
      console.error("❌ Error creating scheduled deliveries:", error);
    }
  });
};

module.exports = { scheduleReminders, scheduleDailyReports };
