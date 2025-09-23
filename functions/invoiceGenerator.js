/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import fs from "fs";
import { WritableStreamBuffer } from 'stream-buffers';
import PDFDocument from "pdfkit";

// Constants
const FONT_REGULAR = "fonts/NotoSans-Regular.ttf";
const FONT_BOLD = "fonts/NotoSans-Bold.ttf";
const LOGO_PATH = "logos/logo.png";
const SECOND_LOGO_PATH = "logos/logo2.png";
const RUPEE = "₹";

/**
 * Helper function to format currency properly
 */
const formatCurrency = (amount) => {
  return `${RUPEE}${amount.toFixed(2)}`;
};

/**
 * Helper function to format date/time to fit in column
 */
const formatDateTime = (date, maxWidth = 100) => {
    const optionsDate = { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" };
    const optionsTime = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true };
  
    return {
      line1: date.toLocaleDateString("en-IN", optionsDate),
      line2: date.toLocaleTimeString("en-IN", optionsTime),
    };
  };
  

/**
 * Helper function to draw multi-line text in a cell
 */
const drawCellText = (doc, text, x, y, width, options = {}) => {
  const { fontSize = 10, lineHeight = 12 } = options;
  
  if (typeof text === 'object' && text.line1) {
    // Multi-line text
    doc.fontSize(fontSize).text(text.line1, x, y, { width, ...options });
    if (text.line2) {
      doc.text(text.line2, x, y + lineHeight, { width, ...options });
    }
  } else {
    // Single line text with proper width constraint
    doc.fontSize(fontSize).text(text, x, y, { width, ...options });
  }
};

/**
 * Generate PDF invoice buffer for a booking
 * @param {Object} booking - Booking data from Firestore
 * @param {string} bookingId - Booking document ID
 * @param {Object} user - User data from Firestore
 * @param {Object} vehicle - Vehicle data from Firestore
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateInvoicePDF = async (booking, bookingId, user, vehicle) => {
  try {
    console.log(`🎨 Generating PDF for booking: ${bookingId}`);

    // --- PDF setup ---
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const bufferStream = new WritableStreamBuffer({
      initialSize: 100 * 1024,
      incrementAmount: 10 * 1024,
    });
    doc.pipe(bufferStream);

    // Fonts & logo (with better error handling)
    try {
      if (fs.existsSync(FONT_REGULAR) && fs.existsSync(FONT_BOLD)) {
        doc.registerFont("NotoSans", FONT_REGULAR);
        doc.registerFont("NotoSans-Bold", FONT_BOLD);
        doc.font("NotoSans");
      } else {
        console.log("⚠️ Custom fonts not found, using default fonts");
        doc.font("Helvetica");
      }
    } catch (fontError) {
      console.log("⚠️ Font loading failed, using default:", fontError.message);
      doc.font("Helvetica");
    }

    const logoY = 50;
    try {
        if (fs.existsSync(LOGO_PATH)) {
            doc.image(LOGO_PATH, 50, 45, { width: 40 });
          } else {
            console.log("⚠️ Logo not found at path:", LOGO_PATH);
          }
          
          // Second logo placed just beside first one but slightly lower
          if (fs.existsSync(SECOND_LOGO_PATH)) {
            const gap = 10;              
            const firstLogoWidth = 40;   
            const secondLogoX = 50 + firstLogoWidth + gap; 
            const lineY = logoY + 30;   
            const secondLogoY = lineY - 20; 
          
            doc.image(SECOND_LOGO_PATH, secondLogoX, secondLogoY, { width: 100 });
          } else {
            console.log("⚠️ Second logo not found at path:", SECOND_LOGO_PATH);
          }
          
          
    } catch (logoError) {
      console.log("⚠️ Logo loading failed:", logoError.message);
    }

    // --- Header ---
    const headerFont = fs.existsSync(FONT_BOLD) ? "NotoSans-Bold" : "Helvetica-Bold";
    const regularFont = fs.existsSync(FONT_REGULAR) ? "NotoSans" : "Helvetica";
    
    doc.font(headerFont).fontSize(14).text("Invoice", 400, logoY + 4, { align: "right" });
    doc.font(regularFont).fontSize(10);
    doc.moveTo(50, logoY + 30).lineTo(550, logoY + 30).stroke();

    const companyY = logoY + 40;
    doc.text("Speed Auto Services Pvt. Ltd.", 50, companyY);
    doc.text("8 Beck Bagan Row ", 50, companyY + 12);
    doc.text("Kolkata, West Bengal 700017", 50, companyY + 24);
    doc.text("GST No. : 19AAJCS0090E1ZE", 50, companyY + 36);
    doc.text("Email: support@fastfinite.in", 50, companyY + 48);
    doc.text("Phone: +91 9007074744", 50, companyY + 60);

    doc.text(` #INV-${bookingId}`, 300, companyY, { align: "right" });
    doc.text(
        `Booking Date: ${new Date(booking.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}`,
        300,
        companyY + 12,
        { align: "right" }
      );
      

    // --- Customer details ---
    let y = companyY + 90;
    doc.font(headerFont).fontSize(11).text("Customer Details", 50, y);
    y += 15;
    doc.font(regularFont).fontSize(10);
    doc.text(`Name: ${user.name || "N/A"}`, 50, y);
    doc.text(`Email: ${user.email || "N/A"}`, 50, y + 12);
    doc.text(`Phone: ${user.phoneNo || "N/A"}`, 50, y + 24);

    // --- Table header ---
    y += 60;
    const startX = 50;

    // Increased row height to accommodate multi-line content
    const rowHeight = 35;
    
    // Adjusted widths so total fits in 500px row
    const colWidths = { vehicle: 130, start: 110, end: 110, rate: 70, total: 80 };

    doc.rect(startX, y, 500, 25).fill("#f0f0f0");
    doc.fillColor("#000").font(headerFont).fontSize(11);

    doc.text("Vehicle", startX + 5, y + 7, { width: colWidths.vehicle });
    doc.text("Start Time", startX + colWidths.vehicle + 10, y + 7, { width: colWidths.start });
    doc.text("End Time", startX + colWidths.vehicle + colWidths.start + 20, y + 7, { width: colWidths.end });
    doc.text("Rate", startX + colWidths.vehicle + colWidths.start + colWidths.end + 30, y + 7, { width: colWidths.rate });
    doc.text("Total", startX + colWidths.vehicle + colWidths.start + colWidths.end + colWidths.rate + 40, y + 7, { width: colWidths.total });

    // --- Vehicle row ---
    const pickup = new Date(booking.startTime);
    const dropoff = new Date(booking.endTime);

    // Base values (before GST)
    const baseTotal = booking.amount / 1.18; 
    const baseRate = baseTotal;

    // Format dates and amounts
    const startTimeFormatted = formatDateTime(pickup);
    const endTimeFormatted = formatDateTime(dropoff);
    const rateFormatted = formatCurrency(baseRate);
    const totalFormatted = formatCurrency(baseTotal);

    y += 30;
    doc.font(regularFont).fontSize(9); // Slightly smaller font for better fit

    // Increased row height for multi-line content
    doc.rect(startX, y - 2, 500, rowHeight).fill("#f9f9f9").fillColor("#000");
    
    // Draw vehicle name
    drawCellText(doc, vehicle.name || `Vehicle ${booking.vehicle_id}`, 
                 startX + 5, y + 5, colWidths.vehicle, { fontSize: 9 });

    // Draw start time (potentially multi-line)
    drawCellText(doc, startTimeFormatted, 
                 startX + colWidths.vehicle + 10, y + 5, colWidths.start, { fontSize: 9 });

    // Draw end time (potentially multi-line)
    drawCellText(doc, endTimeFormatted, 
                 startX + colWidths.vehicle + colWidths.start + 20, y + 5, colWidths.end, { fontSize: 9 });

    // Draw rate (with proper width constraint)
    drawCellText(doc, rateFormatted, 
                 startX + colWidths.vehicle + colWidths.start + colWidths.end + 30, y + 5, colWidths.rate, { fontSize: 9 });

    // Draw total (with proper width constraint)
    drawCellText(doc, totalFormatted, 
                 startX + colWidths.vehicle + colWidths.start + colWidths.end + colWidths.rate + 40, y + 5, colWidths.total, { fontSize: 9 });

    // --- Totals ---
    y += rowHeight + 20; // Account for increased row height
    const gst = baseTotal * 0.18;
    const grandTotal = baseTotal + gst;

    // First show Subtotal + GST + Grand Total
    const totals = [
      { label: "Subtotal:", value: baseTotal },
      { label: "GST (18%):", value: gst },
      { label: "Grand Total:", value: grandTotal },
    ];

    totals.forEach(({ label, value }, i) => {
      const isGrand = label === "Grand Total:";
      const bgColor = isGrand ? "#e0e0e0" : "#f6f6f6";
      const rowY = y + i * 20;

      doc.rect(startX + 250, rowY - 2, 250, 18).fill(bgColor);
      doc.fillColor("#000").font(headerFont).fontSize(10);
      
      // Use proper width constraints for totals section
      doc.text(label, startX + 255, rowY, { width: 120 });
      doc.text(formatCurrency(value), startX + 380, rowY, { width: 115, align: 'right' });
    });

    // Now show Refundable Deposit separately BELOW Grand Total
    const depositY = y + totals.length * 20 + 10; // some spacing
    doc.rect(startX + 250, depositY - 2, 250, 18).fill("#f9f9f9");
    doc.fillColor("#000").font(headerFont).fontSize(10);
    
    doc.text("Refundable Deposit:", startX + 255, depositY, { width: 120 });
    doc.text(formatCurrency(booking.deposit), startX + 380, depositY, { width: 115, align: 'right' });

    // Note about refundable deposit
    doc.font(regularFont).fontSize(9).fillColor("gray")
       .text("To be paid at the time of pickup and refunded at the time of dropoff", 
             startX + 255, depositY + 15, { width: 240 });

    // --- Footer ---
    doc.moveDown(4);
    doc.font(regularFont).fontSize(10).fillColor("#000")
       .text("Thank you for booking with Fast Finite!", 0, doc.y, { align: "center" });

    // --- Finalize PDF ---
    doc.end();
    
    console.log("📄 PDF generation completed, waiting for buffer...");
    
    const pdfBuffer = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("PDF buffer generation timeout"));
      }, 30000); // 30 second timeout
      
      bufferStream.on("finish", () => {
        clearTimeout(timeout);
        resolve(bufferStream.getContents());
      });
      bufferStream.on("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    console.log(`📄 PDF buffer created, size: ${pdfBuffer.length} bytes`);

    return pdfBuffer;

  } catch (error) {
    console.error("❌ CRITICAL ERROR in PDF generation:", error);
    console.error("❌ Error stack:", error.stack);
    throw error; // Re-throw so the caller can handle it
  }
};