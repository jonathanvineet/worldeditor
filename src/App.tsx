import MenuBar from './components/MenuBar'
import Toolbar from './components/Toolbar'
import LeftSidebar from './components/LeftSidebar'
import Viewport from './components/Viewport'
import RightSidebar from './components/RightSidebar'
import BottomDock from './components/BottomDock'
import StatusBar from './components/StatusBar'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <MenuBar />
      <Toolbar />
      <div className="app-body">
        <LeftSidebar />
        <div className="app-center">
          <Viewport />
          <BottomDock />
        </div>
        <RightSidebar />
      </div>
      <StatusBar />
    </div>
  )
}
