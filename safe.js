const imgLinks = [];

const uploadImages = () => {
  let imagesLen = images.length;
  images.forEach((image, index) => {
    const storageRef = ref(storage, `Images/${Categories[category_Id]}/${image.name.split(/(\\|\/)/g).pop()}/`);
    uploadBytes(storageRef, image).then(snapshot => getDownloadURL(snapshot.ref).then(url => {
      imgLinks.push(url);
    }))
      .catch(error => {
        setAlertMessage(error.message);
        setAlertSeverity('error');
        console.log(error);
      })
      .then(() => {
        if (index === imagesLen - 1) uploadOnFirestore();
      })
  })
  if (imagesLen === 0) uploadOnFirestore();
}

if (eventBrochure) {
  const storageRef = ref(storage, `Brochure/${Categories[category_Id]}/${eventBrochure.name.split(/(\\|\/)/g).pop()}/`);
  uploadBytes(storageRef, eventBrochure).then(snapshot => getDownloadURL(snapshot.ref).then(url => {
    brochureUrl = url
    desc += ` [Download event brochure](${url})`;
  }))
    .catch(error => {
      setAlertMessage(error.message);
      setAlertSeverity('error');
      console.log(error);
    })
    .finally(() => {
      uploadImages();
    })
} else {
  uploadImages();
}