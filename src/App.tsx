import './App.css'
import { 
  BrowserRouter, 
  Navigate, 
  Route, 
  Routes, 
  useNavigate
} from 'react-router-dom'
import GlobalStyles from './styles/global'
import { useGlobalContext } from './context/global'

//Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProtectedRoutes from './components/ProtectRoutes'
import ChooseCln from './pages/ChooseCleaner'
import ProtectedRoute from './components/protectedRoute'

function App() {
  const { global } = useGlobalContext()

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route element={ <ProtectedRoutes global={ global } /> }>
          <Route path='' element={ <Dashboard /> } />
        </Route>
        <Route path='choose_cleaner' element={ 
          <ProtectedRoute token={ global.token }>
            <ChooseCln /> 
          </ProtectedRoute>
        }/>
        <Route path='login' element={ <Login /> } />
        <Route path='*' element={ <NotFound /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
