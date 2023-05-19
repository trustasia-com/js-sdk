declare module "emailjs-mime-parser" {
  class MimeNode {
    header: string[];
    headers: {
      from: Array<any>;
      to: Array<any>;
    };
    childNodes: MimeNode[];
    contentType: any;
    content: Uint8Array;
    raw: string;
  }
  const parse: (arg0: string) => MimeNode;
  export default parse;
}
