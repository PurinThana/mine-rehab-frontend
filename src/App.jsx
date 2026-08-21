import { useCallback, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import StatsOverview from './components/StatsOverview.jsx'
import InfoStrip from './components/InfoStrip.jsx'
import BenchSummary from './components/BenchSummary.jsx'
import FlowerTypes from './components/FlowerTypes.jsx'
import RecentActivities from './components/RecentActivities.jsx'
import NewsDownloads from './components/NewsDownloads.jsx'
import Footer from './components/Footer.jsx'
import LoginModal from './components/LoginModal.jsx'
import SessionExpiredNotice from './components/SessionExpiredNotice.jsx'
import AdminApp from './admin/AdminApp.jsx'
import ActivitiesPage from './pages/ActivitiesPage.jsx'
import ActivityDetailPage from './pages/ActivityDetailPage.jsx'
import NewsPage from './pages/NewsPage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import { SiteDataProvider } from './context/SiteDataContext.jsx'

export default function App() {
  // กล่อง login อยู่ระดับนี้เพราะทั้ง Navbar, แจ้งเตือน session หมดอายุ และ
  // ด่านตรวจสิทธิ์ของหน้าแอดมิน ต้องเปิดมันได้เหมือนกัน
  const [loginOpen, setLoginOpen] = useState(false)
  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  const { segments, navigate } = useHashRoute()
  const isAdminRoute = segments[0] === 'admin'

  if (isAdminRoute) {
    return (
      <>
        <AdminApp
          section={segments[1]}
          onNavigate={(key) => navigate(`/admin/${key}`)}
          onExit={() => navigate('/')}
          onLoginClick={openLogin}
        />
        <LoginModal open={loginOpen} onClose={closeLogin} />
      </>
    )
  }

  // หน้าย่อยใช้ Navbar/Footer ร่วมกับหน้าหลัก แต่ไม่ต้องใช้ SiteDataProvider
  // เพราะดึงข้อมูลของตัวเองอยู่แล้ว
  //
  // "#/activities"    -> รายการกิจกรรมทั้งหมด
  // "#/activities/7"  -> รายละเอียดกิจกรรม id 7 (เปิดลิงก์ตรง/refresh ได้)
  if (segments[0] === 'activities') {
    const activityId = segments[1]
    return (
      <div className="min-h-screen bg-sand-50">
        <Navbar onLoginClick={openLogin} onAdminClick={() => navigate('/admin')} />
        {activityId ? (
          <ActivityDetailPage
            activityId={activityId}
            onBack={() => navigate('/activities')}
          />
        ) : (
          <ActivitiesPage
            onExit={() => navigate('/')}
            onOpenActivity={(id) => navigate(`/activities/${id}`)}
          />
        )}
        <Footer />

        <LoginModal open={loginOpen} onClose={closeLogin} />
        <SessionExpiredNotice onLoginClick={openLogin} />
      </div>
    )
  }

  // "#/news" -> รายการข่าวทั้งหมด, "#/news/3" -> รายละเอียดข่าว
  if (segments[0] === 'news') {
    const postId = segments[1]
    return (
      <div className="min-h-screen bg-sand-50">
        <Navbar onLoginClick={openLogin} onAdminClick={() => navigate('/admin')} />
        {postId ? (
          <NewsDetailPage postId={postId} onBack={() => navigate('/news')} />
        ) : (
          <NewsPage onExit={() => navigate('/')} onOpenPost={(id) => navigate(`/news/${id}`)} />
        )}
        <Footer />

        <LoginModal open={loginOpen} onClose={closeLogin} />
        <SessionExpiredNotice onLoginClick={openLogin} />
      </div>
    )
  }

  return (
    // SiteDataProvider โหลดข้อมูลไซต์ชุดเดียวให้ทุก section ใช้ร่วมกัน
    // (Hero, StatsOverview, InfoStrip, BenchSummary, FlowerTypes)
    <SiteDataProvider>
      <div className="min-h-screen bg-sand-50">
        <Navbar onLoginClick={openLogin} onAdminClick={() => navigate('/admin')} />
        <main>
          <Hero />
          <StatsOverview />
          <InfoStrip />
          <BenchSummary />
          <FlowerTypes />
          <RecentActivities
            onViewAll={() => navigate('/activities')}
            onOpenActivity={(id) => navigate(`/activities/${id}`)}
          />
          <NewsDownloads
            onViewAllNews={() => navigate('/news')}
            onOpenPost={(id) => navigate(`/news/${id}`)}
          />
        </main>
        <Footer />

        <LoginModal open={loginOpen} onClose={closeLogin} />
        <SessionExpiredNotice onLoginClick={openLogin} />
      </div>
    </SiteDataProvider>
  )
}
