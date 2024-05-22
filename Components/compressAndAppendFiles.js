import imageCompression from 'browser-image-compression';

const compressAndAppendFiles = async (files, formData, fieldName, from) => {
  console.log(
    `🚀 ~ file: compressAndAppendFiles.js:4 ~ compressAndAppendFiles ~ files:`,
    from,
    files
  );
  if (files) {
    await Promise.all(
      files.map(async (file) => {
        console.log(
          `🚀 ~ file: compressAndAppendFiles.js:8 ~ files.map ~ file:`,
          from,
          file.originFileObj,
          file
        );
        const options = {
          maxSizeMB: 0.5,
          useWebWorker: true,
          alwaysKeepResolution: false,
          // fileType: "image/webp",
        };
        if (file?.type == 'application/pdf') {
          formData.append(fieldName, file.originFileObj);
        } else {
          try {
            let compressedFile = await imageCompression(
              file.originFileObj,
              options
            );
            console.log(
              `🚀 ~ file: compressAndAppendFiles.js:24 ~ files.map ~ compressedFile:`,
              from,
              compressedFile
            );
            compressedFile = new File([compressedFile], compressedFile.name);
            formData.append(fieldName, compressedFile);
          } catch (error) {
            console.error(error);
          }
        }
      })
    );
  }
};

export default compressAndAppendFiles;
