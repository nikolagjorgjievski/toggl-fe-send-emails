import { FileWithPath } from 'react-dropzone';

export default interface FileWithEmails extends FileWithPath {
  parsedLines?: string[],
}
