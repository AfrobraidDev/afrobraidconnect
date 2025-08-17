// app/business/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Business } from '@/components/features-component'
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MapPin, Clock, Phone, Globe, Star, ChevronLeft, Instagram, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';

// Mock data matching your FeaturedComponent's staticBusinesses
const mockBusinesses: Business[] = [
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
  // Add other businesses from your static data here...
];

async function getBusiness(slug: string): Promise<Business | null> {
  // In a real app, you'd fetch from your API:
  // const res = await fetch(`https://your-api.com/businesses/${slug}`);
  // return res.json();
  
  return mockBusinesses.find(business => business.slug === slug) || null;
}

export default async function BusinessPage({
  params,
}: {
  params: { slug: string };
}) {
  const business = await getBusiness(params.slug);

  if (!business) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </Button>
      </div>

      {/* Business Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Main Image */}
        <div className="w-full md:w-1/2 lg:w-2/3">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src={business.image || '/images/business-placeholder.jpg'}
              alt={business.name}
              fill
              className="object-cover"
              priority
            />
            {business.group && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                {business.group}
              </span>
            )}
          </div>
        </div>

        {/* Business Info */}
        <div className="w-full md:w-1/2 lg:w-1/3 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-muted-foreground">{business.category}</p>
          </div>

          {/* Rating */}
          {business.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">{business.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm ml-2">({Math.floor(Math.random() * 100) + 20} reviews)</span>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <p>{business.location}</p>
            </div>
            {business.hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-muted-foreground">{business.hours}</p>
                </div>
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <p>{business.phone}</p>
              </div>
            )}
            {business.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a 
                  href={business.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            {business.phone && (
              <Button asChild className="flex-1 min-w-[120px]">
                <a href={`tel:${business.phone}`}>Call Now</a>
              </Button>
            )}
            {business.website && (
              <Button variant="outline" asChild className="flex-1 min-w-[120px]">
                <a href={business.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
            )}
          </div>

          {/* Social Media (example) */}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">About {business.name}</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {business.description}
        </p>
      </div>

      {/* Gallery */}
      {business.gallery && business.gallery.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {business.gallery.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <Image
                  src={image}
                  alt={`${business.name} gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div className="bg-muted rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
          {/* Replace with your actual map component */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-700/10" />
          <p className="text-muted-foreground relative z-10 bg-background/80 px-4 py-2 rounded-lg">
            Map would be displayed here
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a 
              href={`https://maps.google.com?q=${encodeURIComponent(business.location)}`} 
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href={`https://www.waze.com/ul?q=${encodeURIComponent(business.location)}`} 
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Waze
            </a>
          </Button>
        </div>
      </div>

      {/* Related Businesses Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Similar Businesses</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockBusinesses
            .filter(b => b.id !== business.id && b.group === business.group)
            .slice(0, 4)
            .map(business => (
              <Link 
                key={business.id} 
                href={`/business/${business.slug}`}
                className="group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={business.image || '/images/business-placeholder.jpg'}
                    alt={business.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-2 font-medium group-hover:text-primary">
                  {business.name}
                </h3>
                <p className="text-sm text-muted-foreground">{business.category}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}