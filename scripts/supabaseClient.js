// Supabase client configuration
// This file contains the Supabase client setup with security best practices

// We use environment variables or a secure configuration approach
// In a production environment, these should be set as environment variables
const SUPABASE_URL = 'https://yhqxpepihjeviashxykr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlocXhwZXBpaGpldmlhc2h4eWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjcwMTIsImV4cCI6MjA3MjMwMzAxMn0.mKiQSovB35_OO0q016J_LQ8tJkJQQo9gv-mSoJWI7vc';

// Create Supabase client (will be initialized after library loads)
let supabase;

// Initialize Supabase client when the library is ready
function initSupabase() {
  // Check if the Supabase library is available via the global window object
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized');
    // Dispatch an event to notify that Supabase is ready
    document.dispatchEvent(new CustomEvent('supabaseReady'));
  } else {
    console.log('Waiting for Supabase library to load...');
    // Try again in a moment
    setTimeout(initSupabase, 100);
  }
}

// Initialize when the script loads
initSupabase();

// Function to fetch all products with their main images (only active products)
async function fetchProducts() {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching products from Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)  // Only fetch active products
      .order('name');

    console.log('Supabase response:', { data, error });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Process products to ensure they have proper image URLs
    const processedProducts = data.map(product => ({
      ...product,
      main_image_url: product.image_url || 'Resources/bomba_centrifuga.jpeg'
    }));

    console.log('Products fetched successfully:', processedProducts);
    return processedProducts || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to fetch products by brand and category with their main images (only active products)
async function fetchProductsByFilters(brand = null, category = null) {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching products by filters from Supabase...', { brand, category });
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images!left(is_main, image_url)
      `)
      .eq('is_active', true);  // Only fetch active products

    if (brand) {
      query = query.eq('brand', brand);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error fetching products by filters:', error);
      return [];
    }

    // Process products to extract main image
    const productsWithImages = data.map(product => {
      // Find the main image
      const mainImage = product.product_images?.find(img => img.is_main) || 
                       product.product_images?.[0] || 
                       { image_url: product.image_url }; // fallback to old image_url field
      
      return {
        ...product,
        main_image_url: mainImage?.image_url || 'Resources/bomba_centrifuga.jpeg'
      };
    });

    console.log('Products by filters fetched successfully:', productsWithImages);
    return productsWithImages || [];
  } catch (error) {
    console.error('Error fetching products by filters:', error);
    return [];
  }
}

// Function to fetch unique brands
async function fetchBrands() {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching brands from Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('is_active', true)
      .not('brand', 'is', null)
      .order('brand');

    if (error) {
      console.error('Error fetching brands:', error);
      return [];
    }

    // Extract unique brands
    const brands = [...new Set(data.map(item => item.brand))];
    console.log('Brands fetched successfully:', brands);
    return brands || [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

// Function to fetch unique categories
async function fetchCategories() {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching categories from Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null)
      .order('category');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    console.log('Categories fetched successfully:', categories);
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Function to fetch products by brand and category with their main images
async function fetchProductsByFilters(brand = null, category = null) {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching products by filters from Supabase...', { brand, category });
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images!left(is_main, image_url)
      `)
      .eq('is_active', true);

    if (brand) {
      query = query.eq('brand', brand);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error fetching products by filters:', error);
      return [];
    }

    // Process products to extract main image
    const productsWithImages = data.map(product => {
      // Find the main image
      const mainImage = product.product_images?.find(img => img.is_main) || 
                       product.product_images?.[0] || 
                       { image_url: product.image_url }; // fallback to old image_url field
      
      return {
        ...product,
        main_image_url: mainImage?.image_url || 'Resources/bomba_centrifuga.jpeg'
      };
    });

    console.log('Products by filters fetched successfully:', productsWithImages);
    return productsWithImages || [];
  } catch (error) {
    console.error('Error fetching products by filters:', error);
    return [];
  }
}

// Function to fetch active banners
async function fetchBanners() {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching banners from Supabase...');
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString())
      .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching banners:', error);
      return [];
    }

    console.log('Banners fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

// Function to fetch product images for a specific product
async function fetchProductImages(productId) {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching product images from Supabase for product:', productId);
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)  // Only fetch active images
      .order('is_main', { ascending: false }); // Main image first

    if (error) {
      console.error('Error fetching product images:', error);
      return [];
    }

    console.log('Product images fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
}