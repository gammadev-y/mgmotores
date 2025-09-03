document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS with your user ID
  (function() {
    emailjs.init("aak-xyaLV1yjnLQA5");
  })();
  
  // --- DOM Elements ---
  const nav = document.getElementById('navigation');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const scrollLinks = document.querySelectorAll('[data-scroll-to]');
  const contactButton = document.getElementById('contact-button');
  const showCalculatorButton = document.getElementById('show-calculator');
  const calculatorSection = document.getElementById('calculadora');
  const contactForm = document.getElementById('contact-form');
  const banner = document.getElementById('banner');
  const dismissBanner = document.getElementById('dismiss-banner');
  const adminLink = document.getElementById('admin-link');
  const calculateButton = document.getElementById('calculate-button');
  const analyzeButton = document.getElementById('analyze-button');
  
  // --- Product Section Elements ---
  const featuredProductsContainer = document.getElementById('featured-products-grid');
  const productPopup = document.getElementById('product-popup');
  const popupDetails = document.getElementById('popup-details');
  const popupClose = document.getElementById('popup-close');
  const brandFiltersContainer = document.getElementById('brand-filters');
  const categoryFiltersContainer = document.getElementById('category-filters');

  // --- State ---
  let allProducts = [];
  let activeBrand = null;
  let activeCategory = null;

  // --- Initialization ---
  function init() {
    initNavigation();
    initScrollListeners();
    initCalculator();
    initContactForm();
    initBrandLogosCarousel();
    initProductsSection();
    initTopBanner();
    checkAdminAuth();
  }

  // --- Navigation ---
  function initNavigation() {
    if (!nav) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    }
  }

  function initScrollListeners() {
     scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
        }
      });
    });

    if (contactButton) {
      contactButton.addEventListener('click', () => {
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // --- Other Sections ---
  function initCalculator() {
    if (showCalculatorButton) {
      showCalculatorButton.addEventListener('click', () => {
        if(calculatorSection) calculatorSection.classList.remove('hidden');
        if(calculatorSection) calculatorSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
    
    // Application type selection
    const applicationInputs = document.querySelectorAll('.application-input');
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
    const waterSourceSelect = document.getElementById('water-source');
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
    
    // Reset button
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        resetCalculator();
      });
    }
    
    // Add event listeners for calculator buttons
  if (calculateButton) {
    calculateButton.addEventListener('click', () => {
      fillContactFormWithCalculatorData();
      displayContactMessage();
    });
  }
  
  if (analyzeButton) {
    analyzeButton.addEventListener('click', () => {
      fillContactFormWithCalculatorData();
      displayContactMessage();
    });
  }
  }
  
  // Reset calculator
  function resetCalculator() {
    const calculatorForm = document.getElementById('calculator-form');
    if (calculatorForm) calculatorForm.reset();
    
    const calculatorResults = document.getElementById('calculator-results');
    if (calculatorResults) calculatorResults.classList.add('hidden');
    
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
  
  // Function to collect calculator form data and fill contact form message
  function fillContactFormWithCalculatorData() {
    const calculatorForm = document.getElementById('calculator-form');
    const messageTextarea = document.getElementById('message');
    const serviceSelect = document.getElementById('service');
    
    if (!calculatorForm || !messageTextarea) return;
    
    // Set service type based on which button was clicked
    if (serviceSelect) {
      serviceSelect.value = 'quote';
    }
    
    // Collect form data
    let message = 'Solicita\u00e7\u00e3o de or\u00e7amento atrav\u00e9s do assistente de c\u00e1lculo:\n\n';
    
    // Step 1: Application Type
    const applicationType = calculatorForm.querySelector('input[name="application"]:checked');
    if (applicationType) {
      const applicationLabels = {
        'domestic': 'Dom\u00e9stica',
        'pool': 'Piscina',
        'agriculture': 'Agricultura'
      };
      message += `Tipo de Aplica\u00e7\u00e3o: ${applicationLabels[applicationType.value] || applicationType.value}\n`;
    }
    
    // Step 2: Application-specific questions
    if (applicationType) {
      message += '\n';
      
      switch (applicationType.value) {
        case 'domestic':
          // Water source
          const waterSource = document.getElementById('water-source');
          if (waterSource && waterSource.value) {
            const waterSourceLabels = {
              'borehole': 'Furo',
              'well': 'Po\u00e7o',
              'tank': 'Dep\u00f3sito',
              'mains': 'Rede P\u00fablica'
            };
            message += `Origem da \u00c1gua: ${waterSourceLabels[waterSource.value] || waterSource.value}\n`;
            
            // Depth if applicable
            if ((waterSource.value === 'borehole' || waterSource.value === 'well') && 
                document.getElementById('depth') && document.getElementById('depth').value) {
              message += `Profundidade: ${document.getElementById('depth').value} metros\n`;
            }
          }
          
          // Water usage
          const pressureTaps = document.getElementById('pressure-taps');
          const smallGarden = document.getElementById('small-garden');
          const largeGarden = document.getElementById('large-garden');
          const poolFilling = document.getElementById('pool-filling');
          
          let usage = [];
          if (pressureTaps && pressureTaps.checked) usage.push('Press\u00e3o para torneiras');
          if (smallGarden && smallGarden.checked) usage.push('Rega de jardim (pequeno/m\u00e9dio)');
          if (largeGarden && largeGarden.checked) usage.push('Rega de jardim (grande/relvado)');
          if (poolFilling && poolFilling.checked) usage.push('Encher uma piscina');
          
          if (usage.length > 0) {
            message += `Uso da \u00c1gua: ${usage.join(', ')}\n`;
          }
          
          // Floors
          const floors = document.getElementById('floors');
          if (floors && floors.value) {
            const floorsLabels = {
              '1': '1 (R\u00e9s-do-ch\u00e3o)',
              '2': '2 Pisos',
              '3': '3 ou mais Pisos'
            };
            message += `N\u00famero de Pisos: ${floorsLabels[floors.value] || floors.value}\n`;
          }
          
          // Constant pressure
          const constantPressure = document.getElementById('constant-pressure');
          const notPriority = document.getElementById('not-priority');
          if (constantPressure && constantPressure.checked) {
            message += 'Press\u00e3o Constante: Sim, quero um sistema autom\u00e1tico\n';
          } else if (notPriority && notPriority.checked) {
            message += 'Press\u00e3o Constante: N\u00e3o \u00e9 priorit\u00e1rio\n';
          }
          break;
          
        case 'pool':
          // Pool volume
          const poolVolume = document.getElementById('pool-volume');
          if (poolVolume && poolVolume.value) {
            message += `Volume da Piscina: ${poolVolume.value} m\u00b3\n`;
          }
          
          // Pump functions
          const filtration = document.getElementById('filtration');
          const heating = document.getElementById('heating');
          const waterEffects = document.getElementById('water-effects');
          const cleaning = document.getElementById('cleaning');
          
          let functions = [];
          if (filtration && filtration.checked) functions.push('Filtra\u00e7\u00e3o e circula\u00e7\u00e3o');
          if (heating && heating.checked) functions.push('Aquecimento');
          if (waterEffects && waterEffects.checked) functions.push('Efeitos de \u00e1gua');
          if (cleaning && cleaning.checked) functions.push('Limpeza');
          
          if (functions.length > 0) {
            message += `Fun\u00e7\u00f5es da Bomba: ${functions.join(', ')}\n`;
          }
          
          // Pump location
          const pumpLocation = document.getElementById('pump-location');
          if (pumpLocation && pumpLocation.value) {
            const locationLabels = {
              'above': 'Acima do n\u00edvel da \u00e1gua',
              'below': 'Abaixo do n\u00edvel da \u00e1gua'
            };
            message += `Localiza\u00e7\u00e3o da Bomba: ${locationLabels[pumpLocation.value] || pumpLocation.value}\n`;
          }
          
          // Distance
          const poolDistance = document.getElementById('pool-distance');
          if (poolDistance && poolDistance.value) {
            message += `Dist\u00e2ncia da Bomba \u00e0 Piscina: ${poolDistance.value} metros\n`;
          }
          break;
          
        case 'agriculture':
          // Agricultural water source
          const agriWaterSource = document.getElementById('agri-water-source');
          if (agriWaterSource && agriWaterSource.value) {
            const agriWaterSourceLabels = {
              'borehole': 'Furo',
              'well': 'Po\u00e7o',
              'stream': 'Ribeiro ou Barragem',
              'large-tank': 'Dep\u00f3sito de grande capacidade'
            };
            message += `Origem da \u00c1gua: ${agriWaterSourceLabels[agriWaterSource.value] || agriWaterSource.value}\n`;
          }
          
          // Irrigation type
          const drip = document.getElementById('drip');
          const sprinkler = document.getElementById('sprinkler');
          const surface = document.getElementById('surface');
          
          let irrigationTypes = [];
          if (drip && drip.checked) irrigationTypes.push('Gota-a-gota');
          if (sprinkler && sprinkler.checked) irrigationTypes.push('Aspers\u00e3o ou micro-aspers\u00e3o');
          if (surface && surface.checked) irrigationTypes.push('Rega de superf\u00edcie');
          
          if (irrigationTypes.length > 0) {
            message += `Tipo de Rega: ${irrigationTypes.join(', ')}\n`;
          }
          
          // Irrigation area
          const irrigationArea = document.getElementById('irrigation-area');
          const areaUnit = document.getElementById('area-unit');
          if (irrigationArea && irrigationArea.value) {
            let unit = 'hectares';
            if (areaUnit && areaUnit.value === 'square-meters') {
              unit = 'm\u00b2';
            }
            message += `\u00c1rea a Regar: ${irrigationArea.value} ${unit}\n`;
          }
          
          // Elevation
          const elevation = document.getElementById('elevation');
          if (elevation && elevation.value) {
            const elevationLabels = {
              'none': 'N\u00e3o',
              'up-to-10': 'Sim, at\u00e9 10 metros',
              'over-10': 'Sim, mais de 10 metros'
            };
            message += `Desn\u00edvel: ${elevationLabels[elevation.value] || elevation.value}\n`;
          }
          
          // Electricity
          const electricity = document.getElementById('electricity');
          if (electricity && electricity.value) {
            const electricityLabels = {
              'single-phase': 'Sim (monof\u00e1sica)',
              'three-phase': 'Sim (trif\u00e1sica)',
              'none': 'N\u00e3o (necessito de solu\u00e7\u00e3o solar ou a gerador)'
            };
            message += `Eletricidade no Local: ${electricityLabels[electricity.value] || electricity.value}\n`;
          }
          break;
      }
    }
    
    // Step 3: Additional Service Details
    message += '\nDetalhes Adicionais:\n';
    
    // Installation service
    const installationService = document.getElementById('installation-service');
    if (installationService && installationService.checked) {
      message += '- Incluir servi\u00e7o de instala\u00e7\u00e3o\n';
    }
    
    const visitService = document.getElementById('visit-service');
    if (visitService && visitService.checked) {
      message += '- Visita ao local para avalia\u00e7\u00e3o\n';
    }
    
    // Observations
    const observations = document.getElementById('observations');
    if (observations && observations.value) {
      message += `\nObserva\u00e7\u00f5es:\n${observations.value}\n`;
    }
    
    // Fill the message textarea
    messageTextarea.value = message;
  }
  
  // Function to display the red text under "Envie-nos uma Mensagem"
  function displayContactMessage() {
    const contactSection = document.getElementById('contacto');
    const contactCardTitle = document.querySelector('.contact-card-title');
    
    if (contactSection && contactCardTitle) {
      // Create the message element if it doesn't exist
      let messageElement = document.getElementById('contact-prompt-message');
      if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.id = 'contact-prompt-message';
        messageElement.textContent = 'Preencha os seus dados para enviar mensagem';
        contactCardTitle.parentNode.insertBefore(messageElement, contactCardTitle.nextSibling);
      }
      
      // Ensure the message is visible
      messageElement.style.display = 'block';
      messageElement.style.height = 'auto';
      
      // Scroll to the contact section
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Focus on the name input
      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
        }, 500);
      }
      
      // Resize the message textarea to fit its content
      const messageTextarea = document.getElementById('message');
      if (messageTextarea) {
        // Reset height to auto to get the scrollHeight
        messageTextarea.style.height = 'auto';
        // Set height to scrollHeight to fit content
        messageTextarea.style.height = messageTextarea.scrollHeight + 'px';
      }
    }
  }

  function initContactForm() {
    if (contactForm) {
      // Set up dynamic contact preference validation
      const contactPreferenceInputs = document.querySelectorAll('input[name="contactPreference"]');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const messageInput = document.getElementById('message');
      const nameRequiredIndicator = document.getElementById('name-required');
      const emailRequiredIndicator = document.getElementById('email-required');
      const phoneRequiredIndicator = document.getElementById('phone-required');
      const messageRequiredIndicator = document.getElementById('message-required');
      
      // Show all required indicators initially
      if (nameRequiredIndicator) nameRequiredIndicator.classList.add('show');
      if (messageRequiredIndicator) messageRequiredIndicator.classList.add('show');
      
      // Function to update contact validation based on preference
      function updateContactValidation() {
        const selectedPreference = document.querySelector('input[name="contactPreference"]:checked').value;
        
        // Hide all indicators first
        if (emailRequiredIndicator) emailRequiredIndicator.classList.remove('show');
        if (phoneRequiredIndicator) phoneRequiredIndicator.classList.remove('show');
        
        // Show indicator for selected preference
        if (selectedPreference === 'email') {
          if (emailRequiredIndicator) emailRequiredIndicator.classList.add('show');
        } else if (selectedPreference === 'phone') {
          if (phoneRequiredIndicator) phoneRequiredIndicator.classList.add('show');
        }
      }
      
      // Function to remove invalid class on input
      function removeInvalidClass(event) {
        event.target.classList.remove('invalid');
      }
      
      // Custom validation function
      function validateForm() {
        // Reset styles for all fields
        const allInputs = [nameInput, emailInput, phoneInput, messageInput];
        allInputs.forEach(input => {
          input.classList.remove('invalid');
        });
        
        // Track invalid fields
        const invalidFields = [];
        
        // Get selected contact preference
        const selectedPreferenceElement = document.querySelector('input[name="contactPreference"]:checked');
        const selectedPreference = selectedPreferenceElement ? selectedPreferenceElement.value : 'email';
        
        // 1. Validate name field (always required)
        if (!nameInput.value.trim()) {
          nameInput.classList.add('invalid');
          invalidFields.push(nameInput);
        } else if (nameInput.value.trim().length < 2) {
          nameInput.classList.add('invalid');
          invalidFields.push(nameInput);
        }
        
        // 2. Validate contact field based on preference
        if (selectedPreference === 'email') {
          if (!emailInput.value.trim()) {
            emailInput.classList.add('invalid');
            invalidFields.push(emailInput);
          } else {
            // Check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
              emailInput.classList.add('invalid');
              invalidFields.push(emailInput);
            }
          }
        } else if (selectedPreference === 'phone') {
          if (!phoneInput.value.trim()) {
            phoneInput.classList.add('invalid');
            invalidFields.push(phoneInput);
          } else {
            // Check phone format
            const phoneRegex = /^[+\d\s\-()]+$/;
            if (!phoneRegex.test(phoneInput.value.trim())) {
              phoneInput.classList.add('invalid');
              invalidFields.push(phoneInput);
            }
          }
        }
        
        // 3. Validate message field (always required)
        if (!messageInput.value.trim()) {
          messageInput.classList.add('invalid');
          invalidFields.push(messageInput);
        }
        
        // If there are invalid fields, focus on the first one
        if (invalidFields.length > 0) {
          invalidFields[0].focus();
          return false;
        }
        
        // All validations passed
        return true;
      }
      
      // Add event listeners to contact preference radio buttons
      contactPreferenceInputs.forEach(input => {
        input.addEventListener('change', updateContactValidation);
      });
      
      // Add event listeners to remove invalid class when user types
      nameInput.addEventListener('input', removeInvalidClass);
      emailInput.addEventListener('input', removeInvalidClass);
      phoneInput.addEventListener('input', removeInvalidClass);
      messageInput.addEventListener('input', removeInvalidClass);
      
      // Initialize validation state
      updateContactValidation();
      
      contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Perform validation
        if (!validateForm()) {
          // If validation fails, stop form submission
          return false;
        }
        
        // Get form elements
        const submitButton = document.getElementById('submit-contact');
        const originalButtonText = submitButton.innerHTML;
        
        // Get form data
        const name = nameInput.value.trim();
        const location = document.getElementById('location').value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const message = messageInput.value.trim();
        
        // Get selected values
        const contactPreference = document.querySelector('input[name="contactPreference"]:checked').value;
        const service = document.getElementById('service').value;
        const priority = document.querySelector('input[name="priority"]:checked').value;
        const clientType = document.querySelector('input[name="clientType"]:checked').value;
        
        // Get labels for selected values
        const contactPreferenceLabels = {
          'email': 'Email',
          'phone': 'Telefone'
        };
        
        const serviceLabels = {
          'installation': 'Instalação Nova',
          'maintenance': 'Manutenção',
          'repair': 'Reparação',
          'consultation': 'Consultoria',
          'quote': 'Orçamento Personalizado',
          'other': 'Outros'
        };
        
        const priorityLabels = {
          'urgent': 'Urgente',
          'normal': 'Normal',
          'low': 'Baixa'
        };
        
        const clientTypeLabels = {
          'domestic': 'Doméstico',
          'business': 'Empresa'
        };
        
        // Prepare template parameters for EmailJS with all form data
        const templateParams = {
          from_name: name,
          from_location: location,
          from_email: email,
          from_phone: phone,
          message: message,
          contact_preference: contactPreferenceLabels[contactPreference] || contactPreference,
          service_type: serviceLabels[service] || service,
          priority: priorityLabels[priority] || priority,
          client_type: clientTypeLabels[clientType] || clientType,
          title: `${name} - ${serviceLabels[service] || service}` // Subject line
        };
        
        // Show loading spinner
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin button-icon"></i>A enviar...';
        
        // Send email using EmailJS
        emailjs.send('service_utj5hjm', 'template_9wr1vm9', templateParams)
          .then((response) => {
            // Success - change button color to green and show success message
            submitButton.classList.add('success');
            submitButton.innerHTML = '<i class="fas fa-check button-icon"></i>Mensagem Enviada com Sucesso!';
            
            // Create success message element if it doesn't exist
            let successMessage = document.getElementById('contact-success-message');
            if (!successMessage) {
              successMessage = document.createElement('p');
              successMessage.id = 'contact-success-message';
              successMessage.textContent = 'A sua mensagem foi enviada com sucesso! Entraremos em contacto brevemente.';
              submitButton.parentNode.insertBefore(successMessage, submitButton.nextSibling);
            }
            
            // Show success message
            successMessage.style.display = 'block';

            
            // Clear custom validity messages
            nameInput.setCustomValidity('');
            emailInput.setCustomValidity('');
            phoneInput.setCustomValidity('');
            messageInput.setCustomValidity('');
            
            // Reinitialize validation state after reset
            updateContactValidation();
            
            // Reset button after 10 seconds
            setTimeout(() => {
              submitButton.disabled = false;
              submitButton.classList.remove('success');
              submitButton.innerHTML = originalButtonText;
              successMessage.style.display = 'none';
            }, 10000);
          })
          .catch((error) => {
            console.error('Error sending email:', error);
            // Revert button to original state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            alert('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
          });
      });
    }
  }

  function initBrandLogosCarousel() {
      const track = document.querySelector('.brands-track');
      if (!track) return;
      const firstSet = track.querySelector('.brands-set');
      if (!firstSet) return;
      const clonedSet = firstSet.cloneNode(true);
      track.appendChild(clonedSet);
  }

  async function initTopBanner() {
    if (typeof fetchBanners !== 'function' || !banner) return;
    try {
        const banners = await fetchBanners();
        if (banners.length > 0) {
            const latestBanner = banners[0];
            const bannerText = document.getElementById('banner-text');
            if(bannerText) bannerText.textContent = latestBanner.text;
            if (latestBanner.color_hex) banner.style.backgroundColor = latestBanner.color_hex;
            banner.classList.remove('hidden');
        }
    } catch(e) { console.error("Could not fetch banners", e)}
  }

  async function checkAdminAuth() {
    if(adminLink) {
        if (localStorage.getItem('supabase.auth.token')) {
            adminLink.style.display = 'block';
        }
        adminLink.addEventListener('click', () => window.location.href = 'admin.html');
    }
  }

  // --- Products Section ---
  async function initProductsSection() {
    if (typeof supabase === 'undefined') {
      document.addEventListener('supabaseReady', loadProductData);
    } else {
      loadProductData();
    }
  }

  async function loadProductData() {
    if (!featuredProductsContainer) return;
    featuredProductsContainer.innerHTML = '<p>A carregar produtos...</p>';
    try {
      const [products, brands, categories] = await Promise.all([
        fetchProducts(),
        fetchBrands(),
        fetchCategories()
      ]);
      
      allProducts = products;
      displayProducts(allProducts);
      
      if (brandFiltersContainer) {
        populateFilterButtons(brands, brandFiltersContainer, 'brand');
      }
      if (categoryFiltersContainer) {
        populateFilterButtons(categories, categoryFiltersContainer, 'category');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      featuredProductsContainer.innerHTML = '<p class="no-products-message">Não foi possível carregar os produtos. Tente novamente mais tarde.</p>';
    }
  }

  function displayProducts(products) {
    if (!featuredProductsContainer) return;

    featuredProductsContainer.innerHTML = '';
    if (products.length === 0) {
      featuredProductsContainer.innerHTML = '<p class="no-products-message">Nenhum produto encontrado com os filtros selecionados.</p>';
      return;
    }
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-card-image" style="background-image: url('${product.main_image_url}')"></div>
        <div class="product-card-content">
          <h3 class="product-card-title">${product.name}</h3>
          <p class="product-card-subtitle">${product.subtitle || (product.description ? product.description.substring(0, 70) + '...' : 'Descrição não disponível.')}</p>
          <button class="button button-primary view-details-btn">Ver Detalhes</button>
        </div>
      `;
      const viewDetailsButton = card.querySelector('.view-details-btn');
      if(viewDetailsButton) {
          console.log(`Attaching click listener for product: ${product.name}`);
          viewDetailsButton.addEventListener('click', (e) => {
            console.log(`"Ver Detalhes" button clicked for: ${product.name}`);
            e.stopPropagation();
            showProductPopup(product);
          });
      }
      featuredProductsContainer.appendChild(card);
    });
  }

  async function showProductPopup(product) {
    console.log('showProductPopup called for:', product);
    
    const productPopupEl = document.getElementById('product-popup');
    const popupDetailsEl = document.getElementById('popup-details');

    console.log('productPopup element:', productPopupEl);
    console.log('popupDetails element:', popupDetailsEl);

    if (!popupDetailsEl || !productPopupEl) {
      console.error('Popup elements not found! Bailing out.');
      return;
    }

    try {
      popupDetailsEl.innerHTML = '<p>A carregar detalhes do produto...</p>';
      console.log('Attempting to show popup...');
      productPopupEl.classList.remove('hidden');
      console.log('Popup should be visible now. classList:', productPopupEl.classList);

      const additionalImages = await fetchProductImages(product.id);
      
      popupDetailsEl.innerHTML = `
        <div class="popup-header">
          <h2 class="popup-title">${product.name}</h2>
          <p class="popup-subtitle">${product.model_number || ''}</p>
        </div>
        <div class="popup-body">
          <div class="popup-column-left">
            <p class="popup-price">${product.price > 0 ? `€ ${product.price.toFixed(2)}` : 'Preço sob consulta'}</p>
            <div class="popup-main-image-container">
              <img src="${product.main_image_url}" alt="${product.name}" class="popup-main-image">
            </div>
            <div class="popup-thumbnail-container">
              ${additionalImages.map(img => `<img src="${img.image_url}" alt="Thumbnail" class="popup-thumbnail" data-src="${img.image_url}">`).join('')}
            </div>
            <button id="ask-budget-btn" class="button button-secondary">
              <i class="fas fa-file-invoice"></i>
              Pedir Orçamento
            </button>
          </div>
          <div class="popup-column-right">
            <h4>Detalhes do Produto</h4>
            <ul class="popup-specs-list">
              ${product.brand ? `<li><strong>Marca:</strong> ${product.brand}</li>` : ''}
              ${product.category ? `<li><strong>Categoria:</strong> ${product.category}</li>` : ''}
              ${product.wattage ? `<li><strong>Potência:</strong> ${product.wattage} W</li>` : ''}
              ${product.horsepower ? `<li><strong>Cavalos:</strong> ${product.horsepower} HP</li>` : ''}
              ${product.pressure_bar ? `<li><strong>Pressão:</strong> ${product.pressure_bar} bar</li>` : ''}
              ${product.amperage ? `<li><strong>Amperagem:</strong> ${product.amperage} A</li>` : ''}
              ${product.extra_details ? Object.entries(product.extra_details).map(([key, value]) => `<li><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>`).join('') : ''}
            </ul>
            <h4>Descrição</h4>
            <p class="popup-description"></p>
          </div>
        </div>
      `;

      // Add event listeners for thumbnails
      const thumbnails = popupDetailsEl.querySelectorAll('.popup-thumbnail');
      const mainImage = popupDetailsEl.querySelector('.popup-main-image');
      const mainImageContainer = popupDetailsEl.querySelector('.popup-main-image-container');
      
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
          mainImage.src = thumb.dataset.src;
          
          // Update active thumbnail
          thumbnails.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
      
      // Set first thumbnail as active
      if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
      }
      
      // Add double-click functionality to open image in new tab on web, do nothing on mobile
      mainImage.addEventListener('dblclick', (e) => {
        // Check if it's a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) {
          // Open image in new tab on web
          window.open(mainImage.src, '_blank');
        }
        // Do nothing on mobile
      });

      // Set description with Markdown parsing
      const descriptionElement = popupDetailsEl.querySelector('.popup-description');
      if (descriptionElement && product.description) {
        // Parse Markdown: **bold**, *italic*, __underline__, and newlines
        let formattedDescription = product.description
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold: **text**
          .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic: *text*
          .replace(/__(.*?)__/g, '<u>$1</u>')                // Underline: __text__
          .replace(/\n/g, '<br>');                           // Newlines
        
        descriptionElement.innerHTML = formattedDescription;
      } else if (descriptionElement) {
        descriptionElement.textContent = 'Descrição detalhada não disponível.';
      }

      const budgetButton = document.getElementById('ask-budget-btn');
      if (budgetButton) {
          budgetButton.addEventListener('click', () => {
            productPopupEl.classList.add('hidden');
            const contactSection = document.getElementById('contacto');
            const nameInput = document.getElementById('name');
            const serviceSelect = document.getElementById('service');
            const messageTextarea = document.getElementById('message');
            
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            if (nameInput) nameInput.focus();
            if (serviceSelect) serviceSelect.value = 'quote';
            
            if (messageTextarea) {
                let message = `Olá, gostaria de pedir um orçamento para o seguinte produto:

Produto: ${product.name}
`;
                if (product.model_number) message += `Modelo: ${product.model_number}
`;
                if (product.brand) message += `Marca: ${product.brand}
`;
                messageTextarea.value = message;
            }
            
            // Display the red text when "Pedir Orçamento" is clicked
            displayContactMessage();
          });
      }
    } catch (error) {
      console.error('Error showing product popup:', error);
      popupDetailsEl.innerHTML = '<p>Ocorreu um erro ao carregar os detalhes do produto.</p>';
    }
  }

  function populateFilterButtons(items, container, type) {
    if (!container) return;
    container.innerHTML = '<button class="filter-button active">Todas</button>';
    const allButton = container.querySelector('.filter-button');
    allButton.addEventListener('click', () => {
      if (type === 'brand') activeBrand = null;
      if (type === 'category') activeCategory = null;
      container.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
      allButton.classList.add('active');
      filterProducts();
    });

    items.forEach(item => {
      const button = document.createElement('button');
      button.className = 'filter-button';
      button.textContent = item;
      button.addEventListener('click', () => {
        if (type === 'brand') activeBrand = item;
        if (type === 'category') activeCategory = item;
        container.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProducts();
      });
      container.appendChild(button);
    });
  }

  function filterProducts() {
    let filteredProducts = allProducts;
    if (activeBrand) {
      filteredProducts = filteredProducts.filter(p => p.brand === activeBrand);
    }
    if (activeCategory) {
      filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
    }
    displayProducts(filteredProducts);
  }

  // Popup Listeners
  if (popupClose) {
    popupClose.addEventListener('click', () => productPopup.classList.add('hidden'));
  }
  if (productPopup) {
    productPopup.addEventListener('click', (e) => {
        if (e.target === productPopup) productPopup.classList.add('hidden');
    });
  }

  // Start the app
  init();
});