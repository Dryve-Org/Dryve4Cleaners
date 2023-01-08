import './App.css'
import { 
  BrowserRouter, 
  Navigate, 
  Route, 
  Routes, 
} from 'react-router-dom'
import GlobalStyles from './styles/global'
import { useGlobalContext } from './context/global'

//Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import TokenAndCln from './components/TokenAndCln'
import ChooseCln from './pages/ChooseCleaner'
import TokenReq from './components/TokenRequired'
import MainHeader from './components/TopHeader/MainHeader'
import GlobalLoading from './components/container/loading'
import { useEffect } from 'react'

function App() {
  const { global } = useGlobalContext()
  
  if(global.loading) return <GlobalLoading />

  return (
    <BrowserRouter>
      <GlobalStyles />
      {global.token && <MainHeader />}
      <Routes>
        <Route element={ <TokenAndCln global={ global } /> }>
          <Route path='dashboard' element={ <Dashboard /> } >
            <Route path=':orderId' element={ <Dashboard /> }>

            </Route>
          </Route>
        </Route>
        <Route element={ <TokenReq global={ global }/> }>
          <Route path='choose_cleaner' element={ 
            <ChooseCln 
              token={ global.token } 
            /> 
          }
        />
        </Route>    
        <Route path='login' element={ <Login /> } />
        <Route path='*' element={ <NotFound /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
