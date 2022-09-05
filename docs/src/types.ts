export type TComponentDocPartProps = {
  typeDoc: any;
  typeDocs?: any;
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
    name: string;
    declaration?: {
      signatures?: any[];
    };
  };
  comment?: any;
  [key: string]: any;
};
