import { getPathWithoutProto, getProtoFilename, getTypeName } from "../names";
import { FileContext } from "../file-context";
import * as assert from "assert";
import { FieldDescriptorProto } from "google-protobuf/google/protobuf/descriptor_pb";

export function generateRef(
  fieldDescriptor: FieldDescriptorProto,
  fileContext: FileContext
): string {
  const fieldTypeName = fieldDescriptor.getTypeName();
  assert.ok(fieldTypeName !== undefined);

  const fileDescriptor = fileContext
    .getGeneratorContext()
    .getFileDescriptorByFieldTypeName(fieldTypeName);
  assert.ok(fileDescriptor !== undefined);

  const isSameFile = fileContext.getFileDescriptor() === fileDescriptor;
  const typeName = getTypeName(fieldTypeName);

  if (isSameFile) {
    return fileContext.registerDefinition(typeName);
  } else {
    const fileName = fileDescriptor.getName();
    assert.ok(fileName);

    const protoFileName = getProtoFilename(fileName);
    fileContext.registerImport(
      protoFileName,
      getPathWithoutProto(fileName)
    );

    return `${protoFileName}.${typeName}`;
  }
}
