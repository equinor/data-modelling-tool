import React, { useEffect, useState } from "react";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import github from 'prism-react-renderer/themes/github';
import dracula from 'prism-react-renderer/themes/dracula';
import { useColorMode } from '@docusaurus/theme-common';

import { ErrorGroup } from './ErrorGroup'
import { findBlockByTag } from "../utils";

type ExampleUsageProps  = {
  typeDoc: any
  scope?: any
  preview?: boolean
  showErrors?: boolean
};

export const ExampleUsage = (props: ExampleUsageProps) => {
  const { typeDoc, scope, preview, showErrors } = props
  const { colorMode } = useColorMode()
  const [codeBlockTheme, setCodeBlockTheme] = useState<any>()
  const title: JSX.Element = <h2>Usage</h2>

  const errorGroup = <ErrorGroup name={typeDoc.name} />

  useEffect(() => {
    if (!colorMode) return
    setCodeBlockTheme(colorMode === 'light' ? github : dracula)
  }, [colorMode])

  // Find the "@usage" block, if present
  const usageBlock = findBlockByTag('@usage', typeDoc)
  if (!usageBlock || usageBlock.content?.length < 0) {
    return (
      <>
        {title}
        <p>Not usage example is available.</p>
      </>
    )
  }

  const exampleCodeDescription = usageBlock.content.find(
    (content: any) => content.kind === "text"
  )?.text;
  // Extract the unformatted code block from the @usage block
  const exampleCodeRaw = usageBlock.content.find(
    (content: any) => content.kind === "code"
  )?.text;
  if (!exampleCodeRaw) return errorGroup
  const exampleCode = exampleCodeRaw
    .replaceAll(/(^```|```$)/g, '') // replace prefix/suffix ticks
    .trim(); // remove leading whitespace

  return (
    <>
      {title}
      {exampleCodeDescription && <p>{exampleCodeDescription}</p>}
      <LiveProvider
        code={exampleCode}
        scope={scope}
        disabled={false}
        theme={codeBlockTheme}
        noInline={false}
      >
        <LiveEditor />
        {showErrors && <LiveError />}
        {preview && (
          <>
            <h4>Preview:</h4>
            <LivePreview />
          </>
        )}
      </LiveProvider>
    </>
  );
};
