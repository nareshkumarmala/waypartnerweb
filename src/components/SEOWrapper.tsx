import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEOWrapper({
  title = "WayPartner - Revolutionary Vehicle Service Center Management System",
  description = "Transform your vehicle service center with WayPartner's intelligent management system. Green Coins rewards, automated workflows, real-time tracking, and seamless operations for 2-wheelers and 4-wheelers.",
  keywords = "vehicle service center, service management system, green coins, vehicle inspection, service booking, automotive software, fleet management, service center dashboard, vehicle maintenance, automotive business",
  image = "/og-image.png",
  url = "https://www.waypartnerindia.com",
  type = "website"
}: SEOProps) {
  const fullTitle = title.includes('WayPartner') ? title : `${title} | WayPartner`;
  
  React.useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'en');
    updateMetaTag('author', 'WayPartner Technologies');
    
    // Open Graph tags
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:site_name', 'WayPartner', true);
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Mobile optimization
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0';
    }
    
    // Theme color
    updateMetaTag('theme-color', '#088145');
    
    // Add structured data
    const addStructuredData = () => {
      const existingScript = document.querySelector('#structured-data');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WayPartner Service Center Management",
        "description": description,
        "url": url,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150"
        },
        "creator": {
          "@type": "Organization",
          "name": "WayPartner Technologies",
          "url": url
        }
      });
      
      document.head.appendChild(script);
    };
    
    addStructuredData();
    
    // Cleanup function
    return () => {
      // Reset title when component unmounts
      document.title = "WayPartner - Vehicle Service Center Management";
    };
  }, [fullTitle, description, keywords, image, url, type]);

  return null; // This component only manages document head, doesn't render anything
}

// Page-specific SEO components
export function HomeSEO() {
  return (
    <SEOWrapper
      title="WayPartner - Revolutionary Vehicle Service Center Management System"
      description="Transform your vehicle service center with WayPartner's intelligent management system. Green Coins rewards, automated workflows, real-time tracking, and seamless operations for 2-wheelers and 4-wheelers."
      keywords="vehicle service center management, service center software, green coins rewards, vehicle inspection system, automotive management software, fleet management, service booking system"
      url="https://www.waypartnerindia.com"
    />
  );
}

export function DashboardSEO() {
  return (
    <SEOWrapper
      title="Smart Service Center Dashboard - Real-time Analytics & Management"
      description="Monitor your service center operations in real-time with WayPartner's intelligent dashboard. Track bookings, manage fleet, approve additional works, and analyze performance metrics."
      keywords="service center dashboard, real-time analytics, fleet management dashboard, vehicle service analytics, service center metrics, automotive business intelligence"
      url="https://www.waypartnerindia.com/dashboard"
    />
  );
}

export function GreenCoinsSEO() {
  return (
    <SEOWrapper
      title="Green Coins Reward System - Eco-friendly Vehicle Service Rewards"
      description="Revolutionary Green Coins reward system for vehicle services. Earn 1 coin per km driven, redeem for free maintenance, and promote eco-friendly driving habits."
      keywords="green coins, vehicle service rewards, eco-friendly rewards, sustainable transportation, vehicle loyalty program, green driving incentives"
      url="https://www.waypartnerindia.com/green-coins"
    />
  );
}

export function BookingSEO() {
  return (
    <SEOWrapper
      title="Vehicle Service Booking System - Automated Slot Management"
      description="Streamline your service center bookings with WayPartner's automated slot management. Easy online booking, real-time availability, and seamless customer experience."
      keywords="vehicle service booking, online booking system, service slot management, automated booking, vehicle appointment system, service center scheduling"
      url="https://www.waypartnerindia.com/slot-booking"
    />
  );
}

export function InspectionSEO() {
  return (
    <SEOWrapper
      title="Digital Vehicle Inspection Checklist - Comprehensive Assessment System"
      description="Complete digital vehicle inspection system with automated checklist, photo documentation, and instant report generation. Ensure quality service delivery."
      keywords="vehicle inspection system, digital inspection checklist, automotive assessment, vehicle quality check, inspection automation, service quality assurance"
      url="https://www.waypartnerindia.com/vehicle-inspection"
    />
  );
}

export function FleetSEO() {
  return (
    <SEOWrapper
      title="Fleet Management Dashboard - Complete Vehicle Fleet Overview"
      description="Manage your entire vehicle fleet with WayPartner's comprehensive dashboard. Track 2-wheelers and 4-wheelers, monitor service history, and optimize fleet operations."
      keywords="fleet management, vehicle fleet dashboard, fleet monitoring, vehicle tracking system, fleet optimization, automotive fleet management"
      url="https://www.waypartnerindia.com/fleet-management"
    />
  );
}