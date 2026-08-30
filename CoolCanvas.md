## **1\. Product Requirements Document (PRD)**

**Product Name:** The Cool Canvas (Custom Next.js Build) **Core Objective:** An ultra-fast e-commerce storefront that replicates the existing Shopify design but utilizes a "Cart-to-WhatsApp" checkout flow.  
**Core Features:**

> * **Static Product Catalog:** Products are categorized (Virat Kohli, Anime, Gym, Custom) with crossed-out pricing, sale percentages, and size selectors.  
> * **AJAX Cart Drawer:** A slide-out cart allowing users to review items, adjust quantities, and see the total price without leaving the page.  
> * **The WhatsApp Checkout Flow:**  
  * Instead of a payment gateway, the checkout page asks for: Full Name, Phone, Email, Delivery Address, and Pincode.  
  * The primary Call-to-Action (CTA) is a bold **"Place Order on WhatsApp"** button.  
> * **Automated Order Formatting:** Clicking the CTA compiles the cart and user details into a neatly formatted text block and opens the user's WhatsApp app, pre-filled and ready to send to your business number.  
> * **Email Redundancy:** A background process emails the exact order details to admin@thecoolcanvas.in the moment the user clicks the WhatsApp button.  
> * **Customization Portal:** A dedicated section showcasing a "Before & After" interactive slider, linking directly to WhatsApp for bulk or custom design inquiries.

## **2\. Technical Requirements Document (TRD)**

**Tech Stack:**

> * **Frontend Framework:** Next.js (React).  
> * **Styling:** Tailwind CSS (for rapid, responsive UI development matching the streetwear vibe).  
> * **State Management:** React Context API or Zustand (paired with localStorage to preserve cart data on page refresh).  
> * **Backend/Email:** Next.js API Routes \+ Resend (or EmailJS) for free email dispatch.  
> * **Hosting:** Vercel (Lifetime free tier).  
> * **Database:** None. Managed via a local array in the codebase (data/products.js).

**Data Architecture (The Code-Based Database):** All products will be stored in a single file (data/products.js). To add or edit a product, you modify this file and push to GitHub.  
`// data/products.js`  
`export const products = [`  
  `{`  
    `id: "prod_001",`  
    `slug: "king-energy-oversized",`  
    `title: "King Energy Oversized Customized Tee",`  
    `category: "Virat Kohli Collection",`  
    `image: "/images/king-energy.jpg",`   
    `originalPrice: 1299,`  
    `salePrice: 899,`  
    `discountTag: "Save 31%",`  
    `sizes: ["S", "M", "L", "XL", "XXL"],`  
    `description: "Premium cotton oversized fit."`  
  `}`  
`];`

**WhatsApp Routing Logic:**  
``const orderMessage = `New Order from ${name}!\n\nProducts:\n${cartItems.map(item => `${item.title} (Size: ${item.size}) - Rs.${item.price}`).join('\n')}\n\nTotal: Rs.${cartTotal}\n\nShipping Address:\n${address}, ${pincode}\nPhone: ${phone}`;``

``const whatsappUrl = `https://wa.me/91YOURNUMBER?text=${encodeURIComponent(orderMessage)}`;``

## **3\. UI and UX Design Guidelines**

**Aesthetic:** Bold, streetwear, high-contrast, heavily focused on product photography.

> * **Colors:** White background (\#FFFFFF), Pitch Black text (\#000000), and striking Red (\#FF0000) for urgency tags (🔥, "Save 33%", "Only Pre-Paid").  
> * **Typography:** Bold sans-serif for headers (e.g., *Montserrat* or *Oswald*) and clean sans-serif for descriptions (*Inter*).  
> * **Navigation:** Sticky top header with a scrolling announcement marquee.  
> * **Mobile-First Layout:** 2-column product grids on mobile, 4-column on desktop.  
> * **Checkout UX:** The checkout button must explicitly feature the WhatsApp logo and say **"Complete Order on WhatsApp"**. Add micro-copy below it: *"You will be redirected to our official WhatsApp to receive your UPI payment QR code."*

## **4\. Execution Plan (Developer Workflow)**

> 1. **Initialize Project & Asset Organization**  
>    Run npx create-next-app thecoolcanvas. Create a public/images folder and migrate all high-res T-shirt images, banners, and logos from the old site into this folder.  
> 2. **Build the Hardcoded Database**  
>    Create a data/ folder and a products.js file. Write out the JavaScript array containing all product details, pricing, sizes, and image paths.  
> 3. **Develop Frontend UI & Cart Engine**  
>    Use Tailwind CSS to build the Homepage, Category pages, and Product detail pages by mapping over the products.js file. Implement the React Context logic to handle addToCart, removeFromCart, and UI toggles for the slide-out cart drawer.  
> 4. **Implement WhatsApp & Email Integrations**  
>    Build the final checkout form. Write the JavaScript function that concatenates the cart array and user form data into a URL-encoded string for the wa.me redirect. Set up a Next.js API route using Resend to fire the backup email simultaneously.  
> 5. **Deploy & Redirect Domain**  
>    Push the entire repository to GitHub. Connect the repo to Vercel for instant deployment. Go to your domain registrar (or Shopify DNS settings), remove the Shopify A/CNAME records, and point the domain (thecoolcanvas.in) to Vercel's nameservers.

## **Post-Launch Operations Protocol**

> 1. **Adding Inventory:** Add image to public/images \-\> Add object to products.js \-\> Push to GitHub \-\> Vercel auto-updates in 60 seconds.  
> 2. **Fulfilling Orders:** User message arrives on WhatsApp \-\> You reply with a UPI QR code \-\> User pays \-\> You manually process the shipment via Shiprocket.