import React from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductSortProps {
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
}

const sortOptions = [
  { value: 'newest-desc', label: 'Newest First', sortBy: 'newest', sortOrder: 'desc' as const },
  { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' as const },
  { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' as const },
  { value: 'rating-desc', label: 'Highest Rated', sortBy: 'rating', sortOrder: 'desc' as const },
  { value: 'popularity-desc', label: 'Most Popular', sortBy: 'popularity', sortOrder: 'desc' as const },
  { value: 'name-asc', label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' as const },
  { value: 'name-desc', label: 'Name: Z to A', sortBy: 'name', sortOrder: 'desc' as const }
]

const ProductSort: React.FC<ProductSortProps> = ({ sortBy, sortOrder, onSortChange }) => {
  const currentValue = `${sortBy}-${sortOrder}`
  const currentOption = sortOptions.find(option => option.value === currentValue)

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = sortOptions.find(opt => opt.value === e.target.value)
    if (option) {
      onSortChange(option.sortBy, option.sortOrder)
    }
  }

  return (
    <div className="relative">
      <select
        value={currentValue}
        onChange={handleSortChange}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

export default ProductSort