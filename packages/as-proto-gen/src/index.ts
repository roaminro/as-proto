import {
  CodeGeneratorRequest,
  CodeGeneratorResponse,
} from "google-protobuf/google/protobuf/compiler/plugin_pb";
import { GeneratorContext } from "./generator-context";
import { generateFile } from "./generate/file";
import { getPathWithoutProto } from "./names";
import { FileContext } from "./file-context";
import prettier from "prettier";
import * as fs from "fs";
import * as assert from "assert";

const input = fs.readFileSync(process.stdin.fd);

try {
  const codeGenRequest = CodeGeneratorRequest.deserializeBinary(input);
  const codeGenResponse = new CodeGeneratorResponse();
  const generatorContext = new GeneratorContext();

  codeGenResponse.setSupportedFeatures(
    CodeGeneratorResponse.Feature.FEATURE_PROTO3_OPTIONAL
  );

  for (const fileDescriptor of codeGenRequest.getProtoFileList()) {
    const fileDescriptorName = fileDescriptor.getName();
    assert.ok(fileDescriptorName);

    generatorContext.registerFile(fileDescriptor);
  }

  for (const fileName of codeGenRequest.getFileToGenerateList()) {
    const fileDescriptor =
      generatorContext.getFileDescriptorByFileName(fileName);
    assert.ok(fileDescriptor);

    const generatedCode = generateFile(
      fileDescriptor,
      new FileContext(generatorContext, fileDescriptor)
    );
    let formattedCode = generatedCode;
    try {
      formattedCode = prettier.format(generatedCode, {
        parser: "typescript",
      });
    } catch (error) {
      console.error(error);
    }

    const outputFile = new CodeGeneratorResponse.File();
    outputFile.setName(getPathWithoutProto(fileName) + ".ts");
    outputFile.setContent(formattedCode);
    codeGenResponse.addFile(outputFile);
  }

  process.stdout.write(Buffer.from(codeGenResponse.serializeBinary().buffer));
} catch (error) {
  console.log("An error occurred in as-proto generator plugin.");
  console.error(error);
  process.exit(1);
}
