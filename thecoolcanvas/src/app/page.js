import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlider } from "@/components/HeroSlider";
import { VideoSlider } from "@/components/VideoSlider";
import { GallerySlider } from "@/components/GallerySlider";
import { FAQ } from "@/components/FAQ";
import { FadeIn } from "@/components/FadeIn";

export default function Home() {
  const newProduct = products.find(p => p.id === "p10");

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Newly Added Section */}
      {newProduct && (
        <div className="bg-gray-50 border-b border-gray-200 overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 lg:gap-16">
            <FadeIn direction="right" className="w-full max-w-sm mx-auto md:w-1/2 relative rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100 group">
              <a href={`/product/${newProduct.slug}`}>
                <img src={newProduct.image} alt={newProduct.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
              </a>
            </FadeIn>
            <FadeIn direction="left" className="w-full md:w-1/2 space-y-6 flex flex-col items-center text-center md:items-start md:text-left">
              <div className="inline-block bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">New Drop</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter uppercase leading-tight">
                {newProduct.title}
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                {newProduct.description}
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-4 pt-2 pb-4">
                <span className="text-3xl font-black text-black">Rs. {newProduct.salePrice}</span>
                {newProduct.originalPrice && (
                  <span className="text-xl font-medium text-gray-400 line-through">Rs. {newProduct.originalPrice}</span>
                )}
              </div>
              <a 
                href={`/product/${newProduct.slug}`} 
                className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold text-base hover:bg-gray-800 transition-all duration-300 uppercase tracking-widest shadow-xl hover:shadow-2xl hover:-translate-y-1 text-center w-full sm:w-auto"
              >
                Shop Now
              </a>
            </FadeIn>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div id="shop" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tighter mb-8">
            Featured Drops
          </h2>
        </FadeIn>
        
        <div className="grid grid-cols-2 gap-y-8 gap-x-3 sm:gap-y-10 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.1}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Top Influencers Pick */}
      <div className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
           <FadeIn>
             <h2 className="text-3xl font-extrabold text-black tracking-tighter mb-10 text-center">
               Top Influencers Pick
             </h2>
           </FadeIn>
           <FadeIn delay={0.2}>
             <VideoSlider />
           </FadeIn>
        </div>
      </div>
      
      {/* Style Gallery Carousel */}
      <FadeIn direction="none" delay={0.1}>
        <GallerySlider />
      </FadeIn>

      {/* Customization Portal */}
      <div className="bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <FadeIn direction="right" className="flex-1 space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tighter">
              Create Your Own Drip
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Got a design in mind? We customize oversized hoodies and t-shirts to your exact specifications. High-quality print, premium fabrics, built for the streets.
            </p>
            <a 
              href="https://wa.me/919004049682" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold text-base hover:bg-gray-800 transition-colors uppercase tracking-widest shadow-lg hover:shadow-xl"
            >
              Contact on WhatsApp
            </a>
          </FadeIn>
          <FadeIn direction="left" className="flex-1 w-full relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100">
             <img src="/images/banner.webp" alt="Customization" className="absolute inset-0 w-full h-full object-cover" />
          </FadeIn>
        </div>
      </div>

      {/* FAQ Section */}
      <FadeIn>
        <FAQ />
      </FadeIn>
    </div>
  );
}
