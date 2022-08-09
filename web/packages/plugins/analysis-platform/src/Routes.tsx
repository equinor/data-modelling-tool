import { TRoute } from '@dmt/common'
import { AssetOverview } from './modules/Asset'
import { AnalysisCreate } from './modules/Analysis'
import { View } from './modules'

const Routes: Array<TRoute> = [
  {
    path: '',
    //@ts-ignore
    content: AssetOverview,
  },
  {
    path: '/analysis/new',
    //@ts-ignore
    content: AnalysisCreate,
  },
  {
    path: '/analysis/:data_source/:entity_id',
    //@ts-ignore
    content: View,
  },
  {
    path: '/view/:data_source/:entity_id',
    //@ts-ignore
    content: View,
  },
]

export default Routes
