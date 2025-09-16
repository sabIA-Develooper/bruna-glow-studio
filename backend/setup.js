const fs = require('fs');
const path = require('path');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Arquivo .env criado a partir do env.example');
    } else {
        // Create basic .env file
        const envContent = `# Banco de Dados
DATABASE_URL=postgresql://postgres:password@localhost:5432/bruna_glow_studio

# JWT
JWT_SECRET=bruna-glow-studio-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Arquivo .env criado com configurações padrão');
    }
} else {
    console.log('✅ Arquivo .env já existe');
}

console.log('\n🚀 Backend configurado com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure o banco PostgreSQL');
console.log('2. Ajuste as variáveis no arquivo .env');
console.log('3. Execute: npm run dev');
console.log('\n📚 Documentação completa em README.md');
