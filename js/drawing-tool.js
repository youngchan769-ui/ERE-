/**
 * 도면 작도 도구 JavaScript
 * 2D 도면 그리기 및 3D 변환 기능
 */

let drawingCanvas2D;
let drawingContext2D;
let drawingShapes = [];
let currentView = '2d';
let scene3D, camera3D, renderer3D, controls3D;
let mesh3D = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeDrawingTool();
});

/**
 * 도면 작도 도구 초기화
 */
function initializeDrawingTool() {
    const drawingToolToggle = document.getElementById('drawingToolToggle');
    const drawingToolContainer = document.getElementById('drawingToolContainer');
    const drawingToolClose = document.getElementById('drawingToolClose');
    const btn2DView = document.getElementById('btn2DView');
    const btn3DView = document.getElementById('btn3DView');
    const btnClearDrawing = document.getElementById('btnClearDrawing');
    const drawingCommandInput = document.getElementById('drawingCommandInput');
    const drawingCommandExecute = document.getElementById('drawingCommandExecute');

    // 캔버스 초기화
    drawingCanvas2D = document.getElementById('drawingCanvas2D');
    if (drawingCanvas2D) {
        drawingContext2D = drawingCanvas2D.getContext('2d');
        resizeCanvas2D();
        window.addEventListener('resize', resizeCanvas2D);
        drawGrid();
    }

    // 도구 열기/닫기
    if (drawingToolToggle) {
        drawingToolToggle.addEventListener('click', function() {
            drawingToolContainer.classList.toggle('active');
            if (drawingToolContainer.classList.contains('active')) {
                resizeCanvas2D();
                initialize3DViewer();
            }
        });
    }

    if (drawingToolClose) {
        drawingToolClose.addEventListener('click', function() {
            drawingToolContainer.classList.remove('active');
        });
    }

    // 2D 뷰 전환
    if (btn2DView) {
        btn2DView.addEventListener('click', function() {
            switchTo2DView();
        });
    }

    // 3D 뷰 전환
    if (btn3DView) {
        btn3DView.addEventListener('click', function() {
            switchTo3DView();
        });
    }

    // 초기화 버튼
    if (btnClearDrawing) {
        btnClearDrawing.addEventListener('click', function() {
            if (confirm('모든 도면을 삭제하시겠습니까?')) {
                clearDrawing();
            }
        });
    }

    // 명령어 실행
    if (drawingCommandExecute) {
        drawingCommandExecute.addEventListener('click', function() {
            executeDrawingCommand(drawingCommandInput.value);
            drawingCommandInput.value = '';
        });
    }

    if (drawingCommandInput) {
        drawingCommandInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                executeDrawingCommand(this.value);
                this.value = '';
            }
        });
    }
}

/**
 * 2D 캔버스 크기 조정
 */
function resizeCanvas2D() {
    if (!drawingCanvas2D) return;
    const container = drawingCanvas2D.parentElement;
    drawingCanvas2D.width = container.clientWidth;
    drawingCanvas2D.height = container.clientHeight;
    redraw2D();
}

/**
 * 그리드 그리기
 */
function drawGrid() {
    if (!drawingContext2D) return;
    const ctx = drawingContext2D;
    const width = drawingCanvas2D.width;
    const height = drawingCanvas2D.height;
    const gridSize = 20;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // 수직선
    for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // 수평선
    for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

/**
 * 2D 도면 다시 그리기
 */
function redraw2D() {
    if (!drawingContext2D) return;
    const ctx = drawingContext2D;
    const width = drawingCanvas2D.width;
    const height = drawingCanvas2D.height;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);
    drawGrid();

    // 도형 그리기
    drawingShapes.forEach(shape => {
        drawShape2D(shape);
    });
}

/**
 * 2D 도형 그리기
 */
function drawShape2D(shape) {
    if (!drawingContext2D) return;
    const ctx = drawingContext2D;

    ctx.strokeStyle = shape.color || '#2563eb';
    ctx.fillStyle = shape.fillColor || 'transparent';
    ctx.lineWidth = shape.lineWidth || 2;

    switch (shape.type) {
        case 'LINE':
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
            break;

        case 'CIRCLE':
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            if (shape.fillColor) ctx.fill();
            ctx.stroke();
            break;

        case 'RECTANGLE':
            ctx.beginPath();
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            if (shape.fillColor) ctx.fill();
            ctx.stroke();
            break;

        case 'ARC':
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle);
            ctx.stroke();
            break;
    }
}

/**
 * 도면 작도 명령어 실행
 */
function executeDrawingCommand(command) {
    const parts = command.trim().toUpperCase().split(/\s+/);
    if (parts.length === 0) return;

    const cmd = parts[0];
    const args = parts.slice(1).map(Number);

    try {
        switch (cmd) {
            case 'LINE':
                if (args.length === 4) {
                    addShape2D({
                        type: 'LINE',
                        x1: args[0],
                        y1: args[1],
                        x2: args[2],
                        y2: args[3],
                        color: '#2563eb'
                    });
                } else {
                    alert('LINE 명령어 형식: LINE x1 y1 x2 y2');
                }
                break;

            case 'CIRCLE':
                if (args.length === 3) {
                    addShape2D({
                        type: 'CIRCLE',
                        x: args[0],
                        y: args[1],
                        radius: args[2],
                        color: '#2563eb'
                    });
                } else {
                    alert('CIRCLE 명령어 형식: CIRCLE x y radius');
                }
                break;

            case 'RECTANGLE':
                if (args.length === 4) {
                    addShape2D({
                        type: 'RECTANGLE',
                        x: args[0],
                        y: args[1],
                        width: args[2],
                        height: args[3],
                        color: '#2563eb'
                    });
                } else {
                    alert('RECTANGLE 명령어 형식: RECTANGLE x y width height');
                }
                break;

            case 'ARC':
                if (args.length === 5) {
                    addShape2D({
                        type: 'ARC',
                        x: args[0],
                        y: args[1],
                        radius: args[2],
                        startAngle: (args[3] * Math.PI) / 180,
                        endAngle: (args[4] * Math.PI) / 180,
                        color: '#2563eb'
                    });
                } else {
                    alert('ARC 명령어 형식: ARC x y radius startAngle endAngle');
                }
                break;

            case 'EXTRUDE':
                if (args.length === 1) {
                    extrudeTo3D(args[0]);
                } else {
                    alert('EXTRUDE 명령어 형식: EXTRUDE height');
                }
                break;

            default:
                alert('알 수 없는 명령어입니다. LINE, CIRCLE, RECTANGLE, ARC, EXTRUDE 중 하나를 사용하세요.');
        }
    } catch (error) {
        alert('명령어 실행 중 오류가 발생했습니다: ' + error.message);
    }
}

/**
 * 2D 도형 추가
 */
function addShape2D(shape) {
    drawingShapes.push(shape);
    redraw2D();
}

/**
 * 도면 초기화
 */
function clearDrawing() {
    drawingShapes = [];
    redraw2D();
    if (scene3D && mesh3D) {
        scene3D.remove(mesh3D);
        mesh3D = null;
    }
}

/**
 * 2D 뷰로 전환
 */
function switchTo2DView() {
    currentView = '2d';
    document.getElementById('drawingView2D').classList.remove('hidden');
    document.getElementById('drawingView3D').classList.add('hidden');
    document.getElementById('btn2DView').classList.add('active');
    document.getElementById('btn3DView').classList.remove('active');
    resizeCanvas2D();
}

/**
 * 3D 뷰로 전환
 */
function switchTo3DView() {
    currentView = '3d';
    document.getElementById('drawingView2D').classList.add('hidden');
    document.getElementById('drawingView3D').classList.remove('hidden');
    document.getElementById('btn2DView').classList.remove('active');
    document.getElementById('btn3DView').classList.add('active');
    initialize3DViewer();
    update3DModel();
}

/**
 * 3D 뷰어 초기화
 */
function initialize3DViewer() {
    const container = document.getElementById('drawingCanvas3D');
    if (!container || scene3D) return;

    // Scene 생성
    scene3D = new THREE.Scene();
    scene3D.background = new THREE.Color(0xf8fafc);

    // Camera 생성
    camera3D = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera3D.position.set(0, 0, 200);

    // Renderer 생성
    renderer3D = new THREE.WebGLRenderer({ antialias: true });
    renderer3D.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer3D.domElement);

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene3D.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene3D.add(directionalLight);

    // 축 헬퍼 추가
    const axesHelper = new THREE.AxesHelper(50);
    scene3D.add(axesHelper);

    // 그리드 헬퍼 추가
    const gridHelper = new THREE.GridHelper(200, 20);
    scene3D.add(gridHelper);

    // 마우스 컨트롤 (간단한 구현)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer3D.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
    });

    renderer3D.domElement.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (deltaMove.x !== 0 || deltaMove.y !== 0) {
            const rotationSpeed = 0.005;
            camera3D.position.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                deltaMove.x * rotationSpeed
            );
            camera3D.lookAt(0, 0, 0);
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    renderer3D.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    renderer3D.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const distance = camera3D.position.length();
        const newDistance = distance + (e.deltaY > 0 ? zoomSpeed : -zoomSpeed) * distance;
        camera3D.position.normalize().multiplyScalar(Math.max(50, Math.min(500, newDistance)));
    });

    // 애니메이션 루프
    function animate() {
        requestAnimationFrame(animate);
        renderer3D.render(scene3D, camera3D);
    }
    animate();

    // 리사이즈 핸들러
    window.addEventListener('resize', () => {
        if (container && camera3D && renderer3D) {
            camera3D.aspect = container.clientWidth / container.clientHeight;
            camera3D.updateProjectionMatrix();
            renderer3D.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

/**
 * 2D를 3D로 돌출
 */
function extrudeTo3D(height) {
    if (drawingShapes.length === 0) {
        alert('먼저 2D 도면을 그려주세요.');
        return;
    }

    // 기존 3D 모델 제거
    if (scene3D && mesh3D) {
        scene3D.remove(mesh3D);
        mesh3D = null;
    }

    // 2D 도형을 3D로 변환
    const shapes = drawingShapes.filter(s => s.type !== 'LINE' && s.type !== 'ARC');
    
    if (shapes.length === 0) {
        alert('돌출 가능한 도형이 없습니다. CIRCLE 또는 RECTANGLE을 그려주세요.');
        return;
    }

    // 첫 번째 도형을 3D로 변환 (간단한 구현)
    const shape = shapes[0];
    let geometry;

    if (shape.type === 'CIRCLE') {
        geometry = new THREE.CylinderGeometry(shape.radius, shape.radius, height, 32);
    } else if (shape.type === 'RECTANGLE') {
        geometry = new THREE.BoxGeometry(shape.width, shape.height, height);
    }

    if (geometry) {
        const material = new THREE.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE.DoubleSide
        });
        mesh3D = new THREE.Mesh(geometry, material);
        mesh3D.position.set(shape.x || 0, shape.y || 0, height / 2);
        scene3D.add(mesh3D);

        // 3D 뷰로 자동 전환
        switchTo3DView();
    }
}

/**
 * 3D 모델 업데이트
 */
function update3DModel() {
    if (currentView === '3d' && scene3D) {
        // 3D 모델이 있으면 다시 렌더링
        if (mesh3D) {
            // 이미 렌더링됨
        }
    }
}

