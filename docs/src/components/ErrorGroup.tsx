import React from "react";
import Admonition from "@theme/Admonition";

export const ErrorGroup = (props: { name: string }) => (
  <>
    <Admonition type="danger">
      Unable to extract component '{props.name}'
    </Admonition>
  </>
)
