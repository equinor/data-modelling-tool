import React, { ChangeEvent, useContext } from 'react'
import DmssAPI from '../../services/api/DmssAPI'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useSearch } from '../../hooks/useSearch'
import { Select } from '../Select'

export const JobHandlerPicker = (props: {
  onChange: (data: string) => void
  formData: string
}) => {
  const { onChange, formData } = props
  const blueprintName = formData.split('/').pop()
  const { token } = useContext(AuthContext)
  const dmssApi = new DmssAPI(token)
  const [searchResult] = useSearch<any>(
    {
      type: 'system/SIMOS/Blueprint',
      extends: ['WorkflowDS/Blueprints/jobHandlers/JobHandler'],
    },
    'WorkflowDS'
  )

  const handleChange = (blueprintId: string) => {
    dmssApi
      .blueprintResolve({
        absoluteId: `WorkflowDS/${blueprintId}`,
      })
      .then((response: any) => {
        onChange(response.data)
      })
      .catch((error: any) => console.error(error))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Select
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          return handleChange(searchResult[parseInt(e.target.value)]._id)
        }}
        value={searchResult.findIndex(
          (resultEntry: any) => resultEntry.name === blueprintName
        )}
      >
        <option value={-1} selected disabled hidden>
          Choose runner...
        </option>
        {searchResult.map((resultEntry: any, index: number) => (
          <option key={index} value={index}>
            {resultEntry.name}
          </option>
        ))}
      </Select>
    </div>
  )
}
