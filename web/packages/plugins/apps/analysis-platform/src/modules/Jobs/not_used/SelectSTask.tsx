import React, { useState } from 'react'
import { Button } from '@equinor/eds-core-react'
import { Heading } from '../../../components/Design/Fonts'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: min-content;
`

const SelectSTask = (props: { setSTask: Function }): JSX.Element => {
  const [staskFileName, setStaskFileName] = useState<string>()
  const { setSTask } = props

  return (
    <Wrapper>
      <Heading text="SIMA STask" variant="h4" />
      <input
        type="file"
        id="staskUpload"
        style={{ display: 'none' }}
        accept=".stask"
        onChange={(event: any) => {
          const file: File = event.target.files[0]
          setSTask(file)
          setStaskFileName(file.name)
        }}
      />

      <label htmlFor="staskUpload">
        <Button as="span" variant="outlined">
          Upload STask
        </Button>
      </label>

      <div>
        Selected: <i>{staskFileName || 'None...'}</i>
      </div>
    </Wrapper>
  )
}

export default SelectSTask
