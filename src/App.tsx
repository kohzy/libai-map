import AppShell from '@/components/AppShell/AppShell'
import { useJourney } from '@/journey/useJourney'

function App() {
  const [state, dispatch] = useJourney()
  return <AppShell state={state} dispatch={dispatch} />
}

export default App
