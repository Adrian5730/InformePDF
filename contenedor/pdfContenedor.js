const ejs = require('ejs');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const JsBarcode = require('jsbarcode');
const googleSheet = require('../db/db');
const incrementString = require('../controllers/pdf/incrementString')
const pdf = require("html-pdf");


const pdfContainer = {

    crearCodigoBarras(textoAConvertir, ancho, formato) {
        const xmlSerializer = new XMLSerializer();
        const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
        const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        JsBarcode(svgNode, textoAConvertir, {
            xmlDocument: document,
            format: formato,
            width: ancho,
            height: 70,
            margin: 2
        });
        const svgText = xmlSerializer.serializeToString(svgNode);;
        return svgText;
    },

    async renderizacionPlantilla(data, voidsEnCodigoSvg, nombreArchivo, full ) {
        let html;
        await ejs.renderFile('./views/plantilla-pdf-unico.ejs', { db: data, voidsEnCodigoSvg: voidsEnCodigoSvg, nombreArchivo: nombreArchivo, full}, (err, result) => {
            if (result) {
                html = result
            } else {
                console.log(err)
            }
        })
        return html
    },

    async crearPDF(documento, nombreArchivo) {
        let options = { format: 'Letter', type: 'pdf', timeout: 30000};
        await pdf.create(documento, options).toFile(`./public/pdf/${nombreArchivo}.pdf`, (err, res) => {
            if (err) return console.log(err);
            return res
            //console.log(res); // Devuelve la ruta de los archivos con su nombre
        });
    }
}

module.exports = pdfContainer;