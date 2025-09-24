const sgMail = require('@sendgrid/mail')
const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const jwt = require("jsonwebtoken"); 

async function generateReceiptPDF(data) {
    const doc = new PDFDocument();
  
    // collect the stream into a buffer
    const stream = getStream.buffer(doc);
  
    // write content
    doc.fontSize(20).text("Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${data.name}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Amount: 500`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
  
    doc.end();
  
    // wait until the doc finishes and buffer is ready
    return await stream;
}


const sendEmail = async (user, subject, message) => {
    const pdfBuffer = await generateReceiptPDF(user);

    const msg = {
        to : user.email,
        from: 'shrikulkarni2205@gmail.com',
        subject,
        message,      
        html : `<h2>${subject}</h2><p>${message}</p>`,
        attachments: [
            {
              content: pdfBuffer.toString("base64"),
              filename: "receipt.pdf",
              type: "application/pdf",
              disposition: "attachment",
            },
          ],
      }
      console.log(msg);
    try{
        const response = await sgMail.send(msg);
        console.log(response);
        console.log(response[0].statusCode)
        console.log(response[0].headers)
    }catch(error) {
          console.error("Error while sending email : " + error)
    }
}

const getUserIdFromToken = (token) => {
  try {
    console.log("Token received:", token);

    if (!token) return null;

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
      console.log("Token after slicing Bearer:", token);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded JWT:", decoded);

    return decoded.id;
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
};


module.exports = {
    sendEmail,
    generateReceiptPDF,
    getUserIdFromToken
}