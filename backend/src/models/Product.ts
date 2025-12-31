import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  concern: string[];
  productType: string;
  tags: string[];
  inStock: boolean;
  stockCount: number;
  weight?: number; // Weight in kg for shipping
  ingredients: string[];
  benefits: string[];
  usage: string;
  whoShouldUse: string[];
  isBestseller: boolean;
  isNew: boolean;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  images: [String],
  category: { type: String, required: true },
  concern: [String],
  productType: { type: String, required: true },
  tags: [String],
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  weight: { type: Number, default: 0.1 }, // Weight in kg for shipping
  ingredients: [String],
  benefits: [String],
  usage: String,
  whoShouldUse: [String],
  isBestseller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  sku: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);

