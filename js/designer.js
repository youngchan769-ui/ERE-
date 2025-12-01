/**
 * 도면 자동화 도구 메인 JavaScript
 * 캔버스 조작, 드래그 앤 드롭, 컴포넌트 관리 등의 기능을 담당합니다.
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeDesigner();
});

function initializeDesigner() {
    const canvas = document.getElementById('jig-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvas-container');

    // 상태 관리
    let components = [];
    let selectedComponent = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let currentTool = 'select';
    let drawingObjects = [];
    let isDrawing = false;
    let drawingStart = null;
    let drawingCurrent = null;

    // 캔버스 크기 조정
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        draw();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 사이드바에서 드래그 앤 드롭
    const sidebarItems = document.querySelectorAll('.component-item');
    sidebarItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', item.dataset.type);
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        if (type && COMPONENT_DEFS[type]) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            addComponent(type, x, y);
        }
    });

    /**
     * 컴포넌트 추가 함수
     */
    function addComponent(type, x, y) {
        const comp = new JigComponent(type, x, y);
        components.push(comp);
        selectComponent(comp);
        draw();
    }

    // 캔버스 상호작용
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (currentTool === 'select') {
            const clickedComp = components.slice().reverse().find(c => c.contains(mx, my));
            if (clickedComp) {
                selectComponent(clickedComp);
                isDragging = true;
                dragOffset.x = mx - clickedComp.x;
                dragOffset.y = my - clickedComp.y;
            } else {
                selectComponent(null);
            }
        } else if (currentTool === 'line') {
            isDrawing = true;
            drawingStart = { x: mx, y: my };
            drawingCurrent = { x: mx, y: my };
        } else if (currentTool === 'circle') {
            isDrawing = true;
            drawingStart = { x: mx, y: my };
            drawingCurrent = { x: mx, y: my };
        } else if (currentTool === 'rectangle') {
            isDrawing = true;
            drawingStart = { x: mx, y: my };
            drawingCurrent = { x: mx, y: my };
        } else if (currentTool === 'text') {
            const text = prompt('텍스트를 입력하세요:', 'Text');
            if (text) {
                ctx.fillStyle = '#e5e7eb';
                ctx.font = '16px Noto Sans KR';
                ctx.fillText(text, mx, my);
            }
        }
        draw();
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (isDragging && selectedComponent) {
            selectedComponent.x = mx - dragOffset.x;
            selectedComponent.y = my - dragOffset.y;
            updatePropertiesPanel();
            draw();
        } else if (isDrawing && drawingStart) {
            drawingCurrent = { x: mx, y: my };
            draw();
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (isDrawing && drawingStart && drawingCurrent) {
            finishDrawing();
        }
        isDragging = false;
        isDrawing = false;
        drawingStart = null;
        drawingCurrent = null;
        draw();
    });

    /**
     * 그리기 완료 함수
     */
    function finishDrawing() {
        if (!drawingStart || !drawingCurrent) return;

        ctx.save();
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;

        switch (currentTool) {
            case 'line':
                ctx.beginPath();
                ctx.moveTo(drawingStart.x, drawingStart.y);
                ctx.lineTo(drawingCurrent.x, drawingCurrent.y);
                ctx.stroke();
                break;
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(drawingCurrent.x - drawingStart.x, 2) +
                    Math.pow(drawingCurrent.y - drawingStart.y, 2)
                );
                ctx.beginPath();
                ctx.arc(drawingStart.x, drawingStart.y, radius, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'rectangle':
                ctx.beginPath();
                ctx.rect(
                    Math.min(drawingStart.x, drawingCurrent.x),
                    Math.min(drawingStart.y, drawingCurrent.y),
                    Math.abs(drawingCurrent.x - drawingStart.x),
                    Math.abs(drawingCurrent.y - drawingStart.y)
                );
                ctx.stroke();
                break;
        }
        ctx.restore();
    }

    /**
     * 렌더링 함수
     */
    function draw() {
        // 배경 지우기
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 그리드 그리기
        ctx.strokeStyle = '#2d2d2d';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 컴포넌트 그리기
        components.forEach(comp => comp.draw(ctx));

        // 그리기 중인 객체 미리보기
        if (isDrawing && drawingStart && drawingCurrent) {
            ctx.save();
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);

            switch (currentTool) {
                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(drawingStart.x, drawingStart.y);
                    ctx.lineTo(drawingCurrent.x, drawingCurrent.y);
                    ctx.stroke();
                    break;
                case 'circle':
                    const radius = Math.sqrt(
                        Math.pow(drawingCurrent.x - drawingStart.x, 2) +
                        Math.pow(drawingCurrent.y - drawingStart.y, 2)
                    );
                    ctx.beginPath();
                    ctx.arc(drawingStart.x, drawingStart.y, radius, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'rectangle':
                    ctx.beginPath();
                    ctx.rect(
                        Math.min(drawingStart.x, drawingCurrent.x),
                        Math.min(drawingStart.y, drawingCurrent.y),
                        Math.abs(drawingCurrent.x - drawingStart.x),
                        Math.abs(drawingCurrent.y - drawingStart.y)
                    );
                    ctx.stroke();
                    break;
            }
            ctx.restore();
        }
    }

    /**
     * 컴포넌트 선택 함수
     */
    function selectComponent(comp) {
        if (selectedComponent) {
            selectedComponent.selected = false;
        }

        selectedComponent = comp;

        if (comp) {
            comp.selected = true;
            document.querySelector('.no-selection').classList.add('hidden');
            document.querySelector('.properties-content').classList.remove('hidden');
            updatePropertiesPanel();
        } else {
            document.querySelector('.no-selection').classList.remove('hidden');
            document.querySelector('.properties-content').classList.add('hidden');
        }
        draw();
    }

    /**
     * 속성 패널 업데이트 함수
     */
    function updatePropertiesPanel() {
        if (!selectedComponent) return;

        document.getElementById('prop-type').value = selectedComponent.name;
        document.getElementById('prop-id').value = selectedComponent.id;
        document.getElementById('prop-x').value = Math.round(selectedComponent.x);
        document.getElementById('prop-y').value = Math.round(selectedComponent.y);
        document.getElementById('prop-rotation').value = selectedComponent.rotation;

        // 동적 속성 렌더링
        const dynamicPropsDiv = document.getElementById('dynamic-props');
        dynamicPropsDiv.innerHTML = '';
        const def = COMPONENT_DEFS[selectedComponent.type];

        if (def.props) {
            Object.entries(def.props).forEach(([key, config]) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'prop-group';

                const label = document.createElement('label');
                label.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');

                let input;
                if (config.type === 'select') {
                    input = document.createElement('select');
                    config.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        if (selectedComponent.props[key] === opt) option.selected = true;
                        input.appendChild(option);
                    });
                } else {
                    input = document.createElement('input');
                    input.type = config.type === 'number' ? 'number' : 'text';
                    input.value = selectedComponent.props[key];
                }

                input.addEventListener('change', (e) => {
                    selectedComponent.props[key] = e.target.value;
                    draw();
                });

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                dynamicPropsDiv.appendChild(wrapper);
            });
        }
    }

    // 속성 입력 이벤트 리스너
    document.getElementById('prop-x').addEventListener('input', (e) => {
        if (selectedComponent) {
            selectedComponent.x = parseInt(e.target.value) || 0;
            draw();
        }
    });

    document.getElementById('prop-y').addEventListener('input', (e) => {
        if (selectedComponent) {
            selectedComponent.y = parseInt(e.target.value) || 0;
            draw();
        }
    });

    document.getElementById('prop-rotation').addEventListener('input', (e) => {
        if (selectedComponent) {
            selectedComponent.rotation = parseInt(e.target.value) || 0;
            draw();
        }
    });

    // 삭제 버튼
    document.getElementById('btn-delete-comp').addEventListener('click', () => {
        if (selectedComponent) {
            components = components.filter(c => c !== selectedComponent);
            selectComponent(null);
            draw();
        }
    });

    // 도구 버튼
    document.getElementById('btn-select').addEventListener('click', () => {
        currentTool = 'select';
        updateToolButtons();
        canvas.style.cursor = 'default';
    });

    document.getElementById('btn-line').addEventListener('click', () => {
        currentTool = 'line';
        updateToolButtons();
        canvas.style.cursor = 'crosshair';
    });

    document.getElementById('btn-circle').addEventListener('click', () => {
        currentTool = 'circle';
        updateToolButtons();
        canvas.style.cursor = 'crosshair';
    });

    document.getElementById('btn-rectangle').addEventListener('click', () => {
        currentTool = 'rectangle';
        updateToolButtons();
        canvas.style.cursor = 'crosshair';
    });

    document.getElementById('btn-text').addEventListener('click', () => {
        currentTool = 'text';
        updateToolButtons();
        canvas.style.cursor = 'text';
    });

    function updateToolButtons() {
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        const toolMap = {
            'select': 'btn-select',
            'line': 'btn-line',
            'circle': 'btn-circle',
            'rectangle': 'btn-rectangle',
            'text': 'btn-text'
        };
        const btnId = toolMap[currentTool];
        if (btnId) document.getElementById(btnId).classList.add('active');
    }

    // 전체 삭제 버튼
    document.getElementById('btn-clear').addEventListener('click', () => {
        if (confirm('모든 컴포넌트를 삭제하시겠습니까?')) {
            components = [];
            selectComponent(null);
            draw();
        }
    });

    // 내보내기 버튼
    document.getElementById('btn-export').addEventListener('click', () => {
        const data = {
            components: components.map(comp => ({
                type: comp.type,
                x: comp.x,
                y: comp.y,
                rotation: comp.rotation,
                props: comp.props
            }))
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jig-design.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // 저장 버튼
    document.getElementById('btn-save').addEventListener('click', () => {
        const data = {
            components: components.map(comp => ({
                type: comp.type,
                x: comp.x,
                y: comp.y,
                rotation: comp.rotation,
                props: comp.props
            }))
        };
        localStorage.setItem('jigDesign', JSON.stringify(data));
        alert('설계가 저장되었습니다!');
    });

    // 저장된 설계 불러오기
    const savedDesign = localStorage.getItem('jigDesign');
    if (savedDesign) {
        try {
            const data = JSON.parse(savedDesign);
            data.components.forEach(compData => {
                const comp = new JigComponent(compData.type, compData.x, compData.y);
                comp.rotation = compData.rotation || 0;
                comp.props = compData.props || {};
                components.push(comp);
            });
            draw();
        } catch (e) {
            console.error('저장된 설계를 불러오는 중 오류 발생:', e);
        }
    }

    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Delete' && selectedComponent) {
            components = components.filter(c => c !== selectedComponent);
            selectComponent(null);
            draw();
        }

        const keyMap = {
            'v': 'select',
            'V': 'select',
            'l': 'line',
            'L': 'line',
            'c': 'circle',
            'C': 'circle',
            'r': 'rectangle',
            'R': 'rectangle',
            't': 'text',
            'T': 'text'
        };

        if (keyMap[e.key]) {
            currentTool = keyMap[e.key];
            updateToolButtons();
            if (currentTool === 'text') {
                canvas.style.cursor = 'text';
            } else if (currentTool === 'select') {
                canvas.style.cursor = 'default';
            } else {
                canvas.style.cursor = 'crosshair';
            }
        }
    });
}

