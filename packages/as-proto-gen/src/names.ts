export function getPathWithoutProto(fileName: string): string {
  const extension = ".proto";
  return fileName.endsWith(extension)
    ? fileName.slice(0, -extension.length)
    : fileName;
}

export function getProtoFilename(fileName: string): string {
  const extension = ".proto";
  const fileNameSlices = fileName.split('/');

  return fileNameSlices[fileNameSlices.length - 1].replace('.proto', '');
}

export function getFieldTypeName(
  filePackage: string | undefined,
  typeName: string
): string {
  let fieldTypeName = ".";
  if (filePackage) {
    fieldTypeName += filePackage + ".";
  }
  fieldTypeName += typeName;
  return fieldTypeName;
}

export function getTypeName(fieldTypeName: string): string {
  const fieldTypeNameSlices = fieldTypeName.split('.');
  return fieldTypeNameSlices[fieldTypeNameSlices.length - 1];
}

export function getRelativeImport(importName: string): string {
  return importName.startsWith(".") ? importName : `./${importName}`;
}
