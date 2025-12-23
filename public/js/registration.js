/**
 * User Registration Module
 * Handles user registration and logout for Fun Quiz
 */

async function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);

    if (!name || name.length < 2) {
        alert('Please enter a valid name (at least 2 characters)');
        return;
    }

    if (age < 8 || age > 16) {
        alert('This quiz is designed for ages 8-16');
        return;
    }

    try {
        // Use FormData for OpenSwoole compatibility
        const formData = new FormData();
        formData.append('name', name);
        formData.append('age', age);

        const response = await fetch('/api/user/register', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            window.location.href = '/play';
        } else {
            alert(result.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Something went wrong. Please try again.');
    }
}

async function resetUser() {
    try {
        await fetch('/api/user/logout', { method: 'POST' });
        window.location.reload();
    } catch (error) {
        window.location.reload();
    }
}
