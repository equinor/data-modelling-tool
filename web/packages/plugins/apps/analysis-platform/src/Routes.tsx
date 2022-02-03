import { TRoute } from './Types'
import AnalysisOverview from './modules/Analysis/AnalysisOverview'
import AnalysisView from './modules/Analysis/AnalysisView'
import AnalysisNew from "./modules/Analysis/AnalysisNew";

const Routes: Array<TRoute> = [
  {
    path: '',
    heading: 'Analysis',
    content: AnalysisOverview,
  },
    {
    path: '/new-analysis',
    heading: 'Create new Analysis',
    content: AnalysisNew,
  },
  {
    path: '/:data_source/:entity_id',
    heading: 'Analysis details',
    content: AnalysisView,
  },
]

export default Routes
