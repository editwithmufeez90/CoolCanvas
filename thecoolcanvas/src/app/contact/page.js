import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Contact Us | The Cool Canvas",
  description: "Get in touch with The Cool Canvas for custom streetwear orders and support.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl font-extrabold text-black uppercase tracking-tighter sm:text-5xl">
              Contact Us
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              Got a question about an order or want to customize your own drip? Drop us a message.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn direction="up" delay={0.2}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 sm:p-12">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hit us up on WhatsApp</h2>
                <p className="text-gray-600">The fastest way to reach our support team or start a custom order.</p>
                <a 
                  href="https://wa.me/919004049682" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 inline-block bg-black text-white px-8 py-4 rounded-md font-bold text-base hover:bg-gray-800 transition-colors uppercase tracking-widest shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  Chat on WhatsApp
                </a>
              </div>

              <div className="relative mb-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 uppercase tracking-widest font-semibold">Or Email Us</span>
                </div>
              </div>

              <form action="mailto:coolcanvaswear@gmail.com" method="POST" encType="text/plain" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="Name" 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors" 
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="Email" 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors" 
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    id="message"
                    name="Message" 
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors" 
                    placeholder="How can we help?"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-black transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
