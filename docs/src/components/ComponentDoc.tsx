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
  componentType?: string
  codeScope?: any
  codePreview?: boolean
  codeErrors?: boolean
};

export const ComponentDoc = (props: ComponentDocProps) => {
  const { componentName, componentType, codeScope, codePreview, codeErrors } = props;
  let parametersTitle = 'Parameters'
  if (componentType === 'Components') parametersTitle = 'Props'
  else if (componentType === 'Enums') parametersTitle = 'Members'
  else if (componentType === 'Types') parametersTitle = 'Attributes'
  const typeDoc = typeDocs.children.find(
    (child: any) => child.name === componentName
  );
  if (!typeDoc) return <ErrorGroup name={componentName} />;

  return (
    <>
      <Summary typeDoc={typeDoc} />
      <Parameters title={parametersTitle} typeDoc={typeDoc} typeDocs={typeDocs} />
      <Returns typeDoc={typeDoc} />
      <ExampleUsage typeDoc={typeDoc} scope={codeScope} preview={codePreview} showErrors={codeErrors} />
    </>
  );
};
