import { TRoute } from './Types'
import AnalysisOverview from './modules/Analysis/AnalysisOverview'
import AnalysisView from './modules/Analysis/AnalysisView'
import AnalysisCreate from './modules/Analysis/AnalysisCreate'
import { View } from './modules/View'

const Routes: Array<TRoute> = [
  {
    path: '',
    heading: 'Analysis',
    content: AnalysisOverview,
  },
  {
    path: '/analysis/new',
    heading: 'Create new Analysis',
    content: AnalysisCreate,
  },
  {
    path: '/analysis/:data_source/:entity_id',
    heading: 'Analysis details',
    content: AnalysisView,
  },
  {
    path: '/view/:data_source/:entity_id',
    heading: 'View',
    content: View,
  },
]

export default Routes
