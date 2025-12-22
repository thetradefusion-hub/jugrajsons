import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { concerns, productTypes } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductFilterProps {
  selectedConcerns: string[];
  selectedCategories: string[];
  priceRange: [number, number];
  selectedRating: number | null;
  onConcernChange: (concerns: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number | null) => void;
  onClearAll: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedConcerns,
  selectedCategories,
  priceRange,
  selectedRating,
  onConcernChange,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClearAll,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['concern', 'category', 'price']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleConcernToggle = (slug: string) => {
    if (selectedConcerns.includes(slug)) {
      onConcernChange(selectedConcerns.filter((c) => c !== slug));
    } else {
      onConcernChange([...selectedConcerns, slug]);
    }
  };

  const handleCategoryToggle = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onCategoryChange(selectedCategories.filter((c) => c !== slug));
    } else {
      onCategoryChange([...selectedCategories, slug]);
    }
  };

  const activeFilterCount =
    selectedConcerns.length + selectedCategories.length + (selectedRating ? 1 : 0);

  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Health Concerns */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection('concern')}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="font-medium">Health Concerns</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                expandedSections.includes('concern') && 'rotate-180'
              )}
            />
          </button>
          {expandedSections.includes('concern') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 mt-3"
            >
              {concerns.map((concern) => (
                <label
                  key={concern.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedConcerns.includes(concern.slug)}
                    onCheckedChange={() => handleConcernToggle(concern.slug)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {concern.icon} {concern.name}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </div>

        {/* Product Categories */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="font-medium">Product Type</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                expandedSections.includes('category') && 'rotate-180'
              )}
            />
          </button>
          {expandedSections.includes('category') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 mt-3"
            >
              {productTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedCategories.includes(type.slug)}
                    onCheckedChange={() => handleCategoryToggle(type.slug)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {type.name}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="font-medium">Price Range</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                expandedSections.includes('price') && 'rotate-180'
              )}
            />
          </button>
          {expandedSections.includes('price') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-4"
            >
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceChange(value as [number, number])}
                min={0}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Rating */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="font-medium">Customer Rating</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                expandedSections.includes('rating') && 'rotate-180'
              )}
            />
          </button>
          {expandedSections.includes('rating') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 mt-3"
            >
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onRatingChange(selectedRating === rating ? null : rating)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedRating === rating
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <span className="text-ayurveda-gold">{'★'.repeat(rating)}</span>
                  <span className="text-muted-foreground">& up</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
