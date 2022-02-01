// Temporary basic routes while developing UI
import {TRoute} from './Types'
import AnalysisOverview from './modules/Analysis/AnalysisOverview'
import AnalysisView from './modules/Analysis/AnalysisView'

const Routes: Array<TRoute> = [
    {
        path: '',
        heading: 'Analysis',
        content: AnalysisOverview,
    },
    {
        path: '/:data_source/:entity_id',
        heading: 'Analysis details',
        content: AnalysisView,
    },
]

export default Routes