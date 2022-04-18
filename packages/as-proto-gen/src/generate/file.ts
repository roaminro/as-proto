import { generateMessage } from "./message";
import { getProtoFilename } from "../names";
import { FileDescriptorProto } from "google-protobuf/google/protobuf/descriptor_pb";
import { FileContext } from "../file-context";
import { generateEnum } from "./enum";
import * as assert from "assert";

export function generateFile(
  fileDescriptor: FileDescriptorProto,
  fileContext: FileContext
): string {
  const fileName = fileDescriptor.getName();
  assert.ok(fileName);

  const types: string[] = [];
  for (const messageDescriptor of fileDescriptor.getMessageTypeList()) {
    types.push(generateMessage(messageDescriptor, fileContext));
  }
  for (const enumDescriptor of fileDescriptor.getEnumTypeList()) {
    types.push(generateEnum(enumDescriptor, fileContext));
  }

  let NamespacedTypes = types.join("\n\n");
  NamespacedTypes = `
    export namespace ${getProtoFilename(fileName)} {
      ${NamespacedTypes}
    }
  `;

  return `
    ${fileContext.getImportsCode()}
    
    ${NamespacedTypes}
  `;
}
