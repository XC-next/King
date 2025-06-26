import React from 'react'
import { Helmet } from 'react-helmet-async'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategoryGrid from '@/components/home/CategoryGrid'
import NewsletterSection from '@/components/home/NewsletterSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>KING Store - Premium E-commerce Platform</title>
        <meta name="description" content="Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more at KING Store." />
        <meta name="keywords" content="ecommerce, shopping, electronics, fashion, home goods, deals" />
      </Helmet>

      <div className="space-y-16">
        <HeroSection />
        <FeaturedProducts />
        <CategoryGrid />
        <TestimonialsSection />
        <NewsletterSection />
      </div>
    </>
  )
}

export default Home