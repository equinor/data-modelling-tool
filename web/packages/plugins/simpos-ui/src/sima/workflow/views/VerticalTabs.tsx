import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface ITabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export interface ITabProp {
  label: string
  content: React.ReactNode
}

function TabPanel(props: ITabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

function VerticalTabs({ tabProps }: any) {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  // var tabs = [];
  // tabs.push({'label': "Item 1", 'content':"Item One"},
  //           {'label': "Item 2", 'content':"Item two"},
  //           {'label': "Item 3", 'content':"Item three"},
  //           {'label': "Item 4", 'content':"Item four"},
  //           {'label': "Item 5", 'content':"Item five"});

  console.log(tabProps)

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: 1024,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Workflow Task View"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {tabProps.map((item: any, index: number) => (
          <Tab label={item.label} {...a11yProps(index)} />
        ))}
      </Tabs>
      {tabProps.map((item: any, index: number) => (
        <TabPanel value={value} index={index}>
          {item.content}
        </TabPanel>
      ))}
    </Box>
  )
}

export { VerticalTabs }
