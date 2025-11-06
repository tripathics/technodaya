export namespace Collections {
  /**
   * User from users collection
   */
  type User = {
    Password: string;
    Email: string;
    Role?: 'admin';
    FullName: string;
    id: string;
  };

  /**
   * Issue metadata type definition
   */
  type Issue = {
    ImageUrl: string;
    Title: string;
    Vol: string;
    Issue: string;
    Month: string;
    Year: string;
    Link: string;
    PdfUrl: string;
    id: string;
  };

  /**
   * Submission type definition
   */
  type Submission = {
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
  };

  /**
   * Submission update type definition
   */
  type SubmissionUpdate = Submission & {
    delete?: boolean;
  };
}

/**
 * @deprecated
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
};

/**
 * @deprecated
 * Submission type definition
 */
export type Submission = {
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
};

/**
 * @deprecated
 * Submission update type definition
 */
export type SubmissionUpdate = Submission & {
  delete?: boolean;
};
