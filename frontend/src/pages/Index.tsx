import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import VirtualTryOnBanner from '@/components/home/VirtualTryOnBanner';
import NewsletterSection from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <VirtualTryOnBanner />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
