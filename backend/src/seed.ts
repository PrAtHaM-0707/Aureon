// src/seed.ts
import mongoose from 'mongoose';
import Product from './models/Product.model.js';
import connectDB from './config/db.js';

const products = [
  {
    name: "Air Max 90",
    brand: "Nike",
    price: 150,
    originalPrice: 180,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80"
    ],
    category: "Running",
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    colors: ["White", "Black", "Red"],
    description: "The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU details. Classic colors celebrate your fresh look while Max Air cushioning adds comfort to your journey.",
    inStock: true,
    featured: true
  },
  {
    name: "Yeezy Boost 350 V2",
    brand: "Adidas",
    price: 230,
    images: [
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
      "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80"
    ],
    category: "Lifestyle",
    sizes: [6, 7, 8, 9, 10, 11, 12, 13],
    colors: ["Zebra", "Black", "Cream"],
    description: "The Adidas Yeezy Boost 350 V2 features an upper composed of re-engineered Primeknit.",
    inStock: true,
    featured: true
  },
  {
    name: "Jordan 1 Retro High OG",
    brand: "Jordan",
    price: 180,
    images: [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80"
    ],
    category: "Basketball",
    sizes: [7, 8, 9, 10, 11, 12, 13, 14],
    colors: ["Chicago", "Royal", "Shadow"],
    description: "The Air Jordan 1 Retro High OG returns with a fresh look that celebrates the shoe's legacy.",
    inStock: true,
    featured: true
  },
  {
    name: "New Balance 550",
    brand: "New Balance",
    price: 130,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80"
    ],
    category: "Lifestyle",
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ["White/Green", "White/Navy", "White/Red"],
    description: "Originally released in 1989 and revived for today's style-focused sneaker enthusiasts.",
    inStock: true
  },
  {
    name: "Dunk Low Panda",
    brand: "Nike",
    price: 110,
    originalPrice: 130,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80"
    ],
    category: "Skateboarding",
    sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12],
    colors: ["Black/White", "Grey Fog", "Team Green"],
    description: "Created for the hardwood but taken to the streets, the Nike Dunk Low features a classic design.",
    inStock: true,
    featured: true
  },
  {
    name: "Ultra Boost 22",
    brand: "Adidas",
    price: 190,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=800&q=80"
    ],
    category: "Running",
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colors: ["Core Black", "Cloud White", "Solar Red"],
    description: "Experience epic energy with every step in the Ultraboost 22.",
    inStock: true
  },
  {
    name: "Chuck Taylor All Star 70",
    brand: "Converse",
    price: 85,
    images: ["https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&q=80"],
    category: "Lifestyle",
    sizes: [5, 6, 7, 8, 9, 10, 11, 12, 13],
    colors: ["Black", "Parchment", "Sunflower"],
    description: "The Chuck 70 is a premium update of the original Chuck Taylor All Star.",
    inStock: true
  },
  {
    name: "Air Force 1 '07",
    brand: "Nike",
    price: 115,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80"
    ],
    category: "Lifestyle",
    sizes: [6, 7, 8, 9, 10, 11, 12, 13, 14],
    colors: ["White", "Black", "Sail"],
    description: "The radiance lives on in the Nike Air Force 1 '07.",
    inStock: true,
    featured: true
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();