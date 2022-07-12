const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const fs = require('fs');
const KEYFILEPATH = './db/credentials.json';

let createFolder = async (nombreCarpeta) => {
    const auth = new GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: 'https://www.googleapis.com/auth/drive'
    });
    const service = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        'name': nombreCarpeta,
        'parents': ['1Z0qpUbL8ls79syqF21W_wjd0Fa1koT28'],
        'mimeType': 'application/vnd.google-apps.folder',
    };
    try {
        const file = await service.files.create({
            resource: fileMetadata,
            fields: 'id',
        });
        console.log('Folder Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
}
let crearYSubirArchivo = async (nombreArchivo, nombreCarpeta) => {
    let idCarpeta = await createFolder(nombreCarpeta);
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    });

    const driveService = google.drive({ version: 'v3', auth });

    let fileMetadata = {
        'name': `${nombreArchivo}.pdf`,
        'parents': [idCarpeta]
    };

    let media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(`./public/pdf/${nombreArchivo}.pdf`)
    };

    //Respuesta

    let response = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    switch (response.status) {
        case 200:
            let file = response.result;
            console.log('Created File Id: ', response.data.id);
            break;
        default:
            console.error('Error creating the file, ' + response.errors);
            break;
    }
}

module.exports = crearYSubirArchivo;