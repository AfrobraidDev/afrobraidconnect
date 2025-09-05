import HeroSection from "@/components/Hero-Section";
import CtaComponent from "@/components/cta-section";
import AppLayout from "@/components/app-layout";
import ServiceCarousel from "@/components/service-carousel";

export default async function Home() {
  const recommended = [
    {
      image: "/images/person6.jpg",
      title: "Braids by Myra",
      rating: 5.0,
      reviews: 621,
      location: "Sonnenallee 120, 12045 Berlin",
      services: [
        "Box Braids", "Corn Rows", "Rope Braids", "Crown Braids",
        "Dutch Braids", "Knotless Braids", "Faux Locs",
      ],
    },
    {
      image: "/images/person12.jpg",
      title: "Protective Styles by Nana",
      rating: 4.9,
      reviews: 510,
      location: "Leipziger Str. 44, 60487 Frankfurt",
      services: ["Box Braids", "Corn Rows", "Rope Braids", "Crown Braids", "Dutch Braids"],
    },
    {
      image: "/images/person13.jpg",
      title: "Afro Hair Deluxe",
      rating: 4.7,
      reviews: 410,
      location: "Alexanderplatz 12, 10178 Berlin",
      services: ["Twists", "Faux Locs", "Corn Rows", "Dreadlocks"],
    },
    {
      image: "/images/person19.jpg",
      title: "Locs by Ama",
      rating: 4.8,
      reviews: 360,
      location: "Hauptstr. 55, 50667 Köln",
      services: ["Dreadlocks", "Sisterlocks", "Twists"],
    },
    {
      image: "/images/person2.png",
      title: "Natural Glow Hair Studio",
      rating: 5.0,
      reviews: 299,
      location: "Maximilianstr. 99, 80539 München",
      services: ["Corn Rows", "Braids", "Protective Styles"],
    },
  ];

  const trending = [
    {
      image: "/images/person11.jpg",
      title: "Braids by Myra",
      rating: 5.0,
      reviews: 621,
      location: "Sonnenallee 120, 12045 Berlin",
      services: [
        "Box Braids", "Corn Rows", "Rope Braids", "Crown Braids",
        "Dutch Braids", "Knotless Braids", "Faux Locs",
      ],
    },
    {
      image: "/images/person18.jpg",
      title: "Protective Styles by Nana",
      rating: 4.9,
      reviews: 510,
      location: "Leipziger Str. 44, 60487 Frankfurt",
      services: ["Box Braids", "Corn Rows", "Rope Braids", "Crown Braids", "Dutch Braids"],
    },
    {
      image: "/images/person14.png",
      title: "Afro Hair Deluxe",
      rating: 4.7,
      reviews: 410,
      location: "Alexanderplatz 12, 10178 Berlin",
      services: ["Twists", "Faux Locs", "Corn Rows", "Dreadlocks"],
    },
    {
      image: "/images/person9.jpg",
      title: "Locs by Ama",
      rating: 4.8,
      reviews: 360,
      location: "Hauptstr. 55, 50667 Köln",
      services: ["Dreadlocks", "Sisterlocks", "Twists"],
    },
    {
      image: "/images/person1.png",
      title: "Natural Glow Hair Studio",
      rating: 5.0,
      reviews: 299,
      location: "Maximilianstr. 99, 80539 München",
      services: ["Corn Rows", "Braids", "Protective Styles"],
    },
  ];

  const newToAfroBraid = [
    {
      image: "/images/person10.jpg",
      title: "Braids by Myra",
      rating: 5.0,
      reviews: 621,
      location: "Sonnenallee 120, 12045 Berlin",
      services: [
        "Box Braids", "Corn Rows", "Rope Braids", "Crown Braids",
        "Dutch Braids", "Knotless Braids", "Faux Locs",
      ],
    },
    {
      image: "/images/person8.jpg",
      title: "Protective Styles by Nana",
      rating: 4.9,
      reviews: 510,
      location: "Leipziger Str. 44, 60487 Frankfurt",
      services: ["Box Braids", "Corn Rows", "Rope Braids", "Crown Braids", "Dutch Braids"],
    },
    {
      image: "/images/person15.jpg",
      title: "Afro Hair Deluxe",
      rating: 4.7,
      reviews: 410,
      location: "Alexanderplatz 12, 10178 Berlin",
      services: ["Twists", "Faux Locs", "Corn Rows", "Dreadlocks"],
    },
    {
      image: "/images/person17.png",
      title: "Locs by Ama",
      rating: 4.8,
      reviews: 360,
      location: "Hauptstr. 55, 50667 Köln",
      services: ["Dreadlocks", "Sisterlocks", "Twists"],
    },
    {
      image: "/images/person16.jpg",
      title: "Natural Glow Hair Studio",
      rating: 5.0,
      reviews: 299,
      location: "Maximilianstr. 99, 80539 München",
      services: ["Corn Rows", "Braids", "Protective Styles"],
    },
  ];

  return (
    <AppLayout>
      <main className="flex flex-col min-h-[calc(100vh-64px)]">
        <HeroSection />

        {/* recommended */}
        <section className="mt-12 mb-20 ml-10 mr-20 lg:ml-20 lg:mr-20">
          <h2 className="text-4xl font-bold mb-6 mx-[20px]">Recommended</h2>
          <ServiceCarousel services={recommended} />
        </section>

        {/* trending */}
        <section className="mt-12 mb-20 ml-10 mr-20 lg:ml-20 lg:mr-20">
          <h2 className="text-4xl font-bold mb-6 mx-[20px]">Trending</h2>
          <ServiceCarousel services={trending} />
        </section>

        {/* newToAfroBraid */}
        <section className="mt-12 mb-20 ml-10 mr-20 lg:ml-20 lg:mr-20">
          <h2 className="text-4xl font-bold mb-6 mx-[20px]">New to AfroBraids</h2>
          <ServiceCarousel services={newToAfroBraid} />
        </section>

        <CtaComponent />
      </main>
    </AppLayout>
  );
}
