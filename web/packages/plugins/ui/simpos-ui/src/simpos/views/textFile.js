import styled from 'styled-components'

const Pre = styled.pre`
  white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */
  white-space: -pre-wrap; /* Opera */
  white-space: -o-pre-wrap; /* Opera */
  white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
  word-wrap: break-word; /* IE 5.5+ */
`

function raw_view({ updateEntity, document, children }) {
  //document is of type SimpleString or similar, like TextFile

  return (
    <div>
      Description : {document.description}
      <Pre>{document.value}</Pre>
    </div>
  )
}

export { raw_view as simpos_text_file_view }
