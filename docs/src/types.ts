export type TComponentDocPartProps = {
  typeDoc: any;
  typeDocs?: any;
  title?: string;
};

export type TParameterInfo = {
  id: number;
  name: string;
  kindString: string;
  flags: {
    isOptional?: boolean;
    [key: string]: any;
  };
  type: {
    type: string;
    types?: { type: string, name: string }[]
    name: string;
    declaration?: {
      signatures?: any[];
    };
    value?: any
  };
  comment?: any;
  [key: string]: any;
};
