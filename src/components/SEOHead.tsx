import React from 'react';
import { Screen } from '../types';

interface SEOHeadProps {
  currentScreen: Screen;
  vehicleData?: any;
  serviceData?: any;
}

export function SEOHead({ currentScreen, vehicleData, serviceData }: SEOHeadProps) {
  const getPageData = () => {
    const baseUrl = 'https://waypartner.in';
    const siteName = 'WayPartner Service Center';
    const businessPhone = '+91 9876543210';
    const businessEmail = 'support@waypartner.com';
    
    const defaultData = {
      title: `${siteName} - Professional Vehicle Service Center in Hyderabad`,
      description: 'WayPartner is Hyderabad\'s leading vehicle service center offering professional 2-wheeler and 4-wheeler maintenance, repairs, and servicing with green coins rewards system.',
      keywords: 'vehicle service center, bike service, car service, automobile repair, hyderabad service center, vehicle maintenance, two wheeler service, four wheeler service, green coins, vehicle booking',
      url: baseUrl,
      image: `${baseUrl}/images/waypartner-og.jpg`,
      type: 'website'
    };

    switch (currentScreen) {
      case 'home':
        return {
          ...defaultData,
          title: 'WayPartner - Best Vehicle Service Center in Hyderabad | Book Online',
          description: 'Book vehicle service online at WayPartner Hyderabad. Professional 2W & 4W servicing, free engine maintenance, green coins rewards. Trusted by 6000+ customers.',
          keywords: 'vehicle service center hyderabad, online vehicle booking, bike service hyderabad, car service hyderabad, automobile repair, green coins rewards, engine maintenance',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'AutoRepair',
            'name': siteName,
            'description': 'Professional vehicle service center in Hyderabad offering comprehensive 2-wheeler and 4-wheeler maintenance services.',
            'url': baseUrl,
            'telephone': businessPhone,
            'email': businessEmail,
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '123 Service Road',
              'addressLocality': 'Hyderabad',
              'addressRegion': 'Telangana',
              'postalCode': '500001',
              'addressCountry': 'IN'
            },
            'openingHours': 'Mo-Sa 09:00-18:00',
            'areaServed': ['Hyderabad', 'Secunderabad', 'Cyberabad'],
            'hasOfferCatalog': {
              '@type': 'OfferCatalog',
              'name': 'Vehicle Services',
              'itemListElement': [
                {
                  '@type': 'Offer',
                  'itemOffered': {
                    '@type': 'Service',
                    'name': '2-Wheeler Full Service',
                    'description': 'Complete maintenance service for motorcycles and scooters'
                  }
                },
                {
                  '@type': 'Offer',
                  'itemOffered': {
                    '@type': 'Service',
                    'name': '4-Wheeler Full Service',
                    'description': 'Comprehensive car servicing and maintenance'
                  }
                }
              ]
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.8',
              'reviewCount': '1250'
            }
          }
        };

      case 'dashboard':
        return {
          ...defaultData,
          title: 'Service Center Dashboard - WayPartner Management Portal',
          description: 'WayPartner service center management dashboard for booking management, vehicle tracking, and business analytics.',
          keywords: 'service center dashboard, vehicle management, booking system, service tracking',
          url: `${baseUrl}/dashboard`,
          robots: 'noindex, nofollow'
        };

      case 'slot-booking':
        return {
          ...defaultData,
          title: 'Book Vehicle Service Slot Online - WayPartner Hyderabad',
          description: 'Book your vehicle service slot online at WayPartner. Choose convenient time slots for 2W & 4W servicing. Use green coins for discounts.',
          keywords: 'book vehicle service online, service booking hyderabad, vehicle slot booking, online appointment, green coins discount',
          url: `${baseUrl}/booking`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'ReservationService',
            'name': 'Vehicle Service Booking',
            'provider': {
              '@type': 'AutoRepair',
              'name': siteName
            },
            'availableChannel': {
              '@type': 'ServiceChannel',
              'serviceUrl': `${baseUrl}/booking`,
              'serviceType': 'Online Booking'
            }
          }
        };

      case 'vehicle-registration':
        return {
          ...defaultData,
          title: 'Register Your Vehicle - WayPartner Service Center',
          description: 'Register your vehicle with WayPartner and start earning green coins for every kilometer driven. Get exclusive benefits and free engine maintenance.',
          keywords: 'vehicle registration, green coins registration, vehicle enrollment, service center registration',
          url: `${baseUrl}/register`
        };

      case 'vehicle-status':
        return {
          ...defaultData,
          title: 'Track Vehicle Service Status - WayPartner',
          description: 'Track your vehicle service status in real-time. Get updates on service progress, completion status, and pickup readiness.',
          keywords: 'vehicle service status, service tracking, vehicle progress, service updates',
          url: `${baseUrl}/status`
        };

      case 'green-coins':
        return {
          ...defaultData,
          title: 'Green Coins Rewards Program - WayPartner',
          description: 'Earn green coins for every kilometer driven and redeem for service discounts. Exclusive rewards program for WayPartner customers.',
          keywords: 'green coins, vehicle rewards program, service discounts, loyalty program, kilometer rewards',
          url: `${baseUrl}/green-coins`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'LoyaltyProgram',
            'name': 'Green Coins Rewards',
            'description': 'Earn 1 green coin per kilometer driven and redeem for service discounts',
            'programMembershipUsed': {
              '@type': 'ProgramMembership',
              'membershipNumber': 'Green Coins Member'
            }
          }
        };

      case 'reports':
        return {
          ...defaultData,
          title: 'Service Reports & Analytics - WayPartner Dashboard',
          description: 'Comprehensive service reports and business analytics for WayPartner service center operations.',
          keywords: 'service reports, business analytics, service center management',
          url: `${baseUrl}/reports`,
          robots: 'noindex, nofollow'
        };

      default:
        return defaultData;
    }
  };

  const pageData = getPageData();

  React.useEffect(() => {
    // Update document title
    document.title = pageData.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageData.description);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', pageData.keywords);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageData.url);

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: pageData.title },
      { property: 'og:description', content: pageData.description },
      { property: 'og:url', content: pageData.url },
      { property: 'og:type', content: pageData.type },
      { property: 'og:image', content: pageData.image },
      { property: 'og:site_name', content: 'WayPartner Service Center' },
      { property: 'og:locale', content: 'en_IN' }
    ];

    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });

    // Update Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageData.title },
      { name: 'twitter:description', content: pageData.description },
      { name: 'twitter:image', content: pageData.image },
      { name: 'twitter:site', content: '@WayPartnerIN' }
    ];

    twitterTags.forEach(tag => {
      let twitterTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', tag.name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', tag.content);
    });

    // Update robots meta tag
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', pageData.robots || 'index, follow, max-image-preview:large');

    // Add structured data
    if (pageData.structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(pageData.structuredData);
    }

    // Add business info for local SEO
    const businessStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://waypartner.in/#business',
      'name': 'WayPartner Service Center',
      'alternateName': 'WayPartner',
      'description': 'Professional vehicle service center in Hyderabad',
      'url': 'https://waypartner.in',
      'telephone': '+91 9876543210',
      'email': 'support@waypartner.com',
      'priceRange': '₹₹',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '123 Service Road',
        'addressLocality': 'Hyderabad',
        'addressRegion': 'Telangana',
        'postalCode': '500001',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '17.3850',
        'longitude': '78.4867'
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          'opens': '09:00',
          'closes': '18:00'
        }
      ],
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Vehicle Services',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Two Wheeler Service',
              'description': 'Complete maintenance for motorcycles and scooters'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Four Wheeler Service',
              'description': 'Comprehensive car servicing and repairs'
            }
          }
        ]
      },
      'sameAs': [
        'https://www.facebook.com/waypartner',
        'https://www.instagram.com/waypartner',
        'https://twitter.com/waypartner'
      ]
    };

    let businessScript = document.querySelector('script[data-schema="business"]');
    if (!businessScript) {
      businessScript = document.createElement('script');
      businessScript.setAttribute('type', 'application/ld+json');
      businessScript.setAttribute('data-schema', 'business');
      document.head.appendChild(businessScript);
    }
    businessScript.textContent = JSON.stringify(businessStructuredData);

  }, [currentScreen, pageData]);

  return null; // This component only manages head elements
}