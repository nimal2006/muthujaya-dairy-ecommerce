const PDFDocument = require("pdfkit");

const generateBillPDF = async (bill, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Header
      doc
        .fontSize(24)
        .fillColor("#10B981")
        .text("🥛 Muthujaya Dairy Farm", { align: "center" });
      doc
        .fontSize(10)
        .fillColor("#6B7280")
        .text('"Nambi vanga sandhosam ah ponga"', { align: "center" });
      doc.moveDown();

      // Bill Info
      doc
        .fontSize(16)
        .fillColor("#1F2937")
        .text("MONTHLY BILL", { align: "center" });
      doc.moveDown();

      // Horizontal line
      doc
        .strokeColor("#E5E7EB")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
      doc.moveDown();

      // Bill details
      doc.fontSize(10).fillColor("#374151");

      const leftCol = 50;
      const rightCol = 300;
      let y = doc.y;

      doc.text("Bill Number:", leftCol, y);
      doc.text(bill.billNumber, leftCol + 100, y);
      doc.text("Bill Date:", rightCol, y);
      doc.text(new Date().toLocaleDateString("en-IN"), rightCol + 100, y);

      y += 20;
      doc.text("Customer:", leftCol, y);
      doc.text(user.name, leftCol + 100, y);
      doc.text("Due Date:", rightCol, y);
      doc.text(
        new Date(bill.dueDate).toLocaleDateString("en-IN"),
        rightCol + 100,
        y
      );

      y += 20;
      doc.text("Phone:", leftCol, y);
      doc.text(user.phone, leftCol + 100, y);
      doc.text("Status:", rightCol, y);
      doc
        .fillColor(bill.status === "paid" ? "#10B981" : "#EF4444")
        .text(bill.status.toUpperCase(), rightCol + 100, y);

      doc.moveDown(2);

      // Billing Period
      doc
        .fillColor("#1F2937")
        .fontSize(12)
        .text(
          `Billing Period: ${new Date(
            bill.billingPeriod.startDate
          ).toLocaleDateString("en-IN")} - ${new Date(
            bill.billingPeriod.endDate
          ).toLocaleDateString("en-IN")}`
        );
      doc.moveDown();

      // Items table header
      doc
        .strokeColor("#E5E7EB")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

      y = doc.y + 10;
      doc.fontSize(10).fillColor("#6B7280");
      doc.text("Product", 50, y);
      doc.text("Quantity", 200, y);
      doc.text("Rate", 300, y);
      doc.text("Amount", 450, y);

      doc
        .strokeColor("#E5E7EB")
        .lineWidth(1)
        .moveTo(50, doc.y + 15)
        .lineTo(550, doc.y + 15)
        .stroke();

      y = doc.y + 25;
      doc.fillColor("#374151");

      // Items
      for (const item of bill.items) {
        doc.text(item.productName || "Product", 50, y);
        doc.text(`${item.totalQuantity} ${item.unit || "L"}`, 200, y);
        doc.text(`₹${item.pricePerUnit}/${item.unit || "L"}`, 300, y);
        doc.text(`₹${item.totalAmount.toFixed(2)}`, 450, y);
        y += 20;
      }

      doc
        .strokeColor("#E5E7EB")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();

      // Summary
      y += 15;
      doc.text("Total Deliveries:", 300, y);
      doc.text(bill.totalDeliveries.toString(), 450, y);

      y += 20;
      doc.text("Skipped Deliveries:", 300, y);
      doc.text(bill.skippedDeliveries.toString(), 450, y);

      y += 20;
      doc.text("Subtotal:", 300, y);
      doc.text(`₹${bill.subtotal.toFixed(2)}`, 450, y);

      if (bill.discount > 0) {
        y += 20;
        doc.fillColor("#10B981").text("Discount:", 300, y);
        doc.text(`-₹${bill.discount.toFixed(2)}`, 450, y);
      }

      y += 25;
      doc.fontSize(14).fillColor("#1F2937");
      doc.text("Total Amount:", 300, y);
      doc
        .fontSize(14)
        .fillColor("#10B981")
        .text(`₹${bill.totalAmount.toFixed(2)}`, 450, y);

      if (bill.paidAmount > 0) {
        y += 25;
        doc.fontSize(10).fillColor("#374151");
        doc.text("Paid Amount:", 300, y);
        doc.text(`₹${bill.paidAmount.toFixed(2)}`, 450, y);
      }

      if (bill.pendingAmount > 0) {
        y += 20;
        doc.fillColor("#EF4444");
        doc.text("Pending Amount:", 300, y);
        doc.text(`₹${bill.pendingAmount.toFixed(2)}`, 450, y);
      }

      // Footer
      doc.moveDown(4);
      doc
        .fontSize(10)
        .fillColor("#6B7280")
        .text("Thank you for choosing Muthujaya Dairy Farm!", {
          align: "center",
        });
      doc.text("For queries, contact us at: +91 XXXXX XXXXX", {
        align: "center",
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateBillPDF };
