/**
 * 용접지그 컴포넌트 정의
 * 각 컴포넌트의 시각적 속성과 기본 데이터를 정의합니다.
 */

const COMPONENT_DEFS = {
    base_plate: {
        name: "베이스 플레이트",
        width: 200,
        height: 200,
        color: "#2d2d2d",
        stroke: "#4b5563",
        type: "base",
        zIndex: 0
    },
    rest_block: {
        name: "레스트 블록",
        width: 40,
        height: 40,
        color: "#4b5563",
        stroke: "#9ca3af",
        type: "unit",
        zIndex: 10
    },
    clamp_toggle: {
        name: "토글 클램프",
        width: 60,
        height: 80,
        color: "#3b82f6",
        stroke: "#2563eb",
        type: "mechanism",
        zIndex: 20,
        props: {
            state: { type: 'select', options: ['열림', '닫힘'], value: '닫힘' },
            model: { type: 'text', value: 'TC-200' }
        }
    },
    clamp_swing: {
        name: "스윙 클램프",
        width: 50,
        height: 50,
        color: "#8b5cf6",
        stroke: "#7c3aed",
        type: "mechanism",
        zIndex: 20,
        props: {
            angle: { type: 'number', value: 90 },
            arm_length: { type: 'number', value: 40 }
        }
    },
    clamp_power: {
        name: "파워 클램프",
        width: 60,
        height: 90,
        color: "#1d4ed8",
        stroke: "#1e40af",
        type: "mechanism",
        zIndex: 20,
        props: {
            model: { type: 'text', value: 'PC-100' },
            pressure: { type: 'number', value: 150 }
        }
    },
    clamp_l: {
        name: "L-클램프",
        width: 55,
        height: 70,
        color: "#4338ca",
        stroke: "#3730a3",
        type: "mechanism",
        zIndex: 20,
        props: {
            arm_length: { type: 'number', value: 60 },
            reach: { type: 'number', value: 30 }
        }
    },
    clamp_pin: {
        name: "핀 클램프",
        width: 40,
        height: 40,
        color: "#0f766e",
        stroke: "#0d9488",
        type: "mechanism",
        zIndex: 20,
        props: {
            diameter: { type: 'number', value: 20 }
        }
    },
    pin_round: {
        name: "라운드 핀",
        width: 20,
        height: 20,
        color: "#ef4444",
        stroke: "#dc2626",
        type: "locator",
        shape: "circle",
        zIndex: 15,
        props: {
            diameter: { type: 'number', value: 16 }
        }
    },
    pin_diamond: {
        name: "다이아몬드 핀",
        width: 20,
        height: 20,
        color: "#f59e0b",
        stroke: "#d97706",
        type: "locator",
        shape: "diamond",
        zIndex: 15,
        props: {
            diameter: { type: 'number', value: 16 }
        }
    },
    shim_pack: {
        name: "심 팩",
        width: 40,
        height: 10,
        color: "#10b981",
        stroke: "#059669",
        type: "adjustment",
        zIndex: 5,
        props: {
            thickness: { type: 'number', value: 1.0 }
        }
    },
    wedge_unit: {
        name: "웨지 유닛",
        width: 40,
        height: 30,
        color: "#ec4899",
        stroke: "#db2777",
        type: "adjustment",
        zIndex: 5,
        props: {
            angle: { type: 'number', value: 5 }
        }
    }
};

/**
 * 지그 컴포넌트 클래스
 */
class JigComponent {
    constructor(type, x, y) {
        const def = COMPONENT_DEFS[type];
        if (!def) {
            throw new Error(`Unknown component type: ${type}`);
        }

        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.type = type;
        this.name = def.name;
        this.x = x;
        this.y = y;
        this.width = def.width;
        this.height = def.height;
        this.rotation = 0;
        this.selected = false;

        // 속성 복사
        this.props = {};
        if (def.props) {
            Object.entries(def.props).forEach(([key, config]) => {
                this.props[key] = config.value;
            });
        }
    }

    /**
     * 컴포넌트를 캔버스에 그립니다
     */
    draw(ctx) {
        const def = COMPONENT_DEFS[this.type];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        // 선택된 경우 하이라이트
        if (this.selected) {
            ctx.shadowColor = "#3b82f6";
            ctx.shadowBlur = 10;
            ctx.strokeStyle = "#60a5fa";
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = def.stroke;
            ctx.lineWidth = 1;
        }

        ctx.fillStyle = def.color;

        // 모양에 따라 그리기
        if (def.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 중심 십자선
            ctx.beginPath();
            ctx.moveTo(-this.width / 4, 0);
            ctx.lineTo(this.width / 4, 0);
            ctx.moveTo(0, -this.width / 4);
            ctx.lineTo(0, this.width / 4);
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.stroke();

        } else if (def.shape === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(0, -this.height / 2);
            ctx.lineTo(this.width / 2, 0);
            ctx.lineTo(0, this.height / 2);
            ctx.lineTo(-this.width / 2, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // 기본 사각형
            ctx.beginPath();
            ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.fill();
            ctx.stroke();

            // 클램프인 경우 방향 표시
            if (this.type.includes('clamp')) {
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.beginPath();
                ctx.moveTo(-5, 0);
                ctx.lineTo(5, 0);
                ctx.lineTo(0, -10);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    /**
     * 마우스 클릭이 컴포넌트 내부인지 확인
     */
    contains(mx, my) {
        // 간단한 바운딩 박스 충돌 검사 (회전 무시)
        return (
            mx >= this.x - this.width / 2 &&
            mx <= this.x + this.width / 2 &&
            my >= this.y - this.height / 2 &&
            my <= this.y + this.height / 2
        );
    }
}

