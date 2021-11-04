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
