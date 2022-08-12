import React from 'react'
import { DatePicker, Space } from 'antd'
import { Label } from '@equinor/eds-core-react'

const { RangePicker } = DatePicker

const DateRangePicker = (props: {
  setDateRange: (dateRange: [Date, Date]) => void
  value: any
}): JSX.Element => {
  const { setDateRange, value } = props
  // onChange returns (date: Moment[], dateString: string[]) with start at [0] and end at [1]
  const START_INDEX: number = 0
  const END_INDEX: number = 1
  return (
    <div>
      <Label label="Specify date range" />
      <Space direction="vertical" size={12}>
        <RangePicker
          defaultValue={value}
          //@ts-ignore
          onChange={(dates: any[]) => {
            if (dates) {
              setDateRange([
                dates[START_INDEX].toDate(),
                dates[END_INDEX].toDate(),
              ])
            }
          }}
        />
      </Space>
    </div>
  )
}

export default DateRangePicker
