import { TRoute } from './Types'
import AnalysisOverview from './modules/Analysis/AnalysisOverview'
import AnalysisCreate from './modules/Analysis/AnalysisCreate'
import { View } from './modules/View'

const Routes: Array<TRoute> = [
  {
    path: '',
    //@ts-ignore
    content: AnalysisOverview,
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
