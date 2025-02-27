// Script base para o projeto
document.addEventListener('DOMContentLoaded', function() {
    console.log('O arquivo base.js está funcionando corretamente!');
    
    // Exemplo de interação simples
    const header = document.querySelector('header');
    
    if (header) {
        header.addEventListener('click', function() {
            alert('O sistema de arquivos estáticos está funcionando corretamente!');
        });
    }
});
