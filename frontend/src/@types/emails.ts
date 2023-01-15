
export interface UploadEmailsRequest {
  emails: string[],
}

export interface UploadEmailsResponse {
  emails?: string[],
  error?: string,
}
