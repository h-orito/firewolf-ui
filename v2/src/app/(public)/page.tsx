import HeroSection from '@/components/pages/home/HeroSection'
import UserInfoSection from '@/components/pages/home/UserInfoSection'
import ParticipatingVillagesSection from '@/components/pages/home/ParticipatingVillagesSection'
import VillageListSection from '@/components/pages/home/VillageListSection'
import AnnouncementSection from '@/components/pages/home/AnnouncementSection'

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
