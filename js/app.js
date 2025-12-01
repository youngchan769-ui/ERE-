/**
 * 자동차 용접지그 웹사이트 메인 JavaScript
 * 네비게이션, 스크롤 애니메이션, 폼 처리 등의 기능을 담당합니다.
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeSmoothScroll();
    initializeScrollProgress();
    initializeCounterAnimation();
    initializeImageGallery();
    initializeProductModals();
    initializeLoadingAnimation();
});

/**
 * 네비게이션 바 초기화 및 스크롤 이벤트 처리
 */
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 스크롤 시 네비게이션 바 스타일 변경
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 모바일 메뉴 토글
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 모바일 메뉴 링크 클릭 시 메뉴 닫기
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

/**
 * 스크롤 애니메이션 초기화
 * Intersection Observer를 사용하여 요소가 뷰포트에 들어올 때 애니메이션 적용
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 애니메이션을 적용할 요소들 선택
    const animatedElements = document.querySelectorAll(
        '.product-card, .service-item, .about-text, .about-image, .stat-item'
    );

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * 문의 폼 초기화 및 제출 처리
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleFormSubmission(contactForm);
        });
    }
}

/**
 * 폼 제출 처리 함수
 * 실제 환경에서는 서버로 데이터를 전송해야 합니다.
 */
function handleFormSubmission(formElement) {
    const formData = new FormData(formElement);
    const formDataObject = {};

    // FormData를 일반 객체로 변환
    for (let [key, value] of formData.entries()) {
        formDataObject[key] = value;
    }

    // 폼 유효성 검사
    if (!validateContactForm(formDataObject)) {
        return;
    }

    // 실제 환경에서는 여기서 서버로 데이터 전송
    // 예: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formDataObject) })
    
    // 시뮬레이션: 성공 메시지 표시
    showFormSuccessMessage(formElement);
    
    // 폼 초기화
    formElement.reset();
}

/**
 * 폼 유효성 검사
 */
function validateContactForm(formData) {
    const requiredFields = ['customerName', 'customerPhone', 'customerEmail', 'inquiryType', 'inquiryMessage'];
    
    for (let field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            alert(`${getFieldLabel(field)} 필드를 입력해주세요.`);
            return false;
        }
    }

    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.customerEmail)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return false;
    }

    // 전화번호 형식 검사 (간단한 검사)
    const phonePattern = /^[0-9-]+$/;
    if (!phonePattern.test(formData.customerPhone)) {
        alert('올바른 전화번호를 입력해주세요.');
        return false;
    }

    return true;
}

/**
 * 필드명을 한글 레이블로 변환
 */
function getFieldLabel(fieldName) {
    const fieldLabels = {
        'customerName': '이름',
        'customerPhone': '연락처',
        'customerEmail': '이메일',
        'inquiryType': '문의 유형',
        'inquiryMessage': '문의 내용'
    };
    return fieldLabels[fieldName] || fieldName;
}

/**
 * 폼 제출 성공 메시지 표시
 */
function showFormSuccessMessage(formElement) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.style.cssText = `
        background-color: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        animation: fadeInUp 0.5s ease;
    `;
    successMessage.textContent = '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.';

    formElement.appendChild(successMessage);

    // 5초 후 메시지 제거
    setTimeout(() => {
        successMessage.style.opacity = '0';
        successMessage.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            successMessage.remove();
        }, 500);
    }, 5000);
}

/**
 * 부드러운 스크롤 초기화
 * 앵커 링크 클릭 시 부드럽게 스크롤되도록 처리
 */
function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 현재 활성 섹션에 따라 네비게이션 링크 하이라이트
 */
function updateActiveNavigationLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const navbarHeight = document.getElementById('navbar').offsetHeight;

            if (window.scrollY >= sectionTop - navbarHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// 활성 네비게이션 링크 업데이트 함수 호출
updateActiveNavigationLink();

/**
 * 스크롤 진행 표시기 초기화
 */
function initializeScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!scrollProgress) return;

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

/**
 * 숫자 카운터 애니메이션 초기화
 * 통계 숫자가 올라가는 효과를 구현합니다.
 */
function initializeCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (statNumbers.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    statNumbers.forEach(statNumber => {
        counterObserver.observe(statNumber);
    });
}

/**
 * 숫자 카운터 애니메이션 실행
 */
function animateCounter(element) {
    const targetValue = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2초
    const increment = targetValue / (duration / 16); // 60fps 기준
    let currentValue = 0;

    const updateCounter = () => {
        currentValue += increment;
        
        if (currentValue < targetValue) {
            const displayValue = Math.floor(currentValue);
            element.textContent = displayValue + (targetValue === 98 ? '%' : targetValue === 20 ? '+' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue + (targetValue === 98 ? '%' : targetValue === 20 ? '+' : '+');
        }
    };

    updateCounter();
}

/**
 * 이미지 갤러리 초기화
 */
function initializeImageGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevButton = document.getElementById('galleryPrev');
    const nextButton = document.getElementById('galleryNext');
    const indicators = document.querySelectorAll('.indicator');
    
    if (galleryItems.length === 0) return;

    let currentIndex = 0;
    const totalItems = galleryItems.length;

    function showGalleryItem(index) {
        // 범위 체크
        if (index < 0) index = totalItems - 1;
        if (index >= totalItems) index = 0;

        // 모든 아이템 숨기기
        galleryItems.forEach(item => item.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 현재 아이템 표시
        galleryItems[index].classList.add('active');
        indicators[index].classList.add('active');

        currentIndex = index;
    }

    // 이전 버튼
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            showGalleryItem(currentIndex - 1);
        });
    }

    // 다음 버튼
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showGalleryItem(currentIndex + 1);
        });
    }

    // 인디케이터 클릭
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showGalleryItem(index);
        });
    });

    // 자동 슬라이드 (선택사항)
    let autoSlideInterval = setInterval(() => {
        showGalleryItem(currentIndex + 1);
    }, 5000);

    // 갤러리에 마우스 오버 시 자동 슬라이드 정지
    const gallery = document.querySelector('.image-gallery');
    if (gallery) {
        gallery.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        gallery.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(() => {
                showGalleryItem(currentIndex + 1);
            }, 5000);
        });
    }
}

/**
 * 제품 모달 초기화
 */
function initializeProductModals() {
    const productCards = document.querySelectorAll('.product-card[data-modal]');
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    const productDetailButtons = document.querySelectorAll('.product-detail-btn');

    if (!modal || !modalBody) return;

    // 제품 정보 데이터
    const productData = {
        product1: {
            title: '차체 용접지그',
            description: '자동차 차체 부품의 정밀한 용접을 위한 맞춤형 지그 시스템입니다. 높은 정확도와 안정성을 제공하여 자동차 제조 공정의 품질을 향상시킵니다.',
            features: [
                '고정밀도 위치 결정 (±0.1mm 이내)',
                '내구성 강화 설계 (최소 10년 사용 가능)',
                '빠른 교체 가능 (5분 이내)',
                '다양한 차종 대응 가능',
                '자동 클램핑 시스템'
            ],
            specifications: {
                '최대 부품 크기': '2000mm × 1500mm',
                '정밀도': '±0.1mm',
                '재질': '고강도 강판',
                '표면 처리': '도금 및 방청 처리'
            }
        },
        product2: {
            title: '부품 용접지그',
            description: '다양한 자동차 부품의 소량 다품종 생산에 최적화된 모듈형 용접지그입니다. 유연한 구성으로 다양한 제품에 대응할 수 있습니다.',
            features: [
                '모듈형 설계로 유연한 구성',
                '소량 다품종 생산에 최적화',
                '경제적인 솔루션',
                '빠른 제품 변경 가능',
                '표준화된 부품 사용'
            ],
            specifications: {
                '모듈 크기': '500mm × 500mm',
                '조합 가능한 크기': '무제한',
                '정밀도': '±0.2mm',
                '재질': '알루미늄 합금'
            }
        },
        product3: {
            title: '자동화 용접지그',
            description: '로봇 용접 시스템과 연동되는 고정밀 자동화 용접지그로 생산 효율을 극대화합니다. 스마트 센서를 통합하여 자동화된 품질 관리가 가능합니다.',
            features: [
                '로봇 연동 최적화',
                '자동 클램핑 시스템',
                '스마트 센서 통합',
                '실시간 품질 모니터링',
                '데이터 수집 및 분석'
            ],
            specifications: {
                '로봇 호환성': '모든 주요 브랜드',
                '정밀도': '±0.05mm',
                '반복 정밀도': '±0.02mm',
                '센서 타입': '위치, 압력, 온도'
            }
        },
        product4: {
            title: '맞춤형 용접지그',
            description: '고객의 특수한 요구사항에 맞춘 완전 맞춤형 용접지그 설계 및 제작 서비스입니다. 전문 설계 팀이 고객의 요구를 정확히 반영합니다.',
            features: [
                '전문 설계 팀 상담',
                '3D 모델링 제공',
                '프로토타입 제작',
                '완전 맞춤형 솔루션',
                '설계부터 제작까지 원스톱 서비스'
            ],
            specifications: {
                '설계 기간': '2-4주',
                '제작 기간': '4-8주',
                '최소 주문량': '1개',
                '서비스 범위': '설계, 제작, 설치, 교육'
            }
        }
    };

    function openModal(productId) {
        const product = productData[productId];
        if (!product) return;

        // 모달 내용 생성
        let modalContent = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div style="margin-top: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--text-primary);">주요 특징</h4>
                <ul style="list-style: none; padding: 0;">
        `;

        product.features.forEach(feature => {
            modalContent += `
                <li style="padding: 0.5rem 0; color: var(--text-secondary);">
                    <i class="fa-solid fa-check" style="color: var(--primary-color); margin-right: 0.5rem;"></i>
                    ${feature}
                </li>
            `;
        });

        modalContent += `
                </ul>
            </div>
            <div style="margin-top: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--text-primary);">제품 사양</h4>
                <table style="width: 100%; border-collapse: collapse;">
        `;

        Object.entries(product.specifications).forEach(([key, value]) => {
            modalContent += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 0.75rem 0; font-weight: 600; color: var(--text-primary);">${key}</td>
                    <td style="padding: 0.75rem 0; text-align: right; color: var(--text-secondary);">${value}</td>
                </tr>
            `;
        });

        modalContent += `
                </table>
            </div>
            <div style="margin-top: 2rem; text-align: center;">
                <a href="#contact" class="btn btn-primary" onclick="document.getElementById('productModal').classList.remove('active');">견적 문의하기</a>
            </div>
        `;

        modalBody.innerHTML = modalContent;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 제품 카드 클릭 이벤트
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 버튼 클릭이 아닌 경우에만 모달 열기
            if (!e.target.classList.contains('product-detail-btn')) {
                const productId = this.getAttribute('data-modal');
                openModal(productId);
            }
        });
    });

    // 자세히 보기 버튼 클릭 이벤트
    productDetailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.product-card');
            const productId = card.getAttribute('data-modal');
            openModal(productId);
        });
    });

    // 모달 닫기
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // 모달 배경 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * 로딩 애니메이션 초기화
 */
function initializeLoadingAnimation() {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // 페이지 로드 시 로딩 표시
    window.addEventListener('load', function() {
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
            }, 500);
        }
    });

    // 폼 제출 시 로딩 표시 (예시)
    const contactForm = document.getElementById('contactForm');
    if (contactForm && loadingOverlay) {
        contactForm.addEventListener('submit', function() {
            loadingOverlay.classList.add('active');
            
            // 시뮬레이션: 2초 후 로딩 숨기기
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
            }, 2000);
        });
    }
}

