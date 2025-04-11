// Color utilities
const colorUtils = {
  rgbToHex: function(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },
  
  calculateLuminance: function(r, g, b) {
    // Convert RGB to linear values
    const [rLinear, gLinear, bLinear] = [r, g, b].map(value => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    
    // Calculate luminance using the relative luminance formula
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  },
  
  getTextColorForBackground: function(r, g, b) {
    const luminance = this.calculateLuminance(r, g, b);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  },
  
  rgbToCssString: function(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
  },
  
  meetsContrastWithWhite: function(r, g, b) {
    const luminance = this.calculateLuminance(r, g, b);
    const contrastRatio = this.getContrastRatio(luminance, 1);
    return contrastRatio >= 4.5;
  },
  
  meetsContrastWithBlack: function(r, g, b) {
    const luminance = this.calculateLuminance(r, g, b);
    const contrastRatio = this.getContrastRatio(luminance, 0);
    return contrastRatio >= 4.5;
  },
  
  getContrastRatio: function(luminance1, luminance2) {
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
  }
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Color Picker Elements
  const redSlider = document.getElementById('redSlider');
  const greenSlider = document.getElementById('greenSlider');
  const blueSlider = document.getElementById('blueSlider');
  const redValueText = document.getElementById('redValueText');
  const greenValueText = document.getElementById('greenValueText');
  const blueValueText = document.getElementById('blueValueText');
  const redValue = document.getElementById('redValue');
  const greenValue = document.getElementById('greenValue');
  const blueValue = document.getElementById('blueValue');
  const colorSwatch = document.getElementById('colorSwatch');
  const hexCode = document.getElementById('hexCode');
  const copyHex = document.getElementById('copyHex');
  const textColorDot = document.getElementById('textColorDot');
  const backgroundColorDot = document.getElementById('backgroundColorDot');
  const whiteBackgroundPreview = document.getElementById('whiteBackgroundPreview');
  const colorBackgroundPreview = document.getElementById('colorBackgroundPreview');
  const colorBackgroundText = document.getElementById('colorBackgroundText');
  
  // Initialize color values
  let red = 128;
  let green = 128;
  let blue = 128;
  
  // Update color display
  function updateColorDisplay() {
    const rgbColor = colorUtils.rgbToCssString(red, green, blue);
    const hexColor = colorUtils.rgbToHex(red, green, blue);
    const textColor = colorUtils.getTextColorForBackground(red, green, blue);
    
    // Update sliders and text values
    redValueText.textContent = red;
    greenValueText.textContent = green;
    blueValueText.textContent = blue;
    redValue.textContent = `R: ${red}`;
    greenValue.textContent = `G: ${green}`;
    blueValue.textContent = `B: ${blue}`;
    
    // Update swatch and indicators
    colorSwatch.style.backgroundColor = rgbColor;
    textColorDot.style.backgroundColor = rgbColor;
    backgroundColorDot.style.backgroundColor = rgbColor;
    
    // Update hex code
    hexCode.textContent = hexColor;
    
    // Update preview areas
    whiteBackgroundPreview.querySelector('p').style.color = rgbColor;
    colorBackgroundPreview.style.backgroundColor = rgbColor;
    colorBackgroundText.style.color = textColor;
  }
  
  // Event Listeners for sliders
  if (redSlider) {
    redSlider.addEventListener('input', function() {
      red = parseInt(this.value);
      updateColorDisplay();
    });
  }
  
  if (greenSlider) {
    greenSlider.addEventListener('input', function() {
      green = parseInt(this.value);
      updateColorDisplay();
    });
  }
  
  if (blueSlider) {
    blueSlider.addEventListener('input', function() {
      blue = parseInt(this.value);
      updateColorDisplay();
    });
  }
  
  // Copy hex code to clipboard
  if (copyHex) {
    copyHex.addEventListener('click', function() {
      const hexValue = hexCode.textContent;
      navigator.clipboard.writeText(hexValue).then(() => {
        showToast('Copied!', `${hexValue} has been copied to clipboard`);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Error', 'Failed to copy to clipboard');
      });
    });
  }
  
  // Initialize color display if elements exist
  if (colorSwatch) {
    updateColorDisplay();
  }

  // Toast notification
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  
  function showToast(title, message, duration = 3000) {
    if (toast && toastTitle && toastMessage) {
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }
  }
  
  // Form validation and submission
  const contactForm = document.getElementById('contactForm');
  const contactPageForm = document.getElementById('contactPageForm');
  
  function validateForm(form) {
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const subject = form.querySelector('[name="subject"]');
    const message = form.querySelector('[name="message"]');
    
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    
    // Validate name
    if (!name.value.trim() || name.value.length < 2) {
      const errorEl = form.querySelector(`#${name.id}Error`) || form.querySelector('.form-error');
      errorEl.textContent = 'Name must be at least 2 characters.';
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      const errorEl = form.querySelector(`#${email.id}Error`) || form.querySelector('.form-error');
      errorEl.textContent = 'Please enter a valid email address.';
      isValid = false;
    }
    
    // Validate subject
    if (!subject.value.trim() || subject.value.length < 2) {
      const errorEl = form.querySelector(`#${subject.id}Error`) || form.querySelector('.form-error');
      errorEl.textContent = 'Subject must be at least 2 characters.';
      isValid = false;
    }
    
    // Validate message
    if (!message.value.trim() || message.value.length < 10) {
      const errorEl = form.querySelector(`#${message.id}Error`) || form.querySelector('.form-error');
      errorEl.textContent = 'Message must be at least 10 characters.';
      isValid = false;
    }
    
    return isValid;
  }
  
  function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    if (validateForm(form)) {
      const submitButton = form.querySelector('[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = '<i class="ri-loader-line"></i> Sending...';
      submitButton.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        showToast('Message Sent', 'Thank you for your message! We will get back to you soon.');
        form.reset();
        
        // Restore button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }, 1000);
    }
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      
      if (emailInput.value.trim()) {
        showToast('Subscribed', 'Thank you for subscribing to our newsletter!');
        emailInput.value = '';
      }
    });
  }
  
  // Mobile Menu Toggle
  const menuButton = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  
  if (menuButton && menu) {
    menuButton.addEventListener('click', function() {
      menu.classList.toggle('active');
      this.innerHTML = menu.classList.contains('active') 
        ? '<i class="ri-close-line"></i>' 
        : '<i class="ri-menu-line"></i>';
    });
  }
  
  // Mobile menu toggle functionality
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      // Close mobile menu if open
      if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        if (menuButton) {
          menuButton.innerHTML = '<i class="ri-menu-line"></i>';
        }
      }
    });
  });
});