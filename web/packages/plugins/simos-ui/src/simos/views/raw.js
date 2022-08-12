import styled from 'styled-components'

import { translate_entity_dmt_to_simos } from '../tools/translate.js'

const Pre = styled.pre`
  white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */
  white-space: -pre-wrap; /* Opera */
  white-space: -o-pre-wrap; /* Opera */
  white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
  word-wrap: break-word; /* IE 5.5+ */
`

function raw_view({ document }) {
  return (
    <div>
      <Pre>
        {JSON.stringify(translate_entity_dmt_to_simos(document), null, 2)}
      </Pre>
    </div>
  )
}

export { raw_view as SIMOSRawView }
