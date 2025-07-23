import HeroSection from '@/components/home/hero-section'
import UserInfoSection from '@/components/home/user-info-section'
import VillageListSection from '@/components/home/village-list-section'
import AnnouncementSection from '@/components/home/announcement-section'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <UserInfoSection />
      <VillageListSection />
      <AnnouncementSection />
    </main>
  )
}
