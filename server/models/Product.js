import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price must be positive'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    stock: {
      type: Map,
      of: Map,
      default: {},
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNew: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search

const Product = mongoose.model('Product', productSchema);

export default Product;

