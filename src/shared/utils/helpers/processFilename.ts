export const processFileName = (name: string): { fileName: string, fileExtension: string } => {
  if (name.length <= 37) {
    throw new Error('File name is too short to remove the prefix');
  }

  const filenameWithoutUUID = name.substring(37);
  const lastDotIndex = filenameWithoutUUID.lastIndexOf('.');

  if (lastDotIndex === -1) {
    throw new Error('Invalid file extension format');
  }

  const fileName = filenameWithoutUUID.substring(0, lastDotIndex);
  const fileExtension = filenameWithoutUUID.substring(lastDotIndex + 1);

  return { fileName, fileExtension };
};