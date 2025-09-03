// Admin JavaScript file - contains all the admin functionality

// NOTE: If you're getting "Permission denied" errors when uploading images,
// the issue might be with the RLS policies. The policies should use:
// - auth.role() = 'authenticated' (for JWT role)
// - OR auth.uid() IS NOT NULL (for any authenticated user)
// 
// Current policies might need to be updated to:
// CREATE POLICY "Allow authenticated inserts on product images"
// ON storage.objects FOR INSERT
// WITH CHECK ( bucket_id = 'product_images' AND auth.uid() IS NOT NULL );

// Supabase configuration
const SUPABASE_URL = 'https://yhqxpepihjeviashxykr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlocXhwZXBpaGpldmlhc2h4eWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjcwMTIsImV4cCI6MjA3MjMwMzAxMn0.mKiQSovB35_OO0q016J_LQ8tJkJQQo9gv-mSoJWI7vc';

// Create Supabase client (will be initialized after library loads)
let supabase;

// DOM Elements
const adminDashboard = document.getElementById('admin-dashboard');

// Admin sections
const productsSection = document.getElementById('products-section');
const bannersSection = document.getElementById('banners-section');

// Tabs
const productTab = document.querySelector('.admin-tab[data-tab="products"]');
const bannerTab = document.querySelector('.admin-tab[data-tab="banners"]');

// Product elements
const productSearch = document.getElementById('product-search');
const showInactiveToggle = document.getElementById('show-inactive-toggle');
const addProductButton = document.getElementById('add-product');
const productsTableBody = document.getElementById('products-table-body');

// Banner elements
const addBannerButton = document.getElementById('add-banner');
const bannersTableBody = document.getElementById('banners-table-body');

// Modals
const productModal = document.getElementById('product-modal');
const bannerModal = document.getElementById('banner-modal');

// Product form elements
const productForm = document.getElementById('product-form');
const productId = document.getElementById('product-id');
const productName = document.getElementById('product-name');
const productSubtitle = document.getElementById('product-subtitle');
const productBrand = document.getElementById('product-brand');
const productCategory = document.getElementById('product-category');
const productModel = document.getElementById('product-model');
const productPrice = document.getElementById('product-price');
const productWattage = document.getElementById('product-wattage');
const productPressure = document.getElementById('product-pressure');
const productHorsepower = document.getElementById('product-horsepower');
const productAmperage = document.getElementById('product-amperage');
const productDescription = document.getElementById('product-description');
const productMainImage = document.getElementById('product-main-image');
const mainImagePreview = document.getElementById('main-image-preview');
const productAdditionalImages = document.getElementById('product-additional-images');
const additionalImagesPreview = document.getElementById('additional-images-preview');
const productActive = document.getElementById('product-active');
const productStatusText = document.getElementById('product-status-text');
const saveProductButton = document.getElementById('save-product');
const cancelProductButton = document.getElementById('cancel-product');

// Banner form elements
const bannerForm = document.getElementById('banner-form');
const bannerId = document.getElementById('banner-id');
const bannerText = document.getElementById('banner-text');
const bannerStartDate = document.getElementById('banner-start-date');
const bannerEndDate = document.getElementById('banner-end-date');
const bannerColor = document.getElementById('banner-color');
const bannerActive = document.getElementById('banner-active');
const bannerStatusText = document.getElementById('banner-status-text');
const saveBannerButton = document.getElementById('save-banner');
const cancelBannerButton = document.getElementById('cancel-banner');

// State
let showInactiveProducts = false;
let currentProductImages = [];
let mainImageFile = null;
let additionalImageFiles = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase client
  initSupabase();
  
  // Set up event listeners
  setupEventListeners();
});

// Initialize Supabase client when the library is ready
function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized for admin page');
    // Check authentication after Supabase is ready
    checkAuth();
  } else {
    console.log('Waiting for Supabase library to load...');
    // Try again in a moment
    setTimeout(initSupabase, 100);
  }
}

// Check if user is authenticated
async function checkAuth() {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // User is logged in, show admin dashboard
      adminDashboard.style.display = 'block';
      
      // Load initial data
      loadProducts();
      loadBanners();
      loadBrandsAndCategories();
    } else {
      // User is not logged in, redirect to login page
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    // Redirect to login page on error
    window.location.href = 'login.html';
  }
}

// Set up event listeners
function setupEventListeners() {
  // Tabs
  productTab.addEventListener('click', () => switchTab('products'));
  bannerTab.addEventListener('click', () => switchTab('banners'));
  
  // Products
  productSearch.addEventListener('input', filterProducts);
  showInactiveToggle.addEventListener('click', toggleInactiveProducts);
  addProductButton.addEventListener('click', openProductModal);
  
  // Banners
  addBannerButton.addEventListener('click', openBannerModal);
  
  // Product form
  productForm.addEventListener('submit', saveProduct);
  cancelProductButton.addEventListener('click', closeProductModal);
  productActive.addEventListener('change', updateProductStatusText);
  productMainImage.addEventListener('change', handleMainImageChange);
  productAdditionalImages.addEventListener('change', handleAdditionalImagesChange);
  
  // Banner form
  bannerForm.addEventListener('submit', saveBanner);
  cancelBannerButton.addEventListener('click', closeBannerModal);
  bannerActive.addEventListener('change', updateBannerStatusText);
  
  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', closeAllModals);
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
    if (e.target === bannerModal) closeBannerModal();
  });
}

// Switch between tabs
function switchTab(tabName) {
  // Update active tab
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelector(`.admin-tab[data-tab="${tabName}"]`).classList.add('active');
  
  // Show active section
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(`${tabName}-section`).classList.add('active');
}

// Load products
async function loadProducts() {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('name');
    
    // If not showing inactive, filter by active only
    if (!showInactiveProducts) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    renderProducts(data);
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Erro ao carregar produtos: ' + error.message);
  }
}

// Render products in table
function renderProducts(products) {
  productsTableBody.innerHTML = '';
  
  if (products.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="6" style="text-align: center;">Nenhum produto encontrado</td>
    `;
    productsTableBody.appendChild(row);
    return;
  }
  
  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.brand || '-'}</td>
      <td>${product.category || '-'}</td>
      <td>${product.price ? `€${product.price.toFixed(2)}` : '-'}</td>
      <td>
        <span class="status-badge ${product.is_active ? 'status-active' : 'status-inactive'}">
          ${product.is_active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>
        <button class="btn btn-secondary" onclick="editProduct(${product.id})">Editar</button>
        <button class="btn ${product.is_active ? 'btn-danger' : 'btn-success'}" 
                onclick="toggleProductStatus(${product.id}, ${product.is_active})">
          ${product.is_active ? 'Desativar' : 'Ativar'}
        </button>
      </td>
    `;
    productsTableBody.appendChild(row);
  });
}

// Filter products
function filterProducts() {
  const searchTerm = productSearch.value.toLowerCase();
  
  // In a real implementation, you would filter the displayed products
  // For now, we'll just reload all products
  loadProducts();
}

// Toggle inactive products visibility
function toggleInactiveProducts() {
  showInactiveProducts = !showInactiveProducts;
  showInactiveToggle.textContent = showInactiveProducts ? 'Mostrar Ativos' : 'Mostrar Inativos';
  loadProducts();
}

// Load banners
async function loadBanners() {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    renderBanners(data);
  } catch (error) {
    console.error('Error loading banners:', error);
    alert('Erro ao carregar banners: ' + error.message);
  }
}

// Render banners in table
function renderBanners(banners) {
  bannersTableBody.innerHTML = '';
  
  if (banners.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="5" style="text-align: center;">Nenhum banner encontrado</td>
    `;
    bannersTableBody.appendChild(row);
    return;
  }
  
  banners.forEach(banner => {
    // Format dates
    const startDate = banner.start_date ? new Date(banner.start_date).toLocaleDateString('pt-PT') : '-';
    const endDate = banner.end_date ? new Date(banner.end_date).toLocaleDateString('pt-PT') : '-';
    
    // Check if banner is currently active
    const now = new Date();
    const isActive = banner.is_active && 
                    (!banner.start_date || new Date(banner.start_date) <= now) &&
                    (!banner.end_date || new Date(banner.end_date) >= now);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${banner.text}</td>
      <td>${startDate}</td>
      <td>${endDate}</td>
      <td>
        <span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">
          ${isActive ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>
        <button class="btn btn-secondary" onclick="editBanner(${banner.id})">Editar</button>
        <button class="btn ${banner.is_active ? 'btn-danger' : 'btn-success'}" 
                onclick="toggleBannerStatus(${banner.id}, ${banner.is_active})">
          ${banner.is_active ? 'Desativar' : 'Ativar'}
        </button>
      </td>
    `;
    bannersTableBody.appendChild(row);
  });
}

// Load brands and categories for autocomplete
async function loadBrandsAndCategories() {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    // Load brands
    const { data: brandsData, error: brandsError } = await supabase
      .from('products')
      .select('brand')
      .not('brand', 'is', null)
      .order('brand');
    
    if (brandsError) throw brandsError;
    
    // Get unique brands
    const brands = [...new Set(brandsData.map(item => item.brand))];
    
    // Update brands datalist
    const brandsList = document.getElementById('brands-list');
    brandsList.innerHTML = '';
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      brandsList.appendChild(option);
    });
    
    // Load categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)
      .order('category');
    
    if (categoriesError) throw categoriesError;
    
    // Get unique categories
    const categories = [...new Set(categoriesData.map(item => item.category))];
    
    // Update categories datalist
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      categoriesList.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading brands and categories:', error);
  }
}

// Open product modal for adding
function openProductModal() {
  // Reset form
  productForm.reset();
  productId.value = '';
  productActive.checked = true;
  updateProductStatusText();
  
  // Clear image previews
  mainImagePreview.style.display = 'none';
  additionalImagesPreview.innerHTML = '';
  
  // Clear image files
  mainImageFile = null;
  additionalImageFiles = [];
  currentProductImages = [];
  
  // Update modal title
  document.getElementById('product-modal-title').textContent = 'Adicionar Produto';
  
  // Show modal
  productModal.classList.add('visible');
}

// Close product modal
function closeProductModal() {
  productModal.classList.remove('visible');
}

// Open banner modal for adding
function openBannerModal() {
  // Reset form
  bannerForm.reset();
  bannerId.value = '';
  bannerActive.checked = true;
  updateBannerStatusText();
  
  // Set default color
  bannerColor.value = '#0000FF';
  
  // Update modal title
  document.getElementById('banner-modal-title').textContent = 'Adicionar Banner';
  
  // Show modal
  bannerModal.classList.add('visible');
}

// Close banner modal
function closeBannerModal() {
  bannerModal.classList.remove('visible');
}

// Close all modals
function closeAllModals() {
  closeProductModal();
  closeBannerModal();
}

// Update product status text
function updateProductStatusText() {
  productStatusText.textContent = productActive.checked ? 'Ativo' : 'Inativo';
}

// Update banner status text
function updateBannerStatusText() {
  bannerStatusText.textContent = bannerActive.checked ? 'Ativo' : 'Inativo';
}

// Handle main image change
function handleMainImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    mainImageFile = file;
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      mainImagePreview.style.backgroundImage = `url(${e.target.result})`;
      mainImagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Handle additional images change
function handleAdditionalImagesChange(e) {
  additionalImageFiles = Array.from(e.target.files);
  
  // Preview images
  additionalImagesPreview.innerHTML = '';
  additionalImageFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.createElement('div');
      preview.className = 'image-preview';
      preview.style.backgroundImage = `url(${e.target.result})`;
      additionalImagesPreview.appendChild(preview);
    };
    reader.readAsDataURL(file);
  });
}

// Save product
async function saveProduct(e) {
  e.preventDefault();
  
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    console.log('Saving product...');
    
    // Explicitly check authentication status before saving
    console.log('Checking authentication status before saving product...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication check failed:', authError);
      throw new Error('Failed to verify authentication status: ' + authError.message);
    }
    
    if (!authData || !authData.session) {
      console.error('No active session found');
      throw new Error('No active session. Please log in again.');
    }
    
    console.log('User authenticated for product saving:', authData.session.user.id);
    
    // Validate that we have at least one image for new products
    if (!mainImageFile && additionalImageFiles.length === 0 && currentProductImages.length === 0 && !productId.value) {
      alert('Por favor, adicione pelo menos uma imagem para o produto.');
      return;
    }
    
    // Get form data
    const productData = {
      name: productName.value,
      subtitle: productSubtitle.value,
      brand: productBrand.value,
      category: productCategory.value,
      model_number: productModel.value,
      price: productPrice.value ? parseFloat(productPrice.value) : 0,
      wattage: productWattage.value ? parseInt(productWattage.value) : 0,
      pressure_bar: productPressure.value ? parseFloat(productPressure.value) : 0,
      horsepower: productHorsepower.value ? parseFloat(productHorsepower.value) : 0,
      amperage: productAmperage.value ? parseFloat(productAmperage.value) : 0,
      description: productDescription.value, // Store raw text, convert to HTML when displaying
      is_active: productActive.checked
    };
    
    console.log('Product data:', productData);
    
    let productIdValue = productId.value;
    
    // Save product to database
    if (productIdValue) {
      // Update existing product
      console.log('Updating existing product with ID:', productIdValue);
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productIdValue)
        .select();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      productIdValue = data[0].id;
      console.log('Product updated successfully with ID:', productIdValue);
    } else {
      // Create new product
      console.log('Creating new product');
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      productIdValue = data[0].id;
      console.log('Product created successfully with ID:', productIdValue);
    }
    
    // Handle image uploads
    if (mainImageFile || additionalImageFiles.length > 0) {
      console.log('Handling image uploads for product ID:', productIdValue);
      await handleProductImages(productIdValue);
    }
    
    // Close modal and refresh products
    closeProductModal();
    loadProducts();
    loadBrandsAndCategories();
    
    console.log('Product saved successfully');
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Erro ao salvar produto: ' + error.message);
  }
}

// Handle product images (upload new ones and manage existing ones)
async function handleProductImages(productIdValue) {
  try {
    console.log('Handling product images for product ID:', productIdValue);
    
    // Explicitly check authentication status before handling images
    console.log('Checking authentication status before handling images...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication check failed:', authError);
      throw new Error('Failed to verify authentication status: ' + authError.message);
    }
    
    if (!authData || !authData.session) {
      console.error('No active session found');
      throw new Error('No active session. Please log in again.');
    }
    
    console.log('User authenticated for image handling:', authData.session.user.id);
    
    // If we're editing and have existing images, we need to handle them
    if (productId.value) {
      // Get current images from database
      const { data: existingImages, error: fetchError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productIdValue);
      
      if (fetchError) {
        console.error('Error fetching existing images:', fetchError);
        throw fetchError;
      }
      
      console.log('Existing images found:', existingImages);
      // For now, we'll keep existing images and add new ones
      // In a more complex implementation, we might want to allow deleting images
    }
    
    // Upload new images
    if (mainImageFile || additionalImageFiles.length > 0) {
      console.log('Uploading new images...');
      await uploadProductImages(productIdValue);
    }
  } catch (error) {
    console.error('Error handling product images:', error);
    throw error;
  }
}

// Upload product images
async function uploadProductImages(productId) {
  try {
    console.log('Uploading images for product:', productId);
    
    // Explicitly check authentication status before uploading
    console.log('Checking authentication status...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication check failed:', authError);
      throw new Error('Failed to verify authentication status: ' + authError.message);
    }
    
    if (!authData || !authData.session) {
      console.error('No active session found');
      throw new Error('No active session. Please log in again.');
    }
    
    console.log('User authenticated:', authData.session.user.id);
    console.log('Session details:', authData.session);
    console.log('User role:', authData.session.user.role);
    
    // Test authentication with a simple query to verify RLS is working
    console.log('Testing authentication with a simple query...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Authentication test failed:', testError);
      throw new Error('Authentication test failed: ' + testError.message);
    }
    
    console.log('Authentication test passed:', testData);
    
    // Upload main image
    if (mainImageFile) {
      const fileExtension = mainImageFile.name.split('.').pop();
      const fileName = `${productId}/main_${Date.now()}.${fileExtension}`;
      
      console.log('Uploading main image:', fileName);
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products_images')
        .upload(fileName, mainImageFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading main image:', uploadError);
        console.error('Upload error details:', {
          message: uploadError.message,
          status: uploadError.status,
          statusText: uploadError.statusText,
          details: uploadError.details
        });
        if (uploadError.message.includes('row-level security')) {
          throw new Error('Permission denied: You do not have permission to upload files to the storage bucket. Please check bucket policies.');
        }
        throw uploadError;
      }
      
      console.log('Main image uploaded successfully:', uploadData);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products_images')
        .getPublicUrl(fileName);
      
      console.log('Main image public URL:', publicUrl);
      
      // Save image record with is_main = true
      const { data: imageRecord, error: recordError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: publicUrl,
          is_main: true,
          is_active: true
        })
        .select();
      
      if (recordError) {
        console.error('Error saving main image record:', recordError);
        throw recordError;
      }
      
      console.log('Main image record saved:', imageRecord);
    }
    
    // Upload additional images
    for (let i = 0; i < additionalImageFiles.length; i++) {
      const file = additionalImageFiles[i];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${productId}/img_${i}_${Date.now()}.${fileExtension}`;
      
      console.log('Uploading additional image:', fileName);
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading additional image:', uploadError);
        console.error('Upload error details:', {
          message: uploadError.message,
          status: uploadError.status,
          statusText: uploadError.statusText,
          details: uploadError.details
        });
        if (uploadError.message.includes('row-level security')) {
          throw new Error('Permission denied: You do not have permission to upload files to the storage bucket. Please check bucket policies.');
        }
        throw uploadError;
      }
      
      console.log('Additional image uploaded successfully:', uploadData);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products_images')
        .getPublicUrl(fileName);
      
      console.log('Additional image public URL:', publicUrl);
      
      // Save image record with is_main = false
      const { data: imageRecord, error: recordError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: publicUrl,
          is_main: false,
          is_active: true
        })
        .select();
      
      if (recordError) {
        console.error('Error saving additional image record:', recordError);
        throw recordError;
      }
      
      console.log('Additional image record saved:', imageRecord);
    }
    
    console.log('All images uploaded successfully');
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

// Edit product
async function editProduct(id) {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    // Load product data
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (productError) throw productError;
    
    // Load product images
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', id)
      .order('is_main', { ascending: false });
    
    if (imagesError) throw imagesError;
    
    // Fill form
    productId.value = product.id;
    productName.value = product.name;
    productSubtitle.value = product.subtitle || '';
    productBrand.value = product.brand || '';
    productCategory.value = product.category || '';
    productModel.value = product.model_number || '';
    productPrice.value = product.price || '';
    productWattage.value = product.wattage || '';
    productPressure.value = product.pressure_bar || '';
    productHorsepower.value = product.horsepower || '';
    productAmperage.value = product.amperage || '';
    productDescription.value = product.description || '';
    productActive.checked = product.is_active;
    updateProductStatusText();
    
    // Store current images
    currentProductImages = images;
    
    // Preview existing images
    const mainImage = images.find(img => img.is_main);
    if (mainImage) {
      mainImagePreview.style.backgroundImage = `url(${mainImage.image_url})`;
      mainImagePreview.style.display = 'block';
    } else {
      mainImagePreview.style.display = 'none';
    }
    
    // Preview additional images
    additionalImagesPreview.innerHTML = '';
    const additionalImages = images.filter(img => !img.is_main);
    additionalImages.forEach(img => {
      const preview = document.createElement('div');
      preview.className = 'image-preview';
      preview.style.backgroundImage = `url(${img.image_url})`;
      additionalImagesPreview.appendChild(preview);
    });
    
    // Clear image files (user can upload new ones if they want)
    mainImageFile = null;
    additionalImageFiles = [];
    
    // Update modal title
    document.getElementById('product-modal-title').textContent = 'Editar Produto';
    
    // Show modal
    productModal.classList.add('visible');
  } catch (error) {
    console.error('Error loading product:', error);
    alert('Erro ao carregar produto: ' + error.message);
  }
}

// Toggle product status
async function toggleProductStatus(id, isActive) {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    const newStatus = !isActive;
    
    await supabase
      .from('products')
      .update({ is_active: newStatus })
      .eq('id', id);
    
    // Refresh products
    loadProducts();
  } catch (error) {
    console.error('Error toggling product status:', error);
    alert('Erro ao atualizar status do produto: ' + error.message);
  }
}

// Save banner
async function saveBanner(e) {
  e.preventDefault();
  
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    // Get form data
    const bannerData = {
      text: bannerText.value,
      start_date: bannerStartDate.value ? new Date(bannerStartDate.value).toISOString() : null,
      end_date: bannerEndDate.value ? new Date(bannerEndDate.value).toISOString() : null,
      color_hex: bannerColor.value,
      is_active: bannerActive.checked
    };
    
    if (bannerId.value) {
      // Update existing banner
      await supabase
        .from('banners')
        .update(bannerData)
        .eq('id', bannerId.value);
    } else {
      // Create new banner
      await supabase
        .from('banners')
        .insert([bannerData]);
    }
    
    // Close modal and refresh banners
    closeBannerModal();
    loadBanners();
  } catch (error) {
    console.error('Error saving banner:', error);
    alert('Erro ao salvar banner: ' + error.message);
  }
}

// Edit banner
async function editBanner(id) {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    // Load banner data
    const { data: banner, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Fill form
    bannerId.value = banner.id;
    bannerText.value = banner.text;
    bannerStartDate.value = banner.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : '';
    bannerEndDate.value = banner.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : '';
    bannerColor.value = banner.color_hex || '#0000FF';
    bannerActive.checked = banner.is_active;
    updateBannerStatusText();
    
    // Update modal title
    document.getElementById('banner-modal-title').textContent = 'Editar Banner';
    
    // Show modal
    bannerModal.classList.add('visible');
  } catch (error) {
    console.error('Error loading banner:', error);
    alert('Erro ao carregar banner: ' + error.message);
  }
}

// Toggle banner status
async function toggleBannerStatus(id, isActive) {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    const newStatus = !isActive;
    
    await supabase
      .from('banners')
      .update({ is_active: newStatus })
      .eq('id', id);
    
    // Refresh banners
    loadBanners();
  } catch (error) {
    console.error('Error toggling banner status:', error);
    alert('Erro ao atualizar status do banner: ' + error.message);
  }
}

// Logout function
async function logout() {
  // Wait for Supabase to be initialized
  while (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

// Format text in description textarea
function formatText(format) {
  const textarea = document.getElementById('product-description');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(end);
  
  let formattedText = '';
  
  switch (format) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'underline':
      formattedText = `__${selectedText}__`;
      break;
  }
  
  textarea.value = beforeText + formattedText + afterText;
  textarea.focus();
  textarea.setSelectionRange(start + 2, start + formattedText.length - 2);
}

// Insert line break in description textarea
function insertLineBreak() {
  const textarea = document.getElementById('product-description');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(end);
  
  textarea.value = beforeText + '\n' + afterText;
  textarea.focus();
  textarea.setSelectionRange(start + 1, start + 1);
}

// Convert markdown-like formatting to HTML for display
function convertDescriptionToHtml(description) {
  if (!description) return '';
  
  // Convert line breaks to <br> tags
  let html = description.replace(/\n/g, '<br>');
  
  // Convert bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic (*text*)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert underline (__text__)
  html = html.replace(/__(.*?)__/g, '<u>$1</u>');
  
  return html;
}

// Make functions available globally
window.editProduct = editProduct;
window.toggleProductStatus = toggleProductStatus;
window.editBanner = editBanner;
window.toggleBannerStatus = toggleBannerStatus;
window.formatText = formatText;
window.insertLineBreak = insertLineBreak;