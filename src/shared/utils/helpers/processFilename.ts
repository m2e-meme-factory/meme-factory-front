export const processFileName = (name: string): { fileName: string, fileExtension: string } => {
  const nameToProcess = name.length <= 37 ? name : name.substring(37);
  const lastDotIndex = nameToProcess.lastIndexOf('.');

  const fileName = lastDotIndex !== -1 ? nameToProcess.substring(0, lastDotIndex) : nameToProcess;
  const fileExtension = lastDotIndex !== -1 ? nameToProcess.substring(lastDotIndex + 1) : 'unknown';

  return { fileName, fileExtension };
};
