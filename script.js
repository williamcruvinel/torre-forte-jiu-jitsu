// JavaScript - TORRE FORTE Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // ============ MENU MOBILE ============
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    
    let isMenuOpen = false;
    
    // Toggle do menu principal
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Trocar ícone do botão
        const icon = menuToggle.querySelector('i');
        if (isMenuOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
            
            // Fechar dropdown se estiver aberto
            if (dropdownMenu) {
                dropdownMenu.classList.remove('active');
                dropdownToggle.classList.remove('active-dropdown');
            }
        }
    }
    
    // Toggle do dropdown no mobile
    function toggleDropdown(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            
            dropdownMenu.classList.toggle('active');
            dropdownToggle.classList.toggle('active-dropdown');
        }
    }
    
    // Fechar menu ao clicar em um link
    function closeMenu() {
        if (window.innerWidth <= 768 && isMenuOpen) {
            toggleMenu();
        }
    }
    
    // Fechar menu ao clicar no overlay
    function closeMenuOnOverlayClick(e) {
        if (e.target === menuOverlay && isMenuOpen) {
            toggleMenu();
        }
    }
    
    // Event Listeners do menu
    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenuOnOverlayClick);
    
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', toggleDropdown);
    }
    
    // Fechar menu ao clicar em qualquer link
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                closeMenu();
            }
        });
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu();
        }
    });
    
    // ============ HEADER SCROLL EFFECT ============
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ============ SISTEMA DE TABS ============
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            tabContent.classList.add('active');
        });
    });
    
    // ============ CARROSSEL DE PARCEIROS (CORRIGIDO) ============
    const carrossel = document.getElementById('carrossel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const carrosselItems = document.querySelectorAll('.carrossel-item');
    
    let currentIndex = 0;
    const totalItems = carrosselItems.length;
    
    // Determinar quantos itens mostrar com base na largura da tela
    function getItemsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }
    
    // Função para calcular o número máximo de slides possíveis
    function getMaxIndex() {
        const itemsPerView = getItemsPerView();
        // O máximo é totalItems - itemsPerView (se couber todos)
        // Se não couber todos, podemos rolar
        return Math.max(0, totalItems - itemsPerView);
    }
    
    // Atualizar visibilidade dos botões
    function updateButtons() {
        const maxIndex = getMaxIndex();
        
        // Esconder botão "anterior" se estiver na primeira posição
        if (currentIndex <= 0) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }
        
        // Esconder botão "próximo" se estiver na última posição
        if (currentIndex >= maxIndex) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }
    }
    
    function updateCarrossel() {
        const itemsPerView = getItemsPerView();
        const maxIndex = getMaxIndex();
        
        // Garantir que currentIndex não ultrapasse os limites
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        // Calcular porcentagem de deslocamento
        // Cada item ocupa 100% / itemsPerView da largura
        const translateX = -(currentIndex * (100 / itemsPerView));
        carrossel.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar botões
        updateButtons();
    }
    
    // Event listeners para os botões com limites
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarrossel();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarrossel();
        }
    });
    
    // Navegação por arrastar (touch e mouse)
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    carrossel.addEventListener('mousedown', dragStart);
    carrossel.addEventListener('touchstart', dragStart);
    carrossel.addEventListener('mouseup', dragEnd);
    carrossel.addEventListener('touchend', dragEnd);
    carrossel.addEventListener('mousemove', drag);
    carrossel.addEventListener('touchmove', drag);
    
    function dragStart(e) {
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
            e.preventDefault();
        }
        
        isDragging = true;
        carrossel.style.transition = 'none';
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        let currentPos;
        if (e.type === 'touchmove') {
            currentPos = e.touches[0].clientX;
        } else {
            currentPos = e.clientX;
        }
        
        const diff = currentPos - startPos;
        const itemsPerView = getItemsPerView();
        const itemWidth = 100 / itemsPerView;
        
        // Atualizar posição durante o arrasto
        currentTranslate = prevTranslate + (diff / window.innerWidth) * 100;
        
        // Limitar arrasto aos limites
        const maxIndex = getMaxIndex();
        const maxTranslate = maxIndex * itemWidth;
        
        if (currentTranslate > 0) currentTranslate = 0;
        if (currentTranslate < -maxTranslate) currentTranslate = -maxTranslate;
        
        carrossel.style.transform = `translateX(${currentTranslate}%)`;
    }
    
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        carrossel.style.transition = 'transform 0.5s ease';
        
        const itemsPerView = getItemsPerView();
        const itemWidth = 100 / itemsPerView;
        
        // Calcular novo índice baseado na posição final
        const movedBy = currentTranslate - prevTranslate;
        
        // Se o movimento for significativo, mudar de slide
        if (Math.abs(movedBy) > 10) {
            if (movedBy < 0 && currentIndex < getMaxIndex()) {
                currentIndex++;
            } else if (movedBy > 0 && currentIndex > 0) {
                currentIndex--;
            }
        }
        
        prevTranslate = -currentIndex * itemWidth;
        currentTranslate = prevTranslate;
        
        updateCarrossel();
    }
    
    // ============ GALERIA LIGHTBOX ============
    const galeriaItems = document.querySelectorAll('.galeria-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    // Dados para a lightbox
    const galeriaData = [
        { title: 'Campeonato Brasileiro 2023', description: '5 medalhas de ouro conquistadas por nossos atletas' },
        { title: 'Copa Internacional', description: 'Time adulto campeão da categoria' },
        { title: 'Campeonato Estadual', description: '14 atletas no pódio em diversas categorias' },
        { title: 'Kids Championship', description: 'Nossas futuras promessas do Jiu-Jitsu' },
        { title: 'Pan-Americano', description: 'Medalhas de prata e bronze conquistadas' },
        { title: 'Mundial de Masters', description: 'Ouro na categoria Master 1' }
    ];
    
    galeriaItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Preencher dados da lightbox
            lightboxTitle.textContent = galeriaData[index].title;
            lightboxDescription.textContent = galeriaData[index].description;
            
            // Mostrar lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Fechar lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Fechar lightbox ao clicar fora
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ============ FORMULÁRIO DE CONTATO ============
    const formContato = document.getElementById('form-contato');
    
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação simples
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const assunto = document.getElementById('assunto').value;
            
            if (!nome || !email || !assunto) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simulação de envio
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            formContato.reset();
        });
    }
    
    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============ ATUALIZAR CARROSSEL NO RESIZE ============
    window.addEventListener('resize', function() {
        // Resetar índice se necessário
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        updateCarrossel();
    });
    
    // ============ ANIMAÇÕES DE SCROLL ============
    function animateOnScroll() {
        const elements = document.querySelectorAll('.section, .horario-card, .info-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Adicionar estilo inicial para animação
    document.querySelectorAll('.section, .horario-card, .info-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Executar animação no carregamento e no scroll
    setTimeout(animateOnScroll, 100);
    window.addEventListener('scroll', animateOnScroll);
    
    // ============ INICIALIZAÇÕES ============
    updateCarrossel();
});