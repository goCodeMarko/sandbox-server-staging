const 
    { createCanvas, loadImage } = require('canvas'),
    QRCode = require('qrcode'),
    moment = require('moment'),
    cloudinary = require('./../helpers/cloudinary').uploader;

module.exports.generate= async () => {
    const datetime = moment().format("MMDDYYYYHHMMSS");
    const code = 'E-' + datetime +'000001';
    const result = uploadQRCode(code);

    return result;
}

async function uploadQRCode(code) {
    const qrCodeBase64 = await createQRCodeImg(code);

    //uploads the qr code image on the cloudinary
    const upload = await cloudinary.upload(qrCodeBase64, {
        folder: 'qr_codes',
        type: "authenticated"
    });

    return upload;
}

async function createQRCodeImg(code) {
    //create canvas for qr
    const qrCodecanvas = createCanvas(264, 264); // 164
    const qrCodeContext = qrCodecanvas.getContext("2d");

    //insert qrcode image on the qr canvas
    QRCode.toCanvas(
        qrCodecanvas,
        code,
        {
            errorCorrectionLevel: 'H',
            version: 4,
            type: 'image/jpeg',
            quality: 1,
            color: {
                dark: "#000",
                light: "#ffffff"
            }
        }
    );

    //styling the logo canvas
    const logo = await loadImage('https://res.cloudinary.com/dhmkfau4h/image/upload/v1662440493/logo/Bacolod_jkq086.png');
    
    const logoCanvas = createCanvas(500, 500);
    const logoContext = logoCanvas.getContext('2d');
    logoContext.fillStyle = 'rgba(255, 255, 255, 0.8)';
    logoContext.fillRect(0, 0, logoCanvas.width, logoCanvas.height);
    logoContext.drawImage(logo, 6, 6, 490, 490);

    //inserts the logo on qrcode canvas
    qrCodeContext.drawImage(logoCanvas, 60, 60, 45, 45);
    // const base64 = logoCanvas.toDataURL("image/png");
    const base64 = qrCodecanvas.toDataURL("image/png");

    return base64;
}
