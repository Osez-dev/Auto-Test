import GetQuoteButton from "./get-quote-button";
import Img from "../../assets/images/insurance.jpg"

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#f0f4f7] py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-[#1e50a0]/20 bg-[#1e50a0]/10 px-3 py-1 text-sm font-medium text-[#1e50a0]">
                <span>AUTO STREAM Exclusive Offer!</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1e50a0]">
                Compare Car Insurance Quotes for New Cars, Pre-Owned Cars and More
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Get the best deals and save when you choose our trusted car insurance partners.
              </p>
              <div className="pt-4">
                <GetQuoteButton />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={Img}
              width={500}
              height={600}
              alt="Car Insurance Illustration"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}