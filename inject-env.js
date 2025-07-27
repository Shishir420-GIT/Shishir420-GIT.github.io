// Vercel Environment Variables Injection Script
// This script safely injects environment variables into the client-side code at build time

const fs = require('fs');
const path = require('path');

function injectEnvironmentVariables() {
    console.log('🔧 Injecting environment variables for Vercel deployment...');
    
    // Read the main.js file
    const mainJsPath = path.join(__dirname, 'js', 'main.js');
    let mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
    
    // Create environment object with available API keys
    const envVars = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || null,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || null
    };
    
    // Only include non-null values for security
    const filteredEnvVars = Object.fromEntries(
        Object.entries(envVars).filter(([key, value]) => value !== null)
    );
    
    // Create the environment injection script
    const envInjection = `
// Environment variables injected at build time (Vercel)
if (typeof window !== 'undefined') {
    window.ENV = ${JSON.stringify(filteredEnvVars)};
}
`;
    
    // Inject at the top of main.js
    const injectedContent = envInjection + mainJsContent;
    
    // Write back to main.js
    fs.writeFileSync(mainJsPath, injectedContent);
    
    if (Object.keys(filteredEnvVars).length > 0) {
        console.log('✅ Environment variables injected successfully');
        console.log('🔑 Available API keys:', Object.keys(filteredEnvVars));
    } else {
        console.log('⚠️  No API keys found in environment variables');
        console.log('💡 Add GEMINI_API_KEY or OPENAI_API_KEY to enable chatbot');
    }
}

// Run the injection
if (require.main === module) {
    injectEnvironmentVariables();
}

module.exports = { injectEnvironmentVariables };