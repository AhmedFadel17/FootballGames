import { Outlet } from 'react-router-dom'
import TopNavBar from './TopNavBar'
import Footer from './Footer'


export default function MainLayout() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30">
      <TopNavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
