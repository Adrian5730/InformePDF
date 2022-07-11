const { GoogleSpreadsheet } = require('google-spreadsheet');
let idDocumento = '1TfHd_lLpgqeksPutIv_0M-mkBEefqPX4nGL6Vincblo';
let credenciales = require('./credentials.json');
async function accederGoogleSheet(){
    const documento = new GoogleSpreadsheet(idDocumento)
    await documento.useServiceAccountAuth(credenciales)
    await documento.loadInfo();
    const sheet = documento.sheetsByIndex[0];
    const registros = await sheet.getRows();
    return registros 
}   
module.exports = {
    accederGoogleSheet
}