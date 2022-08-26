export interface SliderField {
  _key: string;
  _type: string;
  description: string;
  key: string;
  label: string;
  options: string[];
  page: string;
}

export interface FrontPageMatter {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  cards?: Card[] | null;
  cta_text: string;
  headline: string;
  lead: string;
}

export interface Results1 {
  simpleList: {
    [key: string]: string;
  };

  histogramList: {
    [key: string]: HistogramItem[];
  };
}

export interface Results2 {
  simpleList: {
    [key: string]: string;
  };
  histogramList: {
    [key: string]: HistogramItem[];
  };
}

export interface Test1 {
  _createdAt: Date;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: Date;
  fields: Field[];
  headline: string;
  order: number;
  shortTitle: string;
  text: Text[];
  calculatingSliders?: boolean;
  cards: Card[];
}

export interface Test2 {
  _createdAt: Date;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: Date;
  calculatingSliders: boolean;
  fields: Field[];
  headline: string;
  order: number;
  text: Text[];
  cards: Card[];
}

export interface Field {
  _key: string;
  _type: string;
  key?: string;
  label?: string;
  page?: string;
  placeholder?: string;
  width?: number;
  options?: string[];
  description?: string;
  processColor?: boolean;
  required?: boolean;
}

export interface Card {
  _key: string;
  _type: string;
  cardBody?: CardBody[] | null;
  cardButtonText?: string | null;
  cardButtonUrl?: string | null;
  cardHeadline: string;
}
export interface CardBody {
  _key: string;
  _type: string;
  children?: CardChildren[] | null;
  markDefs?: null[] | null;
  style?: string | null;
  level?: number | null;
  listItem?: string | null;
}
export interface CardChildren {
  _key: string;
  _type: string;
  marks?: (string | null)[] | null;
  text: string;
}

export interface Child {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface Text {
  _key: string;
  _type: string;
  children: Child[];
  markDefs: any[];
  style?: string;
  level?: number;
  listItem?: string;
}

export interface HistogramItem {
  Variable: string;
  Value: string;
}

export interface SanityChild {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface SanityBlock {
  _key: string;
  _type: string;
  children: SanityChild[];
  markDefs: any[];
  style: string;
  level?: number;
  listItem: string;
}
