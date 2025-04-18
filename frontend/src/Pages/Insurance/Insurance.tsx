// import React from 'react'
import Navbar from '../../components/Navbar'
import Container from '../../components/Container/Container'
import Footer from '../../components/Footer'
import HeroSection from '../../components/Insurance/hero-section';
import FAQ from '../../components/Insurance/faq';
import FeatureSection from '../../components/Insurance/features';

  
  const faqData = [
    {
      question: "How do I know which insurance policy is right for me?",
      answer:
        "The right insurance policy depends on your specific needs, budget, and circumstances. Our comparison tool helps you evaluate different options based on coverage, price, and features. You can also speak with our insurance advisors for personalized recommendations.",
    },
    {
      question: "Can I bundle different types of insurance policies?",
      answer:
        "Yes, most insurance providers offer multi-policy discounts when you bundle different types of insurance, such as auto and home insurance. Bundling can save you up to 25% on your premiums and simplify your insurance management with a single provider.",
    },
    {
      question: "How quickly can I get coverage after applying?",
      answer:
        "Many insurance providers offer immediate coverage once your application is approved and payment is processed. For auto insurance, you can typically get proof of insurance within minutes. Home insurance may take 24-48 hours to process, while health insurance often has specific enrollment periods.",
    },
    {
      question: "What factors affect my insurance premium?",
      answer:
        "Insurance premiums are calculated based on various risk factors. For auto insurance, these include your driving record, age, vehicle type, and location. Home insurance considers your home's value, location, and construction. Health insurance premiums depend on age, location, plan type, and sometimes tobacco use.",
    },
    {
      question: "How do I file a claim with my insurance provider?",
      answer:
        "Most insurance providers offer multiple ways to file a claim: through their mobile app, website, or by calling their claims hotline. You'll need to provide details about the incident, documentation (like photos or police reports), and your policy information. Many providers now offer 24/7 claims service.",
    },
    {
      question: "What is a deductible and how does it work?",
      answer:
        "A deductible is the amount you pay out of pocket before your insurance coverage kicks in. For example, if you have a $500 deductible and file a claim for $2,000 in damages, you'll pay $500 and your insurance will cover the remaining $1,500. Generally, choosing a higher deductible results in lower premium payments.",
    },
  ]

function Insurance() {
  return (
    <div>
        <Navbar />
        <Container>
            <HeroSection />
            <FeatureSection/>
            <FAQ faqs={faqData} />
        </Container>
        <Footer />
    </div>
  )
}

export default Insurance