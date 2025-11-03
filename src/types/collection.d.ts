/**
 * Issue metadata type definition
 */
export type Issue = {
  ImageUrl: string;
  Title: string;
  Vol: string;
  Issue: string;
  Month: string;
  Year: string;
  Link: string;
  PdfUrl: string;
  id: string;
}

/**
 * Submission type definition
 */
export type SubmissionType = {
  title: string;
  desc: string;
  imgUrl: string[];
  imgCaption: string;
  brochureUrl: string;
  categoryId: string;
  eventDate: string;
  uid: string;
  id: string;
  author: string;
  created: string;
  createdInSeconds: number;
  approved: boolean;
}

/**
 * Submission update type definition
 */
export type SubmissionUpdateType = SubmissionType & {
  delete?: boolean;
}
