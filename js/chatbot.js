/**
 * 도면 상담 챗봇 JavaScript
 * 자동차 용접지그 도면 관련 질문에 답변하는 챗봇
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

/**
 * 챗봇 초기화
 */
function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // 챗봇 열기/닫기
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            chatbotContainer.classList.toggle('active');
            if (chatbotContainer.classList.contains('active')) {
                chatbotInput.focus();
            }
        });
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }

    // 메시지 전송 함수
    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (!userMessage) return;

        // 사용자 메시지 표시
        addMessageToChat(userMessage, 'user');
        chatbotInput.value = '';

        // 챗봇 응답 생성 (약간의 지연으로 자연스러운 느낌)
        setTimeout(() => {
            const botResponse = generateBotResponse(userMessage);
            addMessageToChat(botResponse, 'bot');
        }, 500);
    }

    // 전송 버튼 클릭
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }

    // Enter 키로 전송
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

/**
 * 채팅창에 메시지 추가
 */
function addMessageToChat(messageText, messageType) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    if (!chatbotMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${messageType}-message`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = messageType === 'bot' 
        ? '<i class="fa-solid fa-robot"></i>' 
        : '<i class="fa-solid fa-user"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    const paragraph = document.createElement('p');
    paragraph.textContent = messageText;
    contentDiv.appendChild(paragraph);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);

    // 스크롤을 맨 아래로
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * 챗봇 응답 생성
 * 사용자 질문에 따라 적절한 답변을 생성합니다.
 */
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // 인사말
    if (message.includes('안녕') || message.includes('hello') || message.includes('hi')) {
        return '안녕하세요! 자동차 용접지그 도면 상담 챗봇입니다. 도면 설계, 제작, 문의사항에 대해 도움을 드리겠습니다. 무엇을 도와드릴까요?';
    }

    // 도면 관련
    if (message.includes('도면') || message.includes('설계') || message.includes('drawing')) {
        if (message.includes('제작') || message.includes('만들') || message.includes('생성')) {
            return '도면 제작은 전문 설계 팀이 고객의 요구사항을 분석하여 3D 모델링을 제공한 후, 프로토타입을 제작합니다. 일반적으로 설계 기간은 2-4주, 제작 기간은 4-8주 소요됩니다.';
        }
        if (message.includes('비용') || message.includes('가격') || message.includes('견적')) {
            return '도면 설계 및 제작 비용은 제품의 복잡도, 크기, 재질 등에 따라 달라집니다. 정확한 견적을 원하시면 문의하기 섹션에서 상세 정보를 남겨주시면 빠르게 답변드리겠습니다.';
        }
        return '도면 설계는 전문 설계 팀이 고객의 요구사항을 정확히 반영하여 3D 모델링을 제공합니다. 설계부터 제작까지 원스톱 서비스를 제공하며, 프로토타입 제작도 가능합니다.';
    }

    // 용접지그 관련
    if (message.includes('용접지그') || message.includes('지그') || message.includes('jig')) {
        if (message.includes('종류') || message.includes('타입') || message.includes('종류')) {
            return '저희는 차체 용접지그, 부품 용접지그, 자동화 용접지그, 맞춤형 용접지그 등 다양한 제품을 제공합니다. 각 제품은 용도에 따라 최적화된 설계를 제공합니다.';
        }
        if (message.includes('정밀도') || message.includes('정확도')) {
            return '용접지그의 정밀도는 제품 유형에 따라 다릅니다. 차체 용접지그는 ±0.1mm, 자동화 용접지그는 ±0.05mm의 고정밀도를 제공합니다.';
        }
        return '용접지그는 자동차 부품을 정확한 위치에 고정하여 용접 품질을 향상시키는 장치입니다. 저희는 최고 품질의 용접지그를 제조하여 자동차 제조 공정의 효율성을 극대화합니다.';
    }

    // 제품 관련
    if (message.includes('제품') || message.includes('product')) {
        if (message.includes('차체')) {
            return '차체 용접지그는 자동차 차체 부품의 정밀한 용접을 위한 맞춤형 지그 시스템입니다. 고정밀도 위치 결정(±0.1mm 이내), 내구성 강화 설계, 빠른 교체 가능(5분 이내) 등의 특징이 있습니다.';
        }
        if (message.includes('부품')) {
            return '부품 용접지그는 다양한 자동차 부품의 소량 다품종 생산에 최적화된 모듈형 용접지그입니다. 모듈형 설계로 유연한 구성이 가능하며, 경제적인 솔루션을 제공합니다.';
        }
        if (message.includes('자동화') || message.includes('로봇')) {
            return '자동화 용접지그는 로봇 용접 시스템과 연동되는 고정밀 자동화 용접지그입니다. 로봇 연동 최적화, 자동 클램핑 시스템, 스마트 센서 통합 등의 기능을 제공합니다.';
        }
        if (message.includes('맞춤') || message.includes('커스텀')) {
            return '맞춤형 용접지그는 고객의 특수한 요구사항에 맞춘 완전 맞춤형 설계 및 제작 서비스입니다. 전문 설계 팀 상담, 3D 모델링 제공, 프로토타입 제작 등 설계부터 제작까지 원스톱 서비스를 제공합니다.';
        }
        return '저희는 차체 용접지그, 부품 용접지그, 자동화 용접지그, 맞춤형 용접지그 등 4가지 주요 제품을 제공합니다. 각 제품에 대한 자세한 정보는 제품소개 섹션에서 확인하실 수 있습니다.';
    }

    // 서비스 관련
    if (message.includes('서비스') || message.includes('service')) {
        return '저희는 설계 및 컨설팅, 제조 및 조립, 유지보수 및 수리, 교육 및 지원 등 다양한 서비스를 제공합니다. 고객의 요구사항에 맞는 맞춤형 솔루션을 제공하여 최고의 만족도를 추구합니다.';
    }

    // 문의 관련
    if (message.includes('문의') || message.includes('연락') || message.includes('contact') || message.includes('전화')) {
        return '문의사항이 있으시면 문의하기 섹션에서 견적 문의, 제품 문의, 기술 상담 등을 신청하실 수 있습니다. 전화: 02-1234-5678, 이메일: info@weldingjig.co.kr로도 연락 가능합니다.';
    }

    // 견적 관련
    if (message.includes('견적') || message.includes('가격') || message.includes('비용') || message.includes('price') || message.includes('cost')) {
        return '정확한 견적을 위해서는 제품의 크기, 복잡도, 재질, 수량 등의 정보가 필요합니다. 문의하기 섹션에서 상세 정보를 남겨주시면 전문가가 빠르게 견적을 제공해드리겠습니다.';
    }

    // 제작 기간 관련
    if (message.includes('기간') || message.includes('소요') || message.includes('시간') || message.includes('기다') || message.includes('duration')) {
        return '일반적으로 설계 기간은 2-4주, 제작 기간은 4-8주 정도 소요됩니다. 제품의 복잡도와 수량에 따라 달라질 수 있으며, 긴급한 경우 빠른 제작도 가능합니다. 자세한 일정은 문의 시 상담해드립니다.';
    }

    // 재질 관련
    if (message.includes('재질') || message.includes('재료') || message.includes('material')) {
        return '용접지그는 주로 고강도 강판, 알루미늄 합금 등을 사용합니다. 제품의 용도와 요구사항에 따라 최적의 재질을 선택하여 내구성과 정밀도를 보장합니다. 표면 처리로 도금 및 방청 처리도 가능합니다.';
    }

    // 정밀도 관련
    if (message.includes('정밀도') || message.includes('정확도') || message.includes('precision') || message.includes('accuracy')) {
        return '용접지그의 정밀도는 제품 유형에 따라 다릅니다. 차체 용접지그는 ±0.1mm, 부품 용접지그는 ±0.2mm, 자동화 용접지그는 ±0.05mm의 고정밀도를 제공합니다. 반복 정밀도는 ±0.02mm까지 가능합니다.';
    }

    // 설치 관련
    if (message.includes('설치') || message.includes('설정') || message.includes('install') || message.includes('setup')) {
        return '용접지그 설치 시 전문 기술자가 현장에 방문하여 설치 및 조정을 진행합니다. 설치 후 사용법과 유지보수 방법에 대한 교육도 함께 제공하여 효율적인 사용을 지원합니다.';
    }

    // 유지보수 관련
    if (message.includes('유지보수') || message.includes('수리') || message.includes('maintenance') || message.includes('repair')) {
        return '저희는 제작한 용접지그의 장기적인 안정적 사용을 위한 정기 점검 및 수리 서비스를 제공합니다. 정기적인 유지보수를 통해 제품의 수명을 연장하고 품질을 유지할 수 있습니다.';
    }

    // 도면 작도 명령어 관련
    if (message.includes('작도') || message.includes('명령어') || message.includes('command') || message.includes('drawing')) {
        if (message.includes('명령어') || message.includes('command')) {
            return '도면 작도 명령어:\n\n' +
                   '• LINE x1 y1 x2 y2 - 선 그리기\n' +
                   '• CIRCLE x y radius - 원 그리기\n' +
                   '• RECTANGLE x y width height - 사각형 그리기\n' +
                   '• ARC x y radius startAngle endAngle - 호 그리기\n' +
                   '• EXTRUDE height - 2D 도면을 3D로 돌출\n\n' +
                   '도면 작도 도구 버튼을 클릭하여 사용하실 수 있습니다.';
        }
        return '도면 작도 도구를 사용하여 2D 도면을 그리고, EXTRUDE 명령어로 3D로 변환할 수 있습니다. 화면 우측 하단의 작도 도구 버튼을 클릭해보세요!';
    }

    // 2D 3D 변환 관련
    if (message.includes('3d') || message.includes('3D') || message.includes('three') || message.includes('extrude')) {
        return '2D 도면을 3D로 변환하려면:\n\n' +
               '1. 도면 작도 도구에서 2D 도면을 그립니다\n' +
               '2. EXTRUDE 명령어를 사용합니다 (예: EXTRUDE 50)\n' +
               '3. 3D 뷰 버튼을 클릭하여 3D로 확인합니다\n\n' +
               '3D 뷰에서는 마우스로 회전, 확대/축소가 가능합니다.';
    }

    // 도움말
    if (message.includes('도움') || message.includes('help') || message.includes('어떻게') || message.includes('방법')) {
        return '저는 도면 설계, 제품 정보, 견적 문의, 제작 기간, 재질, 정밀도, 설치, 유지보수, 도면 작도 명령어 등에 대해 답변할 수 있습니다. 궁금한 내용을 자유롭게 질문해주세요!';
    }

    // 감사 인사
    if (message.includes('감사') || message.includes('고마') || message.includes('thanks') || message.includes('thank')) {
        return '감사합니다! 추가로 궁금한 사항이 있으시면 언제든지 질문해주세요. 도와드리겠습니다!';
    }

    // 기본 응답
    const defaultResponses = [
        '죄송합니다. 더 구체적으로 질문해주시면 정확한 답변을 드릴 수 있습니다. 도면 설계, 제품 정보, 견적 문의 등에 대해 물어보실 수 있습니다.',
        '해당 질문에 대해 정확한 답변을 드리기 어렵습니다. 도면 설계, 용접지그 제품, 서비스, 견적 등에 대해 질문해주시면 도움을 드리겠습니다.',
        '이해하기 어려운 부분이 있습니다. 도면 관련 질문이나 제품 정보, 견적 문의 등에 대해 구체적으로 질문해주시면 더 정확한 답변을 드릴 수 있습니다.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

