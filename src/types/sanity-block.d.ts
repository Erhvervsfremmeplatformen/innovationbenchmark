declare module '@sanity/block-content-to-html' {
  export interface BlockContentOptions {
    blocks: any[];
    serializers?: any;
    projectId?: string;
    dataset?: string;
  }
  
  export default function blocksToHtml(options: BlockContentOptions): string;
}

export interface Child {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface SanityBlock {
  _key: string;
  _type: string;
  children: Child[];
  markDefs: any[];
  style: string;
  level?: number;
  listItem: string;
}
