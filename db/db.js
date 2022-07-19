const { GoogleSpreadsheet } = require('google-spreadsheet');
let idDocumento = '1GThNlD_JR6dNhGttwqExpVD8qtnCV6ZeMi27rTd3a1o';
let credenciales = require('./credentials.json');

let accederGoogleSheet = {


    database: async function (id) {
        const sheet = await accederGoogle(id)
        const registros = await sheet.getRows();
        return registros
    },

    actulizarCeldaInvoice: async function (id, dato) {
        const sheet = await accederGoogle(id)
        await sheet.loadCells()
        const celdaXactualizar = await sheet.getCellByA1('A2'); 
        celdaXactualizar.value = dato;
        await sheet.saveUpdatedCells();
    },
}

let accederGoogle = async (id) => {
    const documento = new GoogleSpreadsheet(idDocumento)
    await documento.useServiceAccountAuth(credenciales)
    await documento.loadInfo();
    const sheet = documento.sheetsByIndex[id];
    return sheet
}

module.exports = accederGoogleSheet 
