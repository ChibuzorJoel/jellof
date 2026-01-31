import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
// Brand Story
brandStory = {
  title: 'Our Story',
  description: 'Founded with a passion for sustainable fashion and timeless design, JELLOF emerged from a vision to revolutionize the way people experience luxury clothing. Our journey began in 2020, driven by the belief that fashion should be both beautiful and responsible.',
  mission: 'To create exceptional clothing that empowers individuals while respecting our planet and the people who craft our garments.',
  vision: 'A world where fashion is synonymous with sustainability, quality, and ethical practices.'
};

// Core Values
coreValues = [
  {
    icon: '🌿',
    title: 'Sustainability',
    description: 'We are committed to eco-friendly practices, using organic materials and reducing our environmental footprint at every step of production.'
  },
  {
    icon: '✨',
    title: 'Quality Craftsmanship',
    description: 'Every piece is meticulously crafted by skilled artisans, ensuring exceptional quality and attention to detail in every stitch.'
  },
  {
    icon: '💚',
    title: 'Ethical Production',
    description: 'We partner with fair-trade suppliers and ensure safe, dignified working conditions for everyone in our supply chain.'
  },
  {
    icon: '🎨',
    title: 'Timeless Design',
    description: 'Our designs transcend trends, focusing on classic silhouettes that remain stylish season after season.'
  },
  {
    icon: '🤝',
    title: 'Community First',
    description: 'We believe in giving back, supporting local communities and empowering women through education and employment.'
  },
  {
    icon: '🌍',
    title: 'Global Impact',
    description: 'From sourcing to delivery, we consider our global impact, striving to make fashion a force for positive change.'
  }
];

// Team Members
teamMembers = [
  {
    name: 'Sarah Johnson',
    position: 'Founder & Creative Director',
    bio: 'With over 15 years in fashion design, Sarah leads our creative vision with a passion for sustainable luxury.',
    image: 'assets/images/team-sarah.jpg'
  },
  {
    name: 'Michael Chen',
    position: 'Head of Production',
    bio: 'Michael ensures our ethical production standards while maintaining the highest quality in every garment.',
    image: 'assets/images/team-michael.jpg'
  },
  {
    name: 'Amara Williams',
    position: 'Sustainability Officer',
    bio: 'Amara spearheads our environmental initiatives, keeping JELLOF at the forefront of sustainable fashion.',
    image: 'assets/images/team-amara.jpg'
  },
  {
    name: 'David Martinez',
    position: 'Design Director',
    bio: 'David brings innovative design concepts to life while honoring our commitment to timeless elegance.',
    image: 'assets/images/team-david.jpg'
  }
];

// Timeline/Milestones
milestones = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'JELLOF was founded with our first sustainable collection featuring 20 pieces.'
  },
  {
    year: '2021',
    title: 'Global Expansion',
    description: 'Opened our first flagship store and launched international shipping to 30 countries.'
  },
  {
    year: '2022',
    title: 'Sustainability Award',
    description: 'Recognized as "Most Sustainable Fashion Brand" by the Global Fashion Council.'
  },
  {
    year: '2023',
    title: 'Community Impact',
    description: 'Launched our artisan partnership program, supporting 500+ craftspeople worldwide.'
  },
  {
    year: '2024',
    title: 'Carbon Neutral',
    description: 'Achieved carbon neutrality across our entire supply chain and operations.'
  },
  {
    year: '2025',
    title: 'Innovation Hub',
    description: 'Opened our sustainable fashion innovation center focused on textile research.'
  }
];

// Statistics
statistics = [
  {
    number: '10K+',
    label: 'Happy Customers',
    icon: '😊'
  },
  {
    number: '500+',
    label: 'Artisan Partners',
    icon: '🤝'
  },
  {
    number: '30+',
    label: 'Countries Served',
    icon: '🌍'
  },
  {
    number: '100%',
    label: 'Sustainable Materials',
    icon: '🌿'
  }
];

// Sustainability Practices
sustainabilityPractices = [
  {
    title: 'Organic Materials',
    description: 'We use 100% organic cotton, linen, and other natural fibers sourced from certified sustainable farms.',
    icon: '🌾'
  },
  {
    title: 'Water Conservation',
    description: 'Our production process uses 80% less water than traditional manufacturing methods.',
    icon: '💧'
  },
  {
    title: 'Zero Waste',
    description: 'We recycle fabric scraps and packaging materials, achieving zero waste to landfill.',
    icon: '♻️'
  },
  {
    title: 'Carbon Offset',
    description: 'All shipping and production emissions are offset through verified reforestation projects.',
    icon: '🌳'
  }
];

constructor() { }
}
