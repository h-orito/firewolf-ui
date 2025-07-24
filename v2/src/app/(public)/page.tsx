import HeroSection from '@/components/pages/home/hero-section'
import UserInfoSection from '@/components/pages/home/user-info-section'
import ParticipatingVillagesSection from '@/components/pages/home/participating-villages-section'
import VillageListSection from '@/components/pages/home/village-list-section'
import AnnouncementSection from '@/components/pages/home/announcement-section'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <UserInfoSection />
      <ParticipatingVillagesSection />
      <VillageListSection />
      <AnnouncementSection />
    </main>
  )
}
