const express = require('express');
const router = express.Router();
let pdfController = require("../../controllers/pdf/pdfController");

router.get('/', pdfController.traerDatos);
router.post('/', pdfController.actualizarInvoice);
router.get('/creacionMasiva', pdfController.generadorMasivoPdfs);
router.get('/creacion/:id', pdfController.generdorPdf);


module.exports = router;