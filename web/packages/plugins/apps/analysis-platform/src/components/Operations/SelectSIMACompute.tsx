import React, { useState } from 'react'
import { Button } from '@equinor/eds-core-react'
import { Heading } from '../Design/Fonts'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: min-content;
  max-width: 400px;
`

const SelectSIMACompute = (props: {
  setSIMAComputeConfig: Function
  setError: Function
}): JSX.Element => {
  const [fileName, setFileName] = useState<string>()
  const { setSIMAComputeConfig, setError } = props

  return (
    <Wrapper>
      <Heading text="SIMA Compute" variant="h4" />
      <div>
        <label htmlFor="SIMAComputeUpload">
          <Button as="span" variant="outlined">
            Upload SIMA Compute
          </Button>
        </label>
        <div>
          Selected: <i>{fileName || 'None...'}</i>
        </div>
      </div>
      <div>
        <input
          type="file"
          id="SIMAComputeUpload"
          style={{ display: 'none' }}
          accept=".yml,.yaml"
          onChange={(event: any) => {
            setError('')
            if (event.target.files.length >= 1) {
              const file = event.target.files[0]
              const fileEnding = file.name.split('.')[
                file.name.split('.').length - 1
              ]
              setFileName(file.name)
              if (
                fileEnding.toLowerCase() === 'yaml' ||
                fileEnding.toLowerCase() === 'yml'
              ) {
                setSIMAComputeConfig(file)
              } else {
                setError(
                  'Selected SIMA Compute file is not in the required format (YAML).'
                )
              }
            }
          }}
        />
      </div>
    </Wrapper>
  )
}

export default SelectSIMACompute
