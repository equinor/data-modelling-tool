import { TRoute } from './Types'
import AnalysisOverview from './modules/Analysis/AnalysisOverview'
import AnalysisView from './modules/Analysis/AnalysisView'
import AnalysisCreate from './modules/Analysis/AnalysisCreate'
import { View } from './modules/View'

const Routes: Array<TRoute> = [
  {
    path: '',
    heading: 'Analysis',
    //@ts-ignore
    content: AnalysisOverview,
  },
  {
    path: '/analysis/new',
    heading: 'Create new Analysis',
    //@ts-ignore
    content: AnalysisCreate,
  },
  {
    path: '/analysis/:data_source/:entity_id',
    heading: 'Analysis details',
    //@ts-ignore
    content: AnalysisView,
  },
  {
    path: '/view/:data_source/:entity_id',
    heading: 'View',
    //@ts-ignore
    content: View,
  },
]

export default Routes
