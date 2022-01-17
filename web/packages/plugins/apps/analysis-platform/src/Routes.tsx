// Temporary basic routes while developing UI
import { TRoute } from './Types'
import Dashboard from './Pages/Dashboard'
import Library from './components/Library'
import OperationView from './Pages/OperationView'
import OperationOverview from './Pages/OperationOverview'
import OperationCreate from './Pages/OperationCreate'

const Routes: Array<TRoute> = [
  { path: '', heading: 'Dashboard', content: Dashboard },
  {
    path: '/library',
    heading: 'Library',
    content: Library,
  },
  {
    path: '/operations/:data_source/:entity_id',
    heading: 'Operation details',
    content: OperationView,
  },
  {
    path: '/operations/new',
    heading: 'Create new operation',
    content: OperationCreate,
  },
  {
    path: '/operations',
    heading: 'Operations',
    content: OperationOverview,
  },
]

export default Routes
