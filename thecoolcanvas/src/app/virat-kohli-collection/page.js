import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Virat Kohli Collection | The Cool Canvas",
  description: "Exclusive Virat Kohli limited edition streetwear and custom tees.",
};

export default function ViratKohliCollectionPage() {
  const viratProducts = products.filter(p => p.slug.includes("virat-kohli"));

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl font-extrabold text-black uppercase tracking-tighter sm:text-5xl">
              Virat Kohli Collection
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              Represent the King. Limited edition graphics on our signature heavy-weight oversized fit.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {viratProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-y-8 gap-x-3 sm:gap-y-10 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {viratProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn delay={0.2}>
            <div className="text-center py-20 text-gray-500">
              No products found in this collection right now.
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
