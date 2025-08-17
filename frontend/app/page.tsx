// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FeaturedComponent from "@/components/features-component";
import HeroSection from "@/components/Hero-Section";

//  for demo purpopse
const staticBusinesses = [
  {
    id: 1,
    slug: 'afro-chic-fashion',
    name: 'Afro Chic Fashion',
    category: 'Clothing Store',
    location: '123 Cultural Ave, Lagos',
    description: 'Authentic African fashion and accessories for modern tastes. We specialize in handmade garments using traditional fabrics with contemporary designs.',
    rating: 4.7,
    hours: 'Mon-Sat: 9AM-8PM, Sun: 11AM-6PM',
    phone: '+2348012345678',
    website: 'https://afrochic.example.com',
    image: '/images/fashion-store.jpg',
    gallery: [
      '/images/fashion-1.jpg',
      '/images/fashion-2.jpg',
      '/images/fashion-3.jpg'
    ],
    group: 'Fashion',
  },
  {
    id: 2,
    slug: 'jollof-kingdom',
    name: 'Jollof Kingdom',
    category: 'Restaurant',
    location: '45 Flavor Street, Accra',
    description: 'Home of the legendary West African jollof rice. Experience the authentic taste of Ghana with our signature dishes and warm hospitality.',
    rating: 4.9,
    hours: 'Daily: 8AM-10PM',
    phone: '+233201234567',
    website: 'https://jollofkingdom.example.com',
    image: '/images/jollof-restaurant.jpg',
    gallery: [
      '/images/jollof-1.jpg',
      '/images/jollof-2.jpg'
    ],
    group: 'Food',
  },
  {
    id: 3,
    slug: 'diaspora-tours',
    name: 'Diaspora Tours',
    category: 'Travel Agency',
    location: '78 Heritage Road, Nairobi',
    description: 'Cultural heritage tours across Africa. Rediscover your roots with our curated experiences from Cape to Cairo.',
    rating: 4.5,
    hours: 'Mon-Fri: 9AM-5PM, Sat: 10AM-3PM',
    phone: '+254712345678',
    website: 'https://diasporatours.example.com',
    image: '/images/travel-agency.jpg',
    group: 'Travel',
  },
  {
    id: 4,
    slug: 'naija-tech-hub',
    name: 'Naija Tech Hub',
    category: 'Co-working Space',
    location: '22 Innovation Way, Abuja',
    description: 'Premier tech hub fostering innovation and entrepreneurship in Nigeria. We provide workspace, mentorship, and funding opportunities.',
    rating: 4.8,
    hours: 'Mon-Fri: 8AM-8PM, Sat: 10AM-4PM',
    phone: '+2348098765432',
    website: 'https://naijatechhub.example.com',
    image: '/images/tech-hub.jpg',
    gallery: [
      '/images/hub-1.jpg',
      '/images/hub-2.jpg',
      '/images/hub-3.jpg'
    ],
    group: 'Technology',
  },
  {
    id: 5,
    slug: 'yoruba-beats',
    name: 'Yoruba Beats',
    category: 'Music Studio',
    location: '15 Rhythm Lane, Ibadan',
    description: 'Recording studio specializing in Afrobeat and traditional Yoruba music production. Equipped with state-of-the-art technology.',
    rating: 4.3,
    hours: 'By appointment',
    phone: '+2348023456789',
    image: '/images/music-studio.jpg',
    group: 'Entertainment',
  },
  {
    id: 6,
    slug: 'swahili-spa',
    name: 'Swahili Spa',
    category: 'Wellness Center',
    location: '30 Relaxation Blvd, Dar es Salaam',
    description: 'Traditional African spa treatments using natural ingredients and ancient techniques for modern wellness.',
    rating: 4.6,
    hours: 'Daily: 10AM-8PM',
    phone: '+255712345678',
    website: 'https://swahilispa.example.com',
    image: '/images/spa.jpg',
    group: 'Wellness',
  },
  {
    id: 7,
    slug: 'kente-weavers',
    name: 'Kente Weavers',
    category: 'Artisan Collective',
    location: '5 Craft Circle, Kumasi',
    description: 'Preserving the ancient art of Kente weaving. Our collective showcases the finest handmade Ghanaian textiles.',
    rating: 4.4,
    hours: 'Mon-Sat: 9AM-5PM',
    website: 'https://kenteweavers.example.com',
    image: '/images/kente.jpg',
    gallery: [
      '/images/kente-1.jpg',
      '/images/kente-2.jpg'
    ],
    group: 'Artisan',
  },
  {
    id: 8,
    slug: 'sankofa-books',
    name: 'Sankofa Books',
    category: 'Bookstore',
    location: '12 Knowledge Street, Cape Town',
    description: 'Specialist bookstore focusing on African literature, history, and academic works. Community space for book lovers.',
    rating: 4.7,
    hours: 'Mon-Sat: 9AM-6PM',
    phone: '+27211234567',
    image: '/images/bookstore.jpg',
    group: 'Education',
  }
];

// in production you'll wire the real/actual data from the api endpoint to display actual business data

async function getFeaturedBusinesses() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/featured/`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds -> more like a pollingand not web-socket yet
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return null; // Will trigger fallback
  }
}

export default async function Home() {
  const api_data = await getFeaturedBusinesses()
  return (

    <main className="flex flex-col min-h-[calc(100vh-64px)]">

      {/* Hero Section */}
      <HeroSection/>
      {/* end of Hero Section */}

      {/* Featured Businesses Section */}
      <FeaturedComponent 
        businesses={staticBusinesses}
        title="Our Featured Businesses"
      />
      {/* end of Featured Business Section */}


      {/* CTA Section */}
      <section className="py-16 px-[5rem] bg-purple-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of African entrepreneurs reaching new customers every day
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/for-business">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}