/**
 * Payment Form Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get references to form elements
  const paymentForm = document.querySelector('.card-payment-form');
  const cardNumberInput = document.getElementById('cardNumber');
  const expiryDateInput = document.getElementById('expiryDate');
  const cvvInput = document.getElementById('cvvCode');
  const completePaymentBtn = document.querySelector('.btn-payment');

  // Get plan information from URL params or localStorage
  function initializePaymentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('planId');
    
    // Default values in case no plan is selected
    let planName = 'Premium Plan';
    let planPrice = 'RM99';
    let planDescription = 'For dedicated fitness enthusiasts';
    
    // If plan info exists in localStorage, use that instead
    const selectedPlan = localStorage.getItem('selectedPlan');
    if (selectedPlan) {
      try {
        const planData = JSON.parse(selectedPlan);
        planName = planData.name;
        planPrice = planData.price;
        planDescription = planData.description;
      } catch (err) {
        console.error('Error parsing selected plan data:', err);
      }
    }
    
    // Update the DOM with the selected plan info
    const planTitleEl = document.querySelector('.selected-plan .plan-title');
    const planPriceEl = document.querySelector('.selected-plan .plan-price');
    const planSubtitleEl = document.querySelector('.selected-plan .plan-subtitle');
    const subtotalEl = document.querySelector('.detail-row:first-child .detail-value');
    const totalEl = document.querySelector('.detail-row.total .detail-value');
    
    if (planTitleEl) planTitleEl.textContent = planName;
    if (planPriceEl) {
      // Check if the span exists before trying to access it
      const spanEl = planPriceEl.querySelector('span');
      if (spanEl) {
        planPriceEl.textContent = planPrice + spanEl.outerHTML;
      } else {
        planPriceEl.textContent = planPrice + '<span>/month</span>';
        planPriceEl.innerHTML = planPrice + '<span>/month</span>';
      }
      planPriceEl.setAttribute('value', planPrice.replace(/\D/g, ''));
    }
    if (planSubtitleEl) planSubtitleEl.textContent = planDescription;

    // Extract numeric value from planPrice (e.g., RM49, $99, etc.)
    let numericPrice = 0;
    if (typeof planPrice === 'string') {
      // Remove any non-digit except dot
      const match = planPrice.match(/\d+(\.\d+)?/);
      if (match) {
        numericPrice = parseFloat(match[0]);
      }
    } else if (typeof planPrice === 'number') {
      numericPrice = planPrice;
    }
    // Format as RMxx.00
    const formattedPrice = 'RM' + numericPrice.toFixed(2);
    if (subtotalEl) subtotalEl.textContent = formattedPrice;
    if (totalEl) totalEl.textContent = formattedPrice;
  }
  
  // Format credit card number with spaces
  function formatCardNumber(e) {
    let input = e.target;
    let value = input.value.replace(/\s+/g, '');
    
    // Add a space after every 4 digits
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    
    input.value = value;
  }
  
  // Format expiry date as MM/YY
  function formatExpiryDate(e) {
    let input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      // Format as MM/YY
      if (value.length <= 2) {
        input.value = value;
      } else {
        input.value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }
  }
  
  // Validate form submission
  function validateForm(e) {
    e.preventDefault();
    
    // Simple validation - check if required fields are filled
    let isValid = true;
    const requiredFields = paymentForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    // Specific validation for card fields
    if (cardNumberInput.value.replace(/\s/g, '').length < 16) {
      isValid = false;
      cardNumberInput.classList.add('error');
    }
    
    if (expiryDateInput.value.length < 5) {
      isValid = false;
      expiryDateInput.classList.add('error');
    }
    
    if (cvvInput.value.length < 3) {
      isValid = false;
      cvvInput.classList.add('error');
    }
    
    if (isValid) {
      // If the form is valid, show success message
      // In a real application, this would submit to a payment processor
      completePaymentBtn.textContent = 'Processing...';
      
      // Simulate payment processing
      setTimeout(() => {
        // Redirect to success page or show confirmation
        showPaymentSuccess();
      }, 1500);
    }
  }
  
  // Show payment success message
  function showPaymentSuccess() {
    // Create a success message element
    const paymentSection = document.querySelector('.payment-section');
    const successMessage = document.createElement('div');
    successMessage.className = 'payment-success-message';
    
    successMessage.innerHTML = `
      <div class="success-icon">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
      </div>
      <h2 class="h2">Payment Successful!</h2>
      <p>Thank you for subscribing to our fitness program.</p>
      <p>Your journey to better health begins now.</p>
      <div class="success-actions">
        <a href="../index.html" class="btn btn-primary">Go to Dashboard</a>
      </div>
    `;
    
    // Replace the payment wrapper with the success message
    const paymentWrapper = document.querySelector('.payment-wrapper');
    if (paymentWrapper && paymentSection) {
      paymentSection.querySelector('.container').replaceChild(successMessage, paymentWrapper);
      
      // Add a class to the body for styling
      document.body.classList.add('payment-completed');
      
      // Store subscription info in localStorage
      localStorage.setItem('activeSubscription', 'true');
      
      // Scroll to the top of the page
      window.scrollTo(0, 0);
    }
  }
  
  // Initialize the page
  initializePaymentPage();
  
  // Set up event listeners
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', formatCardNumber);
  }
  
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', formatExpiryDate);
  }
  
  if (paymentForm) {
    paymentForm.addEventListener('submit', validateForm);
  }
});

// Add CSS for the success message
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .payment-success-message {
      text-align: center;
      padding: 60px 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .success-icon {
      font-size: 5rem;
      color: hsl(153, 49%, 40%);
      margin-bottom: 20px;
    }
    
    .payment-success-message h2 {
      color: hsl(153, 49%, 40%);
      margin-bottom: 15px;
    }
    
    .payment-success-message p {
      margin-bottom: 10px;
      color: hsl(0, 0%, 40%);
    }
    
    .success-actions {
      margin-top: 30px;
    }
    
    .error {
      border-color: #ff3860 !important;
    }
  `;
  document.head.appendChild(style);
}); 