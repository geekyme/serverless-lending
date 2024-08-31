export interface Document {
  id: string;
  applicationId: string;
  documentType: string;
  fileLocation: string;
  uploadDate: string;
}

export const DocumentKeys = {
  pk: (applicationId: string) => `APPLICATION#${applicationId}`,
  sk: (documentId: string) => `DOCUMENT#${documentId}`,
};
