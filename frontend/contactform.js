(function() {
    'use strict';
    
    const CONFIG = {
        apiEndpoint: 'http://localhost:8081/api/contact',
        successMessage: '✓ Message sent! Check your email for confirmation.',
        errorMessage: '✗ Failed to send message',
        networkErrorMessage: '✗ Network error: Could not connect to server. Please try again later.'
    };
    
    document.addEventListener('DOMContentLoaded', initContactForm);
    
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) {
            console.warn('Contact form not found on this page');
            return;
        }
        
        createStatusDiv(form);
        form.addEventListener('submit', handleSubmit);
        console.log('Contact form initialized');
    }
    
    function createStatusDiv(form) {
        let statusDiv = document.getElementById('form-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'form-status';
            statusDiv.style.display = 'none';
            form.appendChild(statusDiv);
        }
        return statusDiv;
    }
    
    async function handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('form-status');
        
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        if (statusDiv) {
            statusDiv.style.display = 'none';
            statusDiv.className = '';
        }
        
        const formData = new FormData(form);
        const payload = {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            message: formData.get('message')?.trim() || ''
        };
        
        const validationError = validateForm(payload);
        if (validationError) {
            showStatus(validationError, 'error', statusDiv);
            resetButton(submitBtn, originalText);
            return;
        }
        
        try {
            console.log('Sending contact form:', payload);
            
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const responseData = await response.json();
            console.log('Response:', responseData);
            
            if (response.ok) {
                showStatus(CONFIG.successMessage, 'success', statusDiv);
                form.reset();
            } else {
                const errorMsg = responseData.message || CONFIG.errorMessage;
                showStatus(`✗ ${errorMsg}`, 'error', statusDiv);
            }
        } catch (err) {
            console.error('Network error:', err);
            showStatus(CONFIG.networkErrorMessage, 'error', statusDiv);
        } finally {
            resetButton(submitBtn, originalText);
        }
    }
    
    function validateForm(payload) {
        if (!payload.name) return 'Please enter your name';
        if (!payload.email) return 'Please enter your email';
        if (!payload.message) return 'Please enter your message';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            return 'Please enter a valid email address';
        }
        
        if (payload.name.length > 100) return 'Name is too long (max 100 characters)';
        if (payload.email.length > 255) return 'Email is too long (max 255 characters)';
        if (payload.message.length > 4000) return 'Message is too long (max 4000 characters)';
        
        return null;
    }
    
    function showStatus(message, type, statusDiv) {
        if (!statusDiv) {
            alert(message);
            return;
        }
        
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.className = type === 'success' ? 'success-message' : 'error-message';
        
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    function resetButton(button, originalText) {
        button.disabled = false;
        button.textContent = originalText;
    }
})();