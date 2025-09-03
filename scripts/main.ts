// Main TypeScript file - contains all the application logic

// DOM Elements
const banner = document.getElementById('banner') as HTMLElement;
const dismissBanner = document.getElementById('dismiss-banner') as HTMLButtonElement;
const navigation = document.getElementById('navigation') as HTMLElement;
const mobileMenuToggle = document.getElementById('mobile-menu-toggle') as HTMLButtonElement;
const mobileMenu = document.getElementById('mobile-menu') as HTMLElement;
const mobileMenuClose = document.getElementById('mobile-menu-close') as HTMLButtonElement;
const contactButton = document.getElementById('contact-button') as HTMLButtonElement;
const showCalculator = document.getElementById('show-calculator') as HTMLButtonElement;
const calculatorSection = document.getElementById('calculadora') as HTMLElement;
const scrollToElements = document.querySelectorAll('[data-scroll-to]') as NodeListOf<HTMLButtonElement>;
const calculatorForm = document.getElementById('calculator-form') as HTMLFormElement;
const calculateButton = document.getElementById('calculate-button') as HTMLButtonElement;
const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
const calculatorResults = document.getElementById('calculator-results') as HTMLElement;
const contactForm = document.getElementById('contact-form') as HTMLFormElement;
const submitContact = document.getElementById('submit-contact') as HTMLButtonElement;
const requestQuote = document.getElementById('request-quote') as HTMLButtonElement;
const downloadResults = document.getElementById('download-results') as HTMLButtonElement;

// State
let dismissedBanner = false;
let showCalculatorSection = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize banner
  initBanner();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize scroll listeners
  initScrollListeners();
  
  // Initialize calculator
  initCalculator();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize quote request
  initQuoteRequest();
  
  // Initialize download results
  initDownloadResults();
});

// Banner functionality
function initBanner() {
  // Check if banner was previously dismissed
  const bannerDismissed = localStorage.getItem('bannerDismissed');
  if (bannerDismissed) {
    dismissedBanner = true;
    banner.classList.add('hidden');
  } else {
    // Show banner with sample content
    const bannerText = document.getElementById('banner-text') as HTMLParagraphElement;
    bannerText.textContent = 'Oferta especial: 10% de desconto em todos os serviços até ao final do mês!';
    banner.classList.remove('hidden');
  }
  
  // Dismiss banner handler
  dismissBanner.addEventListener('click', () => {
    banner.classList.add('hidden');
    dismissedBanner = true;
    localStorage.setItem('bannerDismissed', 'true');
  });
}

// Navigation functionality
function initNavigation() {
  // Handle scroll for navigation styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navigation.classList.add('scrolled');
    } else {
      navigation.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('open');
  });
  
  // Mobile menu close
  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
  
  // Close mobile menu when clicking on a link
  const mobileLinks = document.querySelectorAll('.navigation-mobile-link') as NodeListOf<HTMLButtonElement>;
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

// Scroll to section functionality
function initScrollListeners() {
  scrollToElements.forEach(element => {
    element.addEventListener('click', () => {
      const targetId = element.getAttribute('data-scroll-to');
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Close mobile menu if open
          mobileMenu.classList.remove('open');
        }
      }
    });
  });
  
  // Contact button scrolls to contact section
  contactButton.addEventListener('click', () => {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Show calculator button
  showCalculator.addEventListener('click', () => {
    calculatorSection.classList.remove('hidden');
    calculatorSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Calculator functionality
function initCalculator() {
  // Application type selection
  const applicationInputs = document.querySelectorAll('.application-input') as NodeListOf<HTMLInputElement>;
  applicationInputs.forEach(input => {
    input.addEventListener('change', () => {
      // Visual feedback for selected application
      const applicationContents = document.querySelectorAll('.application-content');
      applicationContents.forEach(content => {
        content.classList.remove('selected');
      });
      
      const selectedContent = input.parentElement?.querySelector('.application-content');
      if (selectedContent) {
        selectedContent.classList.add('selected');
      }
      
      // Show the appropriate section 2 based on application type
      const domesticQuestions = document.getElementById('domestic-questions');
      const poolQuestions = document.getElementById('pool-questions');
      const agricultureQuestions = document.getElementById('agriculture-questions');
      
      // Hide all section 2 elements first
      if (domesticQuestions) domesticQuestions.classList.add('hidden');
      if (poolQuestions) poolQuestions.classList.add('hidden');
      if (agricultureQuestions) agricultureQuestions.classList.add('hidden');
      
      // Show the relevant section 2 based on selection
      const selectedValue = input.value;
      if (selectedValue === 'domestic' && domesticQuestions) {
        domesticQuestions.classList.remove('hidden');
      } else if (selectedValue === 'pool' && poolQuestions) {
        poolQuestions.classList.remove('hidden');
      } else if (selectedValue === 'agriculture' && agricultureQuestions) {
        agricultureQuestions.classList.remove('hidden');
      }
    });
  });
  
  // Water source selection for domestic application
  const waterSourceSelect = document.getElementById('water-source') as HTMLSelectElement;
  if (waterSourceSelect) {
    waterSourceSelect.addEventListener('change', () => {
      const depthQuestion = document.getElementById('depth-question');
      if (depthQuestion) {
        if (waterSourceSelect.value === 'borehole' || waterSourceSelect.value === 'well') {
          depthQuestion.classList.remove('hidden');
        } else {
          depthQuestion.classList.add('hidden');
        }
      }
    });
  }
  
  // Calculate button
  calculateButton.addEventListener('click', () => {
    calculateResults();
  });
  
  // Reset button
  resetButton.addEventListener('click', () => {
    resetCalculator();
  });
}

// Calculate results
function calculateResults() {
  // Get form values
  const application = (document.querySelector('input[name="application"]:checked') as HTMLInputElement)?.value;
  const heightInput = document.getElementById('height') as HTMLInputElement;
  const flowInput = document.getElementById('flow') as HTMLInputElement;
  const distanceInput = document.getElementById('distance') as HTMLInputElement;
  const automaticCheckbox = document.getElementById('automatic') as HTMLInputElement;
  const installationCheckbox = document.getElementById('installation') as HTMLInputElement;
  
  const height = parseInt(heightInput.value) || 0;
  const flow = parseInt(flowInput.value) || 0;
  const distance = parseInt(distanceInput.value) || 0;
  const automatic = automaticCheckbox.checked;
  const installation = installationCheckbox.checked;
  
  // Validation
  if (!application || !height || !flow) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  
  // Calculate recommended power
  let recommendedPower = Math.ceil((height * flow * 1.2 + distance * 5) / 100) * 100;
  let recommendedModel = '';
  let estimatedPrice = 0;
  
  // Determine model based on application and power
  if (application === 'domestic') {
    if (recommendedPower <= 800) {
      recommendedModel = 'MG-Home 750W';
      estimatedPrice = 279;
    } else if (recommendedPower <= 1200) {
      recommendedModel = 'MG-1500 1500W';
      estimatedPrice = 459;
    } else {
      recommendedModel = 'Sistema MG-Press';
      estimatedPrice = 589;
    }
  } else if (application === 'pool') {
    recommendedModel = 'MG-Pool 800W';
    estimatedPrice = 329;
  } else if (application === 'agriculture') {
    if (recommendedPower <= 2000) {
      recommendedModel = 'MG-Agro 2200W';
      estimatedPrice = 679;
    } else {
      recommendedModel = 'MG-Pro 3000W';
      estimatedPrice = 899;
    }
  }
  
  // Update results display
  const recommendedModelElement = document.getElementById('recommended-model') as HTMLHeadingElement;
  const recommendedPowerElement = document.getElementById('recommended-power') as HTMLParagraphElement;
  const recommendedHeightElement = document.getElementById('recommended-height') as HTMLParagraphElement;
  const recommendedFlowElement = document.getElementById('recommended-flow') as HTMLParagraphElement;
  const recommendedPriceElement = document.getElementById('recommended-price') as HTMLDivElement;
  const budgetModelElement = document.getElementById('budget-model') as HTMLSpanElement;
  const budgetPumpPriceElement = document.getElementById('budget-pump-price') as HTMLSpanElement;
  const automaticItem = document.getElementById('automatic-item') as HTMLDivElement;
  const installationItem = document.getElementById('installation-item') as HTMLDivElement;
  const budgetTotalPriceElement = document.getElementById('budget-total-price') as HTMLSpanElement;
  
  recommendedModelElement.textContent = recommendedModel;
  recommendedPowerElement.textContent = `Potência: ${recommendedPower}W`;
  recommendedHeightElement.textContent = `Altura: ${height}m`;
  recommendedFlowElement.textContent = `Caudal: ${flow}L/min`;
  recommendedPriceElement.textContent = `€${estimatedPrice}`;
  budgetModelElement.textContent = recommendedModel;
  budgetPumpPriceElement.textContent = `€${estimatedPrice}`;
  
  // Show/hide additional items
  if (automatic) {
    automaticItem.classList.remove('hidden');
  } else {
    automaticItem.classList.add('hidden');
  }
  
  if (installation) {
    installationItem.classList.remove('hidden');
  } else {
    installationItem.classList.add('hidden');
  }
  
  // Calculate total price
  let totalPrice = estimatedPrice;
  if (automatic) totalPrice += 80;
  if (installation) totalPrice += 150;
  
  budgetTotalPriceElement.textContent = `€${totalPrice}`;
  
  // Show results
  calculatorResults.classList.remove('hidden');
  
  // Scroll to results
  calculatorResults.scrollIntoView({ behavior: 'smooth' });
}

// Reset calculator
function resetCalculator() {
  calculatorForm.reset();
  calculatorResults.classList.add('hidden');
  
  // Reset visual selection
  const applicationContents = document.querySelectorAll('.application-content');
  applicationContents.forEach(content => {
    content.classList.remove('selected');
  });
  
  // Hide all section 2 elements
  const domesticQuestions = document.getElementById('domestic-questions');
  const poolQuestions = document.getElementById('pool-questions');
  const agricultureQuestions = document.getElementById('agriculture-questions');
  
  if (domesticQuestions) domesticQuestions.classList.add('hidden');
  if (poolQuestions) poolQuestions.classList.add('hidden');
  if (agricultureQuestions) agricultureQuestions.classList.add('hidden');
}

// Contact form functionality
function initContactForm() {
  // Handle contact preference
  const contactPreferenceInputs = document.querySelectorAll('input[name="contactPreference"]') as NodeListOf<HTMLInputElement>;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const phoneInput = document.getElementById('phone') as HTMLInputElement;
  
  contactPreferenceInputs.forEach(input => {
    input.addEventListener('change', () => {
      const value = input.value;
      if (value === 'email') {
        emailInput.required = true;
        phoneInput.required = false;
      } else if (value === 'phone') {
        emailInput.required = false;
        phoneInput.required = true;
      }
    });
  });
  
  // Submit form
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitContactForm();
  });
}

// Submit contact form
function submitContactForm() {
  // Get form values
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const phone = (document.getElementById('phone') as HTMLInputElement).value;
  const location = (document.getElementById('location') as HTMLInputElement).value;
  const service = (document.getElementById('service') as HTMLSelectElement).value;
  const message = (document.getElementById('message') as HTMLTextAreaElement).value;
  const privacy = (document.getElementById('privacy') as HTMLInputElement).checked;
  
  // Validation
  if (!name || !message) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  
  const contactPreference = (document.querySelector('input[name="contactPreference"]:checked') as HTMLInputElement).value;
  if (contactPreference === 'email' && !email) {
    alert('Por favor, preencha o campo de email.');
    return;
  }
  
  if (contactPreference === 'phone' && !phone) {
    alert('Por favor, preencha o campo de telefone.');
    return;
  }
  
  if (!privacy) {
    alert('Por favor, aceite a política de privacidade.');
    return;
  }
  
  // In a real application, you would send this data to a server
  // For now, we'll just show a success message
  alert('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
  
  // Reset form
  contactForm.reset();
}

// Quote request functionality
function initQuoteRequest() {
  requestQuote.addEventListener('click', () => {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-fill contact form
      setTimeout(() => {
        const serviceSelect = document.getElementById('service') as HTMLSelectElement;
        const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;
        
        if (serviceSelect) {
          serviceSelect.value = 'quote';
        }
        
        if (messageTextarea && !messageTextarea.value) {
          messageTextarea.value = 'Solicito orçamento para o sistema calculado.\n\nPor favor contactem-me para mais detalhes.';
        }
      }, 500);
    }
  });
}

// Download results functionality
function initDownloadResults() {
  downloadResults.addEventListener('click', () => {
    alert('Funcionalidade de download em breve disponível.');
  });
}