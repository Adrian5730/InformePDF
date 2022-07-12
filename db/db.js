const { GoogleSpreadsheet } = require('google-spreadsheet');
let idDocumento = '1GThNlD_JR6dNhGttwqExpVD8qtnCV6ZeMi27rTd3a1o';
let credenciales = require('./credentials.json');

let accederGoogleSheet = {


    database: async function () {
        const sheet = await accederGoogle()
        const registros = await sheet.getRows();
        return registros
    },

    actulizarCeldaInvoice: async function (dato) {
        const sheet = await accederGoogle()
        await sheet.loadCells()
        const celdaXactualizar = await sheet.getCellByA1('A2');
        celdaXactualizar.value = dato;
        await sheet.saveUpdatedCells();
    }
}

let accederGoogle = async () => {
    const documento = new GoogleSpreadsheet(idDocumento)
    await documento.useServiceAccountAuth(credenciales)
    await documento.loadInfo();
    const sheet = documento.sheetsByIndex[4];
    return sheet
}

module.exports = accederGoogleSheet 
