const { generateReceiptPDF } = require("../utilities/utils");

const getHomeData = async (req, res) => {
    res.json({
        message : "hello" ,
        success : true,
        user : req.user,
    })
}

const downloadPDF = async (req, res) => {
    const pdfBuffer = await generateReceiptPDF(req.user);
    
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=receipt.pdf");
      res.send(pdfBuffer);
}

module.exports = {
    getHomeData,
    downloadPDF
}