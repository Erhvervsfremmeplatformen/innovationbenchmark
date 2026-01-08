declare module '@sanity/block-content-to-html' {
  interface BlocksToHtmlOptions {
    blocks: any;
    serializers?: any;
    projectId?: string;
    dataset?: string;
    imageOptions?: any;
  }

  export default function blocksToHtml(options: BlocksToHtmlOptions | any): string;
}
