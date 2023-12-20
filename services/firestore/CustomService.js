// const { Firestore } = require('@google-cloud/firestore');
const { admin, firestore } = require('../../config/firebaseConfig');
const { nanoid } = require('nanoid');
const ClientError = require('../../exceptions/ClientError');
const BookmarkService = require('./BookmarksService');

const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');

const credentials = require('../../credentials/serviceAccountKey.json');

class CustomService {
  constructor() {
    this.collection = 'customs';
    this.firestore = firestore;
    this.collectionRef = this.firestore.collection(this.collection);
  }

  
  async generateCustom(imageUrl){
    try {
      const storage = new Storage({
        projectId: 'baskaryaapp',
        credentials: credentials,
      });
      
      const bucket = storage.bucket('baskaryaapp.appspot.com');
      // const url = 'https://asset-a.grid.id//crop/0x0:0x0/700x0/photo/2019/12/03/1846798683.jpg';
      const url = imageUrl;

      const bucketFolder = 'customImages';
  
  
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imgBuffer = Buffer.from(response.data);
  
      const image = await sharp(imgBuffer);
  
      const overlayBuffer = fs.readFileSync('static/frame.png');
      const overlayImage = await sharp(overlayBuffer);
  
      const baseImageMetadata = await image.metadata();
  
      // Menyesuaikan ukuran base image agar memiliki dimensi yang sama
      const baseWidth = Math.min(baseImageMetadata.width, baseImageMetadata.height);
      const baseHeight = Math.min(baseImageMetadata.width, baseImageMetadata.height);
  
      const baseImage = await image.resize({
        width: baseWidth,
        height: baseHeight,
        fit: 'contain',
      });
  
      const resizedOverlayImage = await overlayImage.resize({
        width: baseWidth,
        height: baseHeight,
        fit: 'contain',
      });
  
      // Composite base image and overlay image
      const twibbonImage = await baseImage.composite([{ input: await resizedOverlayImage.toBuffer(), gravity: 'center' }]);
  
      // Create a new image with a transparent background
      const finalImage = sharp({
        create: {
          width: baseWidth,
          height: baseHeight,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      });
  
      // Composite twibbonImage onto finalImage
      await finalImage.composite([{ input: await twibbonImage.toBuffer(), left: 0, top: 0 }]);
  
      const timestamp = Date.now();
      const previewPathLocal = `custom-${timestamp}.png`;
      const previewPathUrl = `${bucketFolder}/${previewPathLocal}`;
  
      // Upload to Firebase Storage
      const blob = bucket.file(previewPathUrl);
      const uploadStream = blob.createWriteStream({
        contentType: 'image/png',
        resumable: false, // Set to true for larger files
      });
  
      await finalImage.pipe(uploadStream); // Send image buffer directly to Firebase Storage
  
      // Handle stream events (optional)
      return new Promise((resolve, reject) => {
        uploadStream
          .on('finish', () => {
            const urlCustom = `https://firebasestorage.googleapis.com/v0/b/baskaryaapp.appspot.com/o/${encodeURIComponent(bucketFolder)}/${encodeURIComponent(previewPathLocal)}?alt=media`;
            resolve(urlCustom);
          })
          .on('error', (error) => {
            reject(new ClientError(error.message));
          });
      });
    } catch (error) {
      throw new ClientError(error.message);
    }
  }


  async getCustomById(document) {
    const querySnapshot = await this.collectionRef.doc(document).get();
    if (querySnapshot.empty) {
      throw new NotFoundError('Custom Tidak Ditemukan');
    } else {
      return querySnapshot.data();
    }
  }

  async postCustom(imageUrl, batikName) {
    const time = admin.firestore.Timestamp.now();
    const customId = `custom-${nanoid(16)}`;

    const storageUrl = await this.generateCustom(imageUrl);

    const custom = {
      id: customId,
      name: batikName,
      publishedDate: time,
      imageUrl: storageUrl
    };

    if (!imageUrl || !batikName) {
      throw new Error('Data tidak lengkap. Pastikan semua field terisi.');
    }

    const documentRef = this.collectionRef.doc(customId);

    await documentRef.set(custom);
    return custom;
  }

}

module.exports = CustomService;