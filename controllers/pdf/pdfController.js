const JsBarcode = require('jsbarcode');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const pdf = require("html-pdf");
const ejs = require('ejs');
const accederGoogleSheet = require('../../db/db');
const crearYSubirArchivo = require('../../db/crearYSubirArchivo');
const pdfContainer = require('../../contenedor/pdfContenedor.js');
const incrementString = require('./incrementString')
const path = require('path');
const hojaNumOrden = 4;



let pdfController = {
    traerDatos: async function (req, res) {
        let db = await accederGoogleSheet.database(hojaNumOrden);
        res.render('pdf', { db })
    },

    actualizarInvoice: async function (req, res) {
        await accederGoogleSheet.actulizarCeldaInvoice(hojaNumOrden, req.body.invoice)
        res.redirect('/pdf')
    },

    generadorMasivoPdfs: async function (req, res) {

        //Acceso a la db
        let db = await googleSheet.accederGoogleSheet();

        //Recorro la db y creo un array con los datos de los voids
        db.forEach(async function (data, e) {
            let html;
            let voids = [];
            let voidsEnCodigoSvg = [];
            let voidDesde = data.VoidDesde
            let nombreArchivo = data.Codigo + data.Id
            for (let i = 0; i < data.Units; i++) {
                if (voids.length == 0) {
                    voids.push(voidDesde)
                } else {
                    voids.push(incrementString(voids[voids.length - 1]))
                }
            }

            //Creo los codigos de barras de los voids
            const xmlSerializer = new XMLSerializer();
            const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            for (let j = 0; j < voids.length; j++) {
                JsBarcode(svgNode, voids[j], {
                    xmlDocument: document,
                    format: "CODE128",
                    width: 1.5,
                    height: 75,
                    margin: 5
                });
                const svgText = xmlSerializer.serializeToString(svgNode);;
                voidsEnCodigoSvg.push(svgText);
            }

            //Renderizo el html con ejs para que se pueda usar el codigo de barras
            ejs.renderFile('./views/plantilla-pdf.ejs', { db: data, voidsEnCodigoSvg, nombreArchivo }, (err, result) => {
                if (result) {
                    html = result;
                } else {
                    console.log(err)
                }
            })

            //Creo el pdf
            let options = { format: 'Letter' };
            pdf.create(html, options).toFile(`./public/pdf/${nombreArchivo}.pdf`, (err, res) => {
                if (err) return console.log(err);
                //console.log(res); // Devuelve la ruta de los archivos con su nombre
            });

            //Creo carpeta para cada pdf y los subo en esa carpeta de  drive
            let nombreCarpeta = data.Id
            // crearYSubirArchivo.crearYSubirArchivo(nombreArchivo, nombreCarpeta)



            //Redirijo al usuario a la ruta 'home'
            res.render('plantilla-pdf', { db: data, voidsEnCodigoSvg, nombreArchivo })
        })
    },

    generdorPdf: async function (req, res) {
        let db = await accederGoogleSheet.database(hojaNumOrden);
        const id = db.findIndex((data) => data.rowNumber == req.params.id)
        const data = db[id];
        let full = {};
        for( let i=1; i <= data.Contador; i++ ){
            full["Num"+i]={
                MLA: data['MLA'+i],
                InventoryID: data['InventoryID'+i],
                CUENTA: data['CUENTA'+i],
                codigoBarras: pdfContainer.crearCodigoBarras(data['InventoryID'+i], 1, "CODE128")
            }
        }
        if(!full.Num1){ full = undefined; }
        let nombreArchivo = (data.Codigo + data.Id)
        const voidsCaja = pdfContainer.crearCodigoBarras(data.SOCartonInicial, 1, "CODE128")
        const voidsIndividuales = pdfContainer.crearCodigoBarras(data.VoidDesde, 1.8, "CODE128")
        const voidsEan = pdfContainer.crearCodigoBarras(data.Ean, 1.6, "EAN13")
        const voidsCajaFinal = pdfContainer.crearCodigoBarras(data.SOCartonFinal, 1, "CODE128")
        const voidsIndividualesFinal = pdfContainer.crearCodigoBarras(data.VoidHasta, 1.8, "CODE128")
        const voidElement = { voidsCaja, voidsIndividuales, voidsEan, voidsCajaFinal, voidsIndividualesFinal }
        const html = await pdfContainer.renderizacionPlantilla(data, voidElement, nombreArchivo, full)
        await pdfContainer.crearPDF(html, nombreArchivo)
        let nombreCarpeta = data.Id
        setTimeout(() => {
            crearYSubirArchivo(nombreArchivo, nombreCarpeta);
        }, 2000)
        res.redirect('/pdf')
        // res.setHeader("Content-Type", "application/pdf")
        // res.download(`./public/pdf/${nombreArchivo}.pdf`, (err) => {
        //     if(err){
        //         console.log(err);
        //     }
        // });

    },
    
     //Prueba 

}

module.exports = pdfController;