import React, { createContext, useContext, useState } from 'react'

type Language = 'en' | 'km'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.brands': 'Brands',
    'nav.deals': 'Deals',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.orders': 'Orders',
    'nav.wishlist': 'Wishlist',
    'nav.cart': 'Cart',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.total': 'Total',
    'common.subtotal': 'Subtotal',
    'common.shipping': 'Shipping',
    'common.tax': 'Tax',
    'common.discount': 'Discount',
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.addToWishlist': 'Add to Wishlist',
    'product.removeFromWishlist': 'Remove from Wishlist',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.reviews': 'Reviews',
    'product.rating': 'Rating',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.features': 'Features',
    
    // Cart
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.proceedToCheckout': 'Proceed to Checkout',
    'cart.removeItem': 'Remove Item',
    'cart.updateQuantity': 'Update Quantity',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.billingAddress': 'Billing Address',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.orderSummary': 'Order Summary',
    'checkout.placeOrder': 'Place Order',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.loginWithGoogle': 'Login with Google',
    'auth.loginWithFacebook': 'Login with Facebook',
    
    // Footer
    'footer.aboutUs': 'About Us',
    'footer.customerService': 'Customer Service',
    'footer.quickLinks': 'Quick Links',
    'footer.followUs': 'Follow Us',
    'footer.newsletter': 'Newsletter',
    'footer.subscribeNewsletter': 'Subscribe to our newsletter',
    'footer.allRightsReserved': 'All rights reserved',
  },
  km: {
    // Navigation
    'nav.home': 'ទំព័រដើម',
    'nav.products': 'ផលិតផល',
    'nav.categories': 'ប្រភេទ',
    'nav.brands': 'ម៉ាក',
    'nav.deals': 'ការផ្តល់ជូន',
    'nav.contact': 'ទំនាក់ទំនង',
    'nav.login': 'ចូល',
    'nav.register': 'ចុះឈ្មោះ',
    'nav.profile': 'ប្រវត្តិរូប',
    'nav.orders': 'ការបញ្ជាទិញ',
    'nav.wishlist': 'បញ្ជីចង់បាន',
    'nav.cart': 'រទេះ',
    'nav.logout': 'ចេញ',
    'nav.admin': 'អ្នកគ្រប់គ្រង',
    
    // Common
    'common.loading': 'កំពុងផ្ទុក...',
    'common.error': 'កំហុស',
    'common.success': 'ជោគជ័យ',
    'common.cancel': 'បោះបង់',
    'common.save': 'រក្សាទុក',
    'common.delete': 'លុប',
    'common.edit': 'កែសម្រួល',
    'common.view': 'មើល',
    'common.search': 'ស្វែងរក',
    'common.filter': 'តម្រង',
    'common.sort': 'តម្រៀប',
    'common.price': 'តម្លៃ',
    'common.quantity': 'បរិមាណ',
    'common.total': 'សរុប',
    'common.subtotal': 'សរុបរង',
    'common.shipping': 'ការដឹកជញ្ជូន',
    'common.tax': 'ពន្ធ',
    'common.discount': 'បញ្ចុះតម្លៃ',
    
    // Product
    'product.addToCart': 'បន្ថែមទៅរទេះ',
    'product.addToWishlist': 'បន្ថែមទៅបញ្ជីចង់បាន',
    'product.removeFromWishlist': 'យកចេញពីបញ្ជីចង់បាន',
    'product.inStock': 'មានស្តុក',
    'product.outOfStock': 'អស់ស្តុក',
    'product.reviews': 'ការវាយតម្លៃ',
    'product.rating': 'ការដាក់ពិន្ទុ',
    'product.description': 'ការពិពណ៌នា',
    'product.specifications': 'លក្ខណៈពិសេស',
    'product.features': 'មុខងារ',
    
    // Cart
    'cart.empty': 'រទេះរបស់អ្នកទទេ',
    'cart.continueShopping': 'បន្តទិញ',
    'cart.proceedToCheckout': 'បន្តទៅការទូទាត់',
    'cart.removeItem': 'យកចេញ',
    'cart.updateQuantity': 'ធ្វើបច្ចុប្បន្នភាពបរិមាណ',
    
    // Checkout
    'checkout.title': 'ការទូទាត់',
    'checkout.shippingAddress': 'អាសយដ្ឋានដឹកជញ្ជូន',
    'checkout.billingAddress': 'អាសយដ្ឋានវិក្កយបត្រ',
    'checkout.paymentMethod': 'វិធីសាស្ត្រទូទាត់',
    'checkout.orderSummary': 'សង្ខេបការបញ្ជាទិញ',
    'checkout.placeOrder': 'ដាក់ការបញ្ជាទិញ',
    
    // Auth
    'auth.email': 'អ៊ីមែល',
    'auth.password': 'ពាក្យសម្ងាត់',
    'auth.confirmPassword': 'បញ្ជាក់ពាក្យសម្ងាត់',
    'auth.firstName': 'នាមខ្លួន',
    'auth.lastName': 'នាមត្រកូល',
    'auth.login': 'ចូល',
    'auth.register': 'ចុះឈ្មោះ',
    'auth.forgotPassword': 'ភ្លេចពាក្យសម្ងាត់?',
    'auth.resetPassword': 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
    'auth.loginWithGoogle': 'ចូលជាមួយ Google',
    'auth.loginWithFacebook': 'ចូលជាមួយ Facebook',
    
    // Footer
    'footer.aboutUs': 'អំពីយើង',
    'footer.customerService': 'សេវាកម្មអតិថិជន',
    'footer.quickLinks': 'តំណភ្ជាប់រហ័ស',
    'footer.followUs': 'តាមដានយើង',
    'footer.newsletter': 'ព្រឹត្តិបត្រ',
    'footer.subscribeNewsletter': 'ជាវព្រឹត្តិបត្ររបស់យើង',
    'footer.allRightsReserved': 'រក្សាសិទ្ធិគ្រប់យ៉ាង',
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    return savedLanguage || 'en'
  })

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}