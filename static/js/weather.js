function getLocalizacao() {
    if (!navigator.geolocation) {
        atualizarStatus('Geolocalização não suportada pelo seu navegador', 'error');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        posicao => {
            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;
            getClima(latitude, longitude);
        },
        error => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    atualizarStatus('Permissão para geolocalização negada', 'error');
                    break;
                case error.POSITION_UNAVAILABLE:
                    atualizarStatus('Localização indisponível', 'error');
                    break;
                case error.TIMEOUT:
                    atualizarStatus('Tempo esgotado ao obter localização', 'error');
                    break;
                default:
                    atualizarStatus('Erro desconhecido ao obter localização', 'error');
            }
        }
    );
}

function getClima(latitude, longitude) {
    // Use the API key from the environment variables
    const apikey = WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric&lang=pt_br`;

    fetch(url)
        .then(response => {
            if (response.status === 401) {
                throw new Error('API key inválida ou expirada');
            }
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(dados => {
            const clima = dados.weather[0].main;
            const descricao = dados.weather[0].description;
            const temperatura = dados.main.temp;
            const hora = new Date().getHours();
            alterarTema(clima, descricao, temperatura, hora);
        })
        .catch(erro => {
            console.error('Detalhes do erro:', erro);
            atualizarStatus('Erro ao carregar informações do clima. Verifique o console para mais detalhes.', 'error');
        });
}

function alterarTema(clima, descricao, temperatura, hora) {
    const corpo = document.body;
    const titulo = document.getElementById("titulo");
    const descricaoEl = document.getElementById("descricao");
    const weatherIcon = document.querySelector('.weather-icon');

    // Definir ícone e tema baseado no clima
    const temaConfig = {
        'Clear': {
            icon: hora >= 6 && hora < 18 ? 'fa-sun' : 'fa-moon',
            theme: hora >= 6 && hora < 18 ? 'theme-clear' : 'theme-night'
        },
        'Rain': {
            icon: 'fa-cloud-rain',
            theme: 'theme-rain'
        },
        'Clouds': {
            icon: 'fa-cloud',
            theme: 'theme-clouds'
        },
        'default': {
            icon: 'fa-cloud',
            theme: 'theme-clouds'
        }
    };

    const config = temaConfig[clima] || temaConfig.default;
    
    // Atualizar ícone
    weatherIcon.innerHTML = `<i class="fas ${config.icon}"></i>`;
    
    // Atualizar classe do tema
    corpo.className = config.theme;

    // Atualizar textos
    const descricaoFormatada = descricao.charAt(0).toUpperCase() + descricao.slice(1);
    const temperaturaFormatada = Math.round(temperatura);
    
    titulo.textContent = descricaoFormatada;
    descricaoEl.textContent = `${temperaturaFormatada}°C`;
}

function atualizarStatus(mensagem, tipo) {
    const titulo = document.getElementById("titulo");
    const descricao = document.getElementById("descricao");
    const weatherIcon = document.querySelector('.weather-icon');

    titulo.textContent = mensagem;
    descricao.textContent = '';
    
    if (tipo === 'error') {
        weatherIcon.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #ff4444;"></i>';
        document.body.className = 'theme-error';
    }
}

document.addEventListener('DOMContentLoaded', getLocalizacao);
