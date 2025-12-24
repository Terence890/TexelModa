import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { copyImageToPublic } from '../utils/imageHandler.js';
import connectDB from '../config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Image mapping: imported variable name -> actual filename
const imageMap = {
  'female01': 'female_01.jpg',
  'female02': 'female_02.jpg',
  'female03': 'female_03.jpg',
  'female04': 'female_04.jpg',
  'female05': 'female_05.jpg',
  'female06': 'female_06.jpg',
  'female07': 'female_07.jpg',
  'female08': 'female_08.jpg',
  'female09': 'female_09.jpg',
  'male01': 'male_01.jpg',
  'male02': 'male_02.jpg',
  'male03': 'male_03.jpg',
  'male04': 'male_04.jpg',
  'male05': 'male_05.jpg',
  'male06': 'male_06.jpg',
  'male07': 'male_07.jpg',
  'male08': 'male_08.jpg',
  'male09': 'male_09.jpg',
  'bottom1': 'bottom1.png',
  'bottom2': 'bottom2.PNG',
  'bottom3': 'bottom3.JPG',
  'bottom4': 'bottom4.PNG',
  'bottom5': 'bottom5.png',
  'dress1': 'dress1.png',
  'dress2': 'dress2.png',
  'top3': 'top3.JPG',
  'top4': 'top4.png',
  'top5': 'top5.png',
  'top111': 'top111.png',
  'top222': 'top222.JPG',
  'top333': 'top333.png',
};

// Products data - extracted from products.js
const products = [
  { id: 1, name: "Women's Summer Dress", price: 79.99, image: 'female01', category: 'dresses', gender: 'women', colors: ['white', 'floral'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.7, reviewCount: 124, description: 'Elegant summer dress with a floral pattern, perfect for warm days.', isFeatured: true, isNew: true },
  { id: 2, name: "Women's Casual Outfit", price: 89.99, image: 'female02', category: 'casual', gender: 'women', colors: ['white', 'blue'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.5, reviewCount: 87, description: 'Stylish casual outfit combination for everyday comfort.', isFeatured: true, isNew: false },
  { id: 3, name: "Women's Elegant Dress", price: 124.99, image: 'female03', category: 'dresses', gender: 'women', colors: ['black'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.8, reviewCount: 95, description: 'Elegant black dress for special occasions and formal events.', isFeatured: false, isNew: false },
  { id: 4, name: "Women's Fashion Top", price: 49.99, image: 'female04', category: 'tops', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.3, reviewCount: 52, description: 'Trendy white top that pairs well with any bottom wear.', isFeatured: true, isNew: true },
  { id: 5, name: "Women's Formal Suit", price: 149.99, image: 'female05', category: 'suits', gender: 'women', colors: ['grey'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, reviewCount: 73, description: 'Professional women\'s suit for business and formal occasions.', isFeatured: false, isNew: true },
  { id: 6, name: "Women's Blazer", price: 129.99, image: 'female06', category: 'blazers', gender: 'women', colors: ['beige'], sizes: ['S', 'M', 'L'], rating: 4.4, reviewCount: 61, description: 'Stylish beige blazer to elevate any professional outfit.', isFeatured: true, isNew: false },
  { id: 7, name: "Women's Casual Sweater", price: 59.99, image: 'female07', category: 'sweaters', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.2, reviewCount: 48, description: 'Cozy and comfortable sweater for casual everyday wear.', isFeatured: false, isNew: false },
  { id: 8, name: "Women's Denim Outfit", price: 89.99, image: 'female08', category: 'casual', gender: 'women', colors: ['denim', 'blue'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.5, reviewCount: 92, description: 'Trendy denim-based outfit for a casual stylish look.', isFeatured: true, isNew: true },
  { id: 9, name: "Women's Summer Top", price: 44.99, image: 'female09', category: 'tops', gender: 'women', colors: ['white', 'yellow'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.3, reviewCount: 57, description: 'Light and breezy summer top for hot days.', isFeatured: false, isNew: true },
  { id: 10, name: "Men's Formal Suit", price: 199.99, image: 'male01', category: 'suits', gender: 'men', colors: ['black'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, reviewCount: 112, description: 'Premium black formal suit for business and special occasions.', isFeatured: true, isNew: false },
  { id: 11, name: "Men's Business Casual", price: 159.99, image: 'male02', category: 'business-casual', gender: 'men', colors: ['blue', 'white'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, reviewCount: 87, description: 'Professional business casual outfit for the modern man.', isFeatured: true, isNew: true },
  { id: 12, name: "Men's Casual Shirt", price: 59.99, image: 'male03', category: 'shirts', gender: 'men', colors: ['blue', 'white'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.4, reviewCount: 76, description: 'Comfortable casual shirt with a modern fit and design.', isFeatured: false, isNew: false },
  { id: 13, name: "Men's Winter Coat", price: 189.99, image: 'male04', category: 'outerwear', gender: 'men', colors: ['black', 'grey'], sizes: ['M', 'L', 'XL', 'XXL'], rating: 4.8, reviewCount: 104, description: 'Warm and stylish winter coat to keep you comfortable in cold weather.', isFeatured: true, isNew: true },
  { id: 14, name: "Men's Casual Look", price: 119.99, image: 'male05', category: 'casual', gender: 'men', colors: ['grey', 'black'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviewCount: 69, description: 'Trendy casual outfit combination for a stylish everyday look.', isFeatured: true, isNew: false },
  { id: 15, name: "Men's Denim Jacket", price: 89.99, image: 'male06', category: 'jackets', gender: 'men', colors: ['denim', 'blue'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, reviewCount: 82, description: 'Classic denim jacket that never goes out of style.', isFeatured: false, isNew: true },
  { id: 16, name: "Men's Polo Shirt", price: 39.99, image: 'male07', category: 'shirts', gender: 'men', colors: ['navy'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.3, reviewCount: 58, description: 'Classic polo shirt for a smart casual look.', isFeatured: false, isNew: false },
  { id: 17, name: "Men's Casual T-Shirt", price: 34.99, image: 'male08', category: 'shirts', gender: 'men', colors: ['white'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.2, reviewCount: 47, description: 'Comfortable everyday t-shirt with a modern fit.', isFeatured: true, isNew: true },
  { id: 18, name: "Men's Summer Outfit", price: 79.99, image: 'male09', category: 'casual', gender: 'men', colors: ['white', 'blue'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.4, reviewCount: 63, description: 'Light and stylish outfit for warm summer days.', isFeatured: false, isNew: true },
  { id: 19, name: "Women's Bottom 1", price: 89.99, image: 'bottom1', category: 'bottoms', gender: 'women', colors: ['blue'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5, reviewCount: 10, description: 'Trendy women\'s bottom wear for versatile styling.', isFeatured: false, isNew: true },
  { id: 20, name: "Women's Bottom 2", price: 89.99, image: 'bottom2', category: 'bottoms', gender: 'women', colors: ['blue'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5, reviewCount: 10, description: 'Trendy women\'s bottom wear for versatile styling.', isFeatured: false, isNew: true },
  { id: 21, name: "Women's Bottom 3", price: 89.99, image: 'bottom3', category: 'bottoms', gender: 'women', colors: ['blue'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5, reviewCount: 10, description: 'Trendy women\'s bottom wear for versatile styling.', isFeatured: false, isNew: true },
  { id: 22, name: "Women's Bottom 4", price: 89.99, image: 'bottom4', category: 'bottoms', gender: 'women', colors: ['blue'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5, reviewCount: 10, description: 'Trendy women\'s bottom wear for versatile styling.', isFeatured: false, isNew: true },
  { id: 23, name: "Women's Bottom 5", price: 89.99, image: 'bottom5', category: 'bottoms', gender: 'women', colors: ['blue'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5, reviewCount: 10, description: 'Trendy women\'s bottom wear for versatile styling.', isFeatured: false, isNew: true },
  { id: 24, name: "Women's Dress 1", price: 119.99, image: 'dress1', category: 'dresses', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.6, reviewCount: 12, description: 'Elegant women\'s dress for special occasions.', isFeatured: false, isNew: true },
  { id: 25, name: "Women's Dress 2", price: 119.99, image: 'dress2', category: 'dresses', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.6, reviewCount: 12, description: 'Elegant women\'s dress for special occasions.', isFeatured: false, isNew: true },
  { id: 26, name: "Women's Top 3", price: 59.99, image: 'top3', category: 'tops', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3, reviewCount: 8, description: 'Stylish women\'s top for everyday wear.', isFeatured: false, isNew: true },
  { id: 27, name: "Women's Top 4", price: 59.99, image: 'top4', category: 'tops', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3, reviewCount: 8, description: 'Stylish women\'s top for everyday wear.', isFeatured: false, isNew: true },
  { id: 28, name: "Women's Top 5", price: 59.99, image: 'top5', category: 'tops', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3, reviewCount: 8, description: 'Stylish women\'s top for everyday wear.', isFeatured: false, isNew: true },
  { id: 29, name: "Women's Top 111", price: 59.99, image: 'top111', category: 'tops', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3, reviewCount: 8, description: 'Stylish women\'s top for everyday wear.', isFeatured: false, isNew: true },
  { id: 30, name: "Women's Top 222", price: 59.99, image: 'top222', category: 'tops', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3, reviewCount: 8, description: 'Stylish women\'s top for everyday wear.', isFeatured: false, isNew: true },
  { id: 31, name: "Women's Top 333", price: 59.99, image: 'top333', category: 'tops', gender: 'women', colors: ['white'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3, reviewCount: 8, description: 'Stylish women\'s top for everyday wear.', isFeatured: false, isNew: true },
];

const migrateProducts = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing products.`);
      console.log('   To re-migrate, delete all products first:');
      console.log('   await Product.deleteMany({});');
      process.exit(0);
    }

    console.log('🔄 Starting product migration...\n');

    // Source images directory
    const sourceImagesDir = path.join(process.cwd(), 'src', 'assets', 'clothing');

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of products) {
      try {
        // Check if product already exists
        const existing = await Product.findOne({ name: product.name });
        if (existing) {
          console.log(`⏭️  Skipping: ${product.name} (already exists)`);
          skipped++;
          continue;
        }

        // Get image filename from mapping
        const imageKey = product.image;
        const imageFilename = imageMap[imageKey] || `${imageKey}.jpg`;
        
        // Copy image to public folder
        const sourceImagePath = path.join(sourceImagesDir, imageFilename);
        let publicImagePath;
        
        if (fs.existsSync(sourceImagePath)) {
          try {
            publicImagePath = copyImageToPublic(sourceImagePath, imageFilename);
            console.log(`📸 Copied: ${imageFilename}`);
          } catch (error) {
            console.warn(`⚠️  Could not copy ${imageFilename}: ${error.message}`);
            publicImagePath = `/images/products/${imageFilename}`;
          }
        } else {
          console.warn(`⚠️  Image not found: ${sourceImagePath}`);
          publicImagePath = `/images/products/${imageFilename}`;
        }

        // Create product document
        const productData = {
          name: product.name,
          description: product.description || '',
          price: product.price,
          compareAtPrice: product.compareAtPrice || null,
          image: publicImagePath,
          images: [publicImagePath],
          category: product.category,
          gender: product.gender || 'unisex',
          colors: product.colors || [],
          sizes: product.sizes || [],
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          isFeatured: product.isFeatured || false,
          isNew: product.isNew || false,
          isActive: true,
          tags: product.tags || [],
        };

        await Product.create(productData);
        migrated++;
        console.log(`✅ Migrated: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error migrating ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${migrated + skipped + errors}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

// Run migration
migrateProducts();
