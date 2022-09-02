import React from "react";

import {
  Summary,
  Parameters,
  Returns,
  ExampleUsage,
  ErrorGroup,
} from "./index";

// @ts-ignore
import typeDocs from "./typedocs.json";

type ComponentDocProps = {
  componentName: string
  codeScope?: any
  codePreview?: boolean
  codeErrors?: boolean
};

export const ComponentDoc = (props: ComponentDocProps) => {
  const { componentName, codeScope, codePreview, codeErrors } = props;
  const typeDoc = typeDocs.children.find(
    (child: any) => child.name === componentName
  );
  if (!typeDoc) return <ErrorGroup name={componentName} />;

  return (
    <>
      <Summary typeDoc={typeDoc} />
      <Parameters typeDoc={typeDoc} typeDocs={typeDocs} />
      <Returns typeDoc={typeDoc} />
      <ExampleUsage typeDoc={typeDoc} scope={codeScope} preview={codePreview} showErrors={codeErrors} />
    </>
  );
};
