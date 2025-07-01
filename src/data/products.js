import female01 from '../assets/clothing/female_01.jpg';
import female02 from '../assets/clothing/female_02.jpg';
import female03 from '../assets/clothing/female_03.jpg';
import female04 from '../assets/clothing/female_04.jpg';
import female05 from '../assets/clothing/female_05.jpg';
import female06 from '../assets/clothing/female_06.jpg';
import female07 from '../assets/clothing/female_07.jpg';
import female08 from '../assets/clothing/female_08.jpg';
import female09 from '../assets/clothing/female_09.jpg';
import male01 from '../assets/clothing/male_01.jpg';
import male02 from '../assets/clothing/male_02.jpg';
import male03 from '../assets/clothing/male_03.jpg';
import male04 from '../assets/clothing/male_04.jpg';
import male05 from '../assets/clothing/male_05.jpg';
import male06 from '../assets/clothing/male_06.jpg';
import male07 from '../assets/clothing/male_07.jpg';
import male08 from '../assets/clothing/male_08.jpg';
import male09 from '../assets/clothing/male_09.jpg';
import bottom1 from '../assets/clothing/bottom1.png';
import bottom2 from '../assets/clothing/bottom2.PNG';
import bottom3 from '../assets/clothing/bottom3.JPG';
import bottom4 from '../assets/clothing/bottom4.PNG';
import bottom5 from '../assets/clothing/bottom5.png';
import dress1 from '../assets/clothing/dress1.png';
import dress2 from '../assets/clothing/dress2.png';
import top3 from '../assets/clothing/top3.JPG';
import top4 from '../assets/clothing/top4.png';
import top5 from '../assets/clothing/top5.png';
import top111 from '../assets/clothing/top111.png';
import top222 from '../assets/clothing/top222.JPG';
import top333 from '../assets/clothing/top333.png';

const products = [
  {
    id: 1,
    name: 'Women\'s Summer Dress',
    price: 79.99,
    image: female01,
    category: 'dresses',
    gender: 'women',
    colors: ['white', 'floral'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviewCount: 124,
    description: 'Elegant summer dress with a floral pattern, perfect for warm days.',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 2,
    name: 'Women\'s Casual Outfit',
    price: 89.99,
    image: female02,
    category: 'casual',
    gender: 'women',
    colors: ['white', 'blue'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.5,
    reviewCount: 87,
    description: 'Stylish casual outfit combination for everyday comfort.',
    isFeatured: true,
    isNew: false,
  },
  {
    id: 3,
    name: 'Women\'s Elegant Dress',
    price: 124.99,
    image: female03,
    category: 'dresses',
    gender: 'women',
    colors: ['black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviewCount: 95,
    description: 'Elegant black dress for special occasions and formal events.',
    isFeatured: false,
    isNew: false,
  },
  {
    id: 4,
    name: 'Women\'s Fashion Top',
    price: 49.99,
    image: female04,
    category: 'tops',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.3,
    reviewCount: 52,
    description: 'Trendy white top that pairs well with any bottom wear.',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 5,
    name: 'Women\'s Formal Suit',
    price: 149.99,
    image: female05,
    category: 'suits',
    gender: 'women',
    colors: ['grey'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 73,
    description: 'Professional women\'s suit for business and formal occasions.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 6,
    name: 'Women\'s Blazer',
    price: 129.99,
    image: female06,
    category: 'blazers',
    gender: 'women',
    colors: ['beige'],
    sizes: ['S', 'M', 'L'],
    rating: 4.4,
    reviewCount: 61,
    description: 'Stylish beige blazer to elevate any professional outfit.',
    isFeatured: true,
    isNew: false,
  },
  {
    id: 7,
    name: 'Women\'s Casual Sweater',
    price: 59.99,
    image: female07,
    category: 'sweaters',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.2,
    reviewCount: 48,
    description: 'Cozy and comfortable sweater for casual everyday wear.',
    isFeatured: false,
    isNew: false,
  },
  {
    id: 8,
    name: 'Women\'s Denim Outfit',
    price: 89.99,
    image: female08,
    category: 'casual',
    gender: 'women',
    colors: ['denim', 'blue'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.5,
    reviewCount: 92,
    description: 'Trendy denim-based outfit for a casual stylish look.',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 9,
    name: 'Women\'s Summer Top',
    price: 44.99,
    image: female09,
    category: 'tops',
    gender: 'women',
    colors: ['white', 'yellow'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.3,
    reviewCount: 57,
    description: 'Light and breezy summer top for hot days.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 10,
    name: 'Men\'s Formal Suit',
    price: 199.99,
    image: male01,
    category: 'suits',
    gender: 'men',
    colors: ['black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviewCount: 112,
    description: 'Premium black formal suit for business and special occasions.',
    isFeatured: true,
    isNew: false,
  },
  {
    id: 11,
    name: 'Men\'s Business Casual',
    price: 159.99,
    image: male02,
    category: 'business-casual',
    gender: 'men',
    colors: ['blue', 'white'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviewCount: 87,
    description: 'Professional business casual outfit for the modern man.',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 12,
    name: 'Men\'s Casual Shirt',
    price: 59.99,
    image: male03,
    category: 'shirts',
    gender: 'men',
    colors: ['blue', 'white'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.4,
    reviewCount: 76,
    description: 'Comfortable casual shirt with a modern fit and design.',
    isFeatured: false,
    isNew: false,
  },
  {
    id: 13,
    name: 'Men\'s Winter Coat',
    price: 189.99,
    image: male04,
    category: 'outerwear',
    gender: 'men',
    colors: ['black', 'grey'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewCount: 104,
    description: 'Warm and stylish winter coat to keep you comfortable in cold weather.',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 14,
    name: 'Men\'s Casual Look',
    price: 119.99,
    image: male05,
    category: 'casual',
    gender: 'men',
    colors: ['grey', 'black'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 69,
    description: 'Trendy casual outfit combination for a stylish everyday look.',
    isFeatured: true,
    isNew: false,
  },
  {
    id: 15,
    name: 'Men\'s Denim Jacket',
    price: 89.99,
    image: male06,
    category: 'jackets',
    gender: 'men',
    colors: ['denim', 'blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 82,
    description: 'Classic denim jacket that never goes out of style.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 16,
    name: 'Men\'s Polo Shirt',
    price: 39.99,
    image: male07,
    category: 'shirts',
    gender: 'men',
    colors: ['navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.3,
    reviewCount: 58,
    description: 'Classic polo shirt for a smart casual look.',
    isFeatured: false,
    isNew: false,
  },
  {
    id: 17,
    name: 'Men\'s Casual T-Shirt',
    price: 34.99,
    image: male08,
    category: 'shirts',
    gender: 'men',
    colors: ['white'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.2,
    reviewCount: 47,
    description: 'Comfortable everyday t-shirt with a modern fit.',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 18,
    name: 'Men\'s Summer Outfit',
    price: 79.99,
    image: male09,
    category: 'casual',
    gender: 'men',
    colors: ['white', 'blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.4,
    reviewCount: 63,
    description: 'Light and stylish outfit for warm summer days.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 19,
    name: 'Women\'s Bottom 1',
    price: 89.99,
    image: bottom1,
    category: 'bottoms',
    gender: 'women',
    colors: ['blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 10,
    description: 'Trendy women\'s bottom wear for versatile styling.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 20,
    name: 'Women\'s Bottom 2',
    price: 89.99,
    image: bottom2,
    category: 'bottoms',
    gender: 'women',
    colors: ['blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 10,
    description: 'Trendy women\'s bottom wear for versatile styling.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 21,
    name: 'Women\'s Bottom 3',
    price: 89.99,
    image: bottom3,
    category: 'bottoms',
    gender: 'women',
    colors: ['blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 10,
    description: 'Trendy women\'s bottom wear for versatile styling.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 22,
    name: 'Women\'s Bottom 4',
    price: 89.99,
    image: bottom4,
    category: 'bottoms',
    gender: 'women',
    colors: ['blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 10,
    description: 'Trendy women\'s bottom wear for versatile styling.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 23,
    name: 'Women\'s Bottom 5',
    price: 89.99,
    image: bottom5,
    category: 'bottoms',
    gender: 'women',
    colors: ['blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 10,
    description: 'Trendy women\'s bottom wear for versatile styling.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 24,
    name: 'Women\'s Dress 1',
    price: 119.99,
    image: dress1,
    category: 'dresses',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 12,
    description: 'Elegant women\'s dress for special occasions.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 25,
    name: 'Women\'s Dress 2',
    price: 119.99,
    image: dress2,
    category: 'dresses',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 12,
    description: 'Elegant women\'s dress for special occasions.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 26,
    name: 'Women\'s Top 3',
    price: 59.99,
    image: top3,
    category: 'tops',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.3,
    reviewCount: 8,
    description: 'Stylish women\'s top for everyday wear.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 27,
    name: 'Women\'s Top 4',
    price: 59.99,
    image: top4,
    category: 'tops',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.3,
    reviewCount: 8,
    description: 'Stylish women\'s top for everyday wear.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 28,
    name: 'Women\'s Top 5',
    price: 59.99,
    image: top5,
    category: 'tops',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.3,
    reviewCount: 8,
    description: 'Stylish women\'s top for everyday wear.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 29,
    name: 'Women\'s Top 111',
    price: 59.99,
    image: top111,
    category: 'tops',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.3,
    reviewCount: 8,
    description: 'Stylish women\'s top for everyday wear.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 30,
    name: 'Women\'s Top 222',
    price: 59.99,
    image: top222,
    category: 'tops',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.3,
    reviewCount: 8,
    description: 'Stylish women\'s top for everyday wear.',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 31,
    name: 'Women\'s Top 333',
    price: 59.99,
    image: top333,
    category: 'tops',
    gender: 'women',
    colors: ['white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.3,
    reviewCount: 8,
    description: 'Stylish women\'s top for everyday wear.',
    isFeatured: false,
    isNew: true,
  }
];

// Helper function to filter products
export const filterProducts = (options = {}) => {
  const {
    gender,
    category,
    featured,
    newArrivals,
    colors,
    sizes,
    minPrice,
    maxPrice,
    search,
  } = options;

  return products.filter(product => {
    // Filter by gender
    if (gender && product.gender !== gender) return false;
    
    // Filter by category
    if (category && product.category !== category) return false;
    
    // Filter by featured
    if (featured && !product.isFeatured) return false;
    
    // Filter by new arrivals
    if (newArrivals && !product.isNew) return false;
    
    // Filter by color
    if (colors && colors.length > 0 && !colors.some(color => product.colors.includes(color))) return false;
    
    // Filter by sizes
    if (sizes && sizes.length > 0 && !sizes.some(size => product.sizes.includes(size))) return false;
    
    // Filter by price range
    if (minPrice && product.price < minPrice) return false;
    if (maxPrice && product.price > maxPrice) return false;
    
    // Filter by search term
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });
};

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const getFeaturedProducts = (count = 4) => {
  return products
    .filter(product => product.isFeatured)
    .slice(0, count);
};

export const getNewArrivals = (count = 4) => {
  return products
    .filter(product => product.isNew)
    .slice(0, count);
};

export default products; 