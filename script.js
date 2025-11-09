// Form Validation and Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('corporate-contact-form');
    const submitButton = document.getElementById('submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoading = submitButton.querySelector('.button-loading');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    // Validation functions
    const validators = {
        name: function(value) {
            if (!value.trim()) {
                return 'Please enter your name';
            }
            if (value.trim().length < 2) {
                return 'Name must be at least 2 characters';
            }
            return null;
        },
        organization: function(value) {
            if (!value.trim()) {
                return 'Please enter your organization name';
            }
            return null;
        },
        email: function(value) {
            if (!value.trim()) {
                return 'Please enter your email address';
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
            }
            return null;
        },
        interest: function() {
            const checkboxes = document.querySelectorAll('input[name="interest"]:checked');
            if (checkboxes.length === 0) {
                return 'Please select at least one option';
            }
            return null;
        }
    };

    // Show error message
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (field) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Clear error message
    function clearError(fieldName) {
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (field) {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        }

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Clear all checkboxes error
    function clearCheckboxError(fieldName) {
        const checkboxes = document.querySelectorAll(`input[name="${fieldName}"]`);
        checkboxes.forEach(checkbox => {
            checkbox.classList.remove('error');
            checkbox.setAttribute('aria-invalid', 'false');
        });

        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Real-time validation for text inputs
    ['name', 'organization', 'email'].forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                const error = validators[fieldName](this.value);
                if (error) {
                    showError(fieldName, error);
                } else {
                    clearError(fieldName);
                }
            });

            // Clear error on input
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearError(fieldName);
                }
            });
        }
    });

    // Real-time validation for checkboxes
    const interestCheckboxes = document.querySelectorAll('input[name="interest"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            clearCheckboxError('interest');
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Check honeypot field (spam protection)
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value !== '') {
            // Silently fail - likely a bot
            console.log('Spam detected');
            return;
        }

        // Hide previous messages
        formSuccess.style.display = 'none';
        formError.style.display = 'none';

        // Validate all fields
        let isValid = true;
        const errors = {};

        // Validate required text fields
        ['name', 'organization', 'email'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const error = validators[fieldName](field.value);
            if (error) {
                errors[fieldName] = error;
                showError(fieldName, error);
                isValid = false;
            } else {
                clearError(fieldName);
            }
        });

        // Validate interest checkboxes
        const interestError = validators.interest();
        if (interestError) {
            errors.interest = interestError;
            showError('interest', interestError);
            isValid = false;
        } else {
            clearCheckboxError('interest');
        }

        if (!isValid) {
            formError.style.display = 'block';
            // Focus on first error
            const firstErrorField = Object.keys(errors)[0];
            const firstField = document.getElementById(firstErrorField) || document.querySelector(`input[name="${firstErrorField}"]`);
            if (firstField) {
                firstField.focus();
            }
            return;
        }

        // Disable submit button and show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';

        // Collect form data
        const formData = new FormData(form);
        const data = {};

        // Process regular fields
        for (let [key, value] of formData.entries()) {
            if (key === 'interest' || key === 'contact-method') {
                // Handle multiple checkboxes
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else if (key !== 'website') { // Exclude honeypot
                data[key] = value;
            }
        }

        try {
            // TODO: Replace this with your actual form submission endpoint
            // Example: const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });

            // Simulate API call (remove this in production)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For now, just log the data (remove in production)
            console.log('Form data:', data);

            // Show success message
            formSuccess.style.display = 'block';
            formError.style.display = 'none';

            // Reset form
            form.reset();

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Re-enable button
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';

        } catch (error) {
            console.error('Form submission error:', error);

            // Show error message
            formError.style.display = 'block';
            formSuccess.style.display = 'none';

            // Re-enable button
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';

            // Scroll to error message
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// Smooth scroll for CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    const ctaLinks = document.querySelectorAll('a[href="#contact-form"]');

    ctaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('contact-form');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Focus on first form field for accessibility
                setTimeout(() => {
                    const firstField = document.getElementById('name');
                    if (firstField) {
                        firstField.focus();
                    }
                }, 500);
            }
        });
    });
});

// Sticky Navigation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const stickyNav = document.getElementById('sticky-nav');
    const header = document.querySelector('header');
    let lastScroll = 0;
    let headerHeight = 0;

    // Calculate header height after page loads
    setTimeout(() => {
        headerHeight = header ? header.offsetHeight : 500;
    }, 100);

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Show sticky nav after scrolling past the header
        if (currentScroll > headerHeight && currentScroll > lastScroll) {
            // Scrolling down and past header
            stickyNav.classList.add('show');
        } else if (currentScroll < headerHeight) {
            // Scrolled back to top
            stickyNav.classList.remove('show');
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });
});
