import PublicLayout from '../components/PublicLayout'
import Hero from '../components/Hero'
import Features from '../components/Features'
import WhyM2T from '../components/WhyMotoTrack'
import Preview from '../components/Preview'
import CTA from '../components/CTA'

export default function Landing() {
  return (
    <PublicLayout>
      <Hero />
      <Features />
      <WhyM2T />
      <Preview />
      <CTA />
    </PublicLayout>
  )
}
