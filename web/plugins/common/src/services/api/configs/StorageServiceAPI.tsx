import { Configuration, DefaultApi } from './gen'
import axios from 'axios'

const DMSSConfiguration = new Configuration({ basePath: '/dmss' })

export const dmssApi = new DefaultApi(DMSSConfiguration)
