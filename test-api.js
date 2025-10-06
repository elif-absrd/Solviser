// Test script to verify API endpoints
const BASE_URL = 'http://localhost:3002/api';

// Test registration
async function testRegister() {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123456',
                organizationName: 'Test Organization',
                name: 'Test User'
            })
        });
        
        const data = await response.text();
        console.log('Register response:', response.status, data);
        return response.ok;
    } catch (error) {
        console.error('Register error:', error);
        return false;
    }
}

// Test login with seeded admin user
async function testLogin() {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: 'admin@gmail.com',
                password: 'securepassword'
            })
        });
        
        const data = await response.text();
        console.log('Login response:', response.status, data);
        return response.ok;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Test protected route
async function testMe() {
    try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            credentials: 'include'
        });
        
        const data = await response.text();
        console.log('Me response:', response.status, data);
        return response.ok;
    } catch (error) {
        console.error('Me error:', error);
        return false;
    }
}

async function runTests() {
    console.log('Testing API endpoints...');
    
    console.log('\n1. Testing login with seeded admin...');
    await testLogin();
    
    console.log('\n2. Testing protected /auth/me endpoint...');
    await testMe();
    
    console.log('\n3. Testing registration...');
    await testRegister();
}

runTests();