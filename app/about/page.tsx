import { BackgroundPatterns } from "@/components/shared/background-patterns";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { UserRound, Linkedin } from "lucide-react";

export default function AboutPage() {
  return (
    // FIXED → min-h-screen so page can stretch + padding to avoid footer overlap
    <div className="relative min-h-screen pb-40">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />

        {/* Banner */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-[100px] sm:mt-[120px] lg:mt-[150px] relative z-10">
          <img
            src="/About.png"
            alt="About Us Banner"
            className="h-[250px] sm:h-[350px] lg:h-[500px] w-full object-cover rounded-lg mt-[50px] sm:mt-[60px] lg:mt-[70px]"
          />

          {/* Story & Mission */}
          <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 sm:px-6 lg:px-[50px] justify-between">
            <div className="flex-1 glass-card p-4 sm:p-5 lg:p-6 rounded-xl">
              <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-[#004AAD] mb-2 sm:mb-3">Our Story</h1>
              <p className="text-[#333333] text-sm sm:text-base text-medium text-justify leading-relaxed">
                Genius Technology was founded in 2005 by a team from Rajasthan, driven by a passion to innovate and create meaningful solutions. Our journey began with manufacturing mobile adaptors in a small factory in Vishwas Nagar, Delhi. After two years of hard work, we opened our first office in Gaffar Market, Delhi — marking our entry into India's mobile accessory market.<br /><br />
                Today, Genius Technology offers over 800 high-quality products including mobile screen folders, accessories, and our flagship long-lasting batteries. From humble beginnings to a trusted brand, our story reflects dedication, innovation, and excellence.
              </p>
            </div>
            <div className="flex-1 glass-card p-4 sm:p-5 lg:p-6 rounded-xl">
              <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-[#004AAD] mb-2 sm:mb-3">Our Mission</h1>
              <p className="text-[#333333] text-sm sm:text-base text-medium text-justify leading-relaxed">
                To make quality technology accessible to everyone through innovative products and exceptional service. We aim to bridge the gap between cutting-edge innovation and everyday usability, delivering products that not only perform but inspire.<br /><br />
                We focus on simplifying life, sparking creativity, and elevating digital experiences. At Genius Technology, we don't just build tech—we build trust, convenience, and a smarter future.
              </p>
            </div>
          </div>

          {/* Research & Development */}
          <div className="mt-10 sm:mt-12 lg:mt-14 px-4 sm:px-6 lg:px-[50px]">
            <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold mb-4 sm:mb-6">Research & Development</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🔬 Product Innovation</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">We continuously study market trends and consumer needs to develop next-generation mobile accessories — improving battery performance, designing more durable screen folders, and high-speed charging solutions.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">⚙️ Quality Testing</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Every product undergoes rigorous testing for performance, safety, and durability. Our in-house team ensures every item meets the high-quality standards our customers expect.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">📊 User Feedback Integration</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">We actively collect feedback from distributors, retailers, and customers to improve existing products and inspire new ideas.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🔋 Battery Efficiency & Safety</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">Our flagship batteries are optimized for chemistry, thermal stability, and lifespan, ensuring safe and long-lasting options for all devices.</p>
              </Card>
              <Card className="p-4 sm:p-5 lg:p-6 border border-[#004AAD] glass-card hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
                <h2 className="font-semibold text-base sm:text-lg mb-2">🌍 Sustainability Research</h2>
                <p className="text-justify text-sm sm:text-base leading-relaxed">We explore eco-friendly materials, low-waste packaging, and sustainable manufacturing practices to reduce environmental impact.</p>
              </Card>
            </div>
          </div>

          {/* ... rest of your content EXACTLY SAME ... */}

        </section>
      </div>
    </div>
  );
}
