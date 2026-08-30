import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Premium Collection | The Cool Canvas",
  description: "Exclusive, high-end premium oversized t-shirts and streetwear.",
};

export default function PremiumCollectionPage() {
  // Filter out the Virat Kohli product to make the "Premium" collection distinct
  const premiumProducts = products.filter(p => !p.slug.includes("virat-kohli"));

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl font-extrabold text-black uppercase tracking-tighter sm:text-5xl">
              Premium Collection
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              Our most exclusive designs, crafted with ultra-premium fabrics for an unmatched oversized fit.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-8 gap-x-3 sm:gap-y-10 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {premiumProducts.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.1}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
