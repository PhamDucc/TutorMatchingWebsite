"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

type Props = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
};

const BEAM_COLOR = "255,196,64";
const SPREAD_DEG = 9; // độ xoè của tia sáng (nửa góc) — dùng chung cho cả hình vẽ lẫn ngưỡng "trúng đích"
const NEAR_WIDTH = 6; // độ rộng đầu tia sáng tại chính đèn pin (không nhọn)
const PIVOT_OFFSET_RIGHT = 24; // khoảng cách từ mép phải ô input tới đầu đèn (lens)

export default function FlashlightPasswordInput({
    name,
    value,
    onChange,
    required,
    minLength,
    maxLength,
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOn, setIsOn] = useState(false);
    const [angleDeg, setAngleDeg] = useState(180);
    const [beamLength, setBeamLength] = useState(0);
    const [pivot, setPivot] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!isOn) return;

        const handleMouseMove = (e: MouseEvent) => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const pivotScreenX = rect.right - PIVOT_OFFSET_RIGHT;
            const pivotScreenY = rect.top + rect.height / 2;
            const dx = e.clientX - pivotScreenX;
            const dy = e.clientY - pivotScreenY;
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            setAngleDeg(angle);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isOn]);

    const toggleFlashlight = () => {
        if (isOn) {
            setIsOn(false);
            return;
        }
        const wrapper = wrapperRef.current;
        if (wrapper) {
            const rect = wrapper.getBoundingClientRect();
            setBeamLength(rect.width);
            setPivot({
                x: rect.width - PIVOT_OFFSET_RIGHT,
                y: rect.height / 2,
            });
        }
        setAngleDeg(180);
        setIsOn(true);
    };

    // Độ lệch so với hướng "chĩa thẳng vào ô" (180°)
    const rawDiff = ((angleDeg - 180 + 540) % 360) - 180;
    const aimedAtBox = Math.abs(rawDiff) <= SPREAD_DEG + 4;
    const reveal = isOn && aimedAtBox;

    // --- Tính hình học cho khối icon + tia sáng (toạ độ cục bộ, gốc (0,0) = đầu đèn) ---
    const spreadRad = (SPREAD_DEG * Math.PI) / 180;
    const farHalf = NEAR_WIDTH / 2 + beamLength * Math.tan(spreadRad);
    const bodyHalf = 4;
    const maxHalf = Math.max(farHalf, bodyHalf) + 2;
    const svgLeftLocal = -(beamLength + 2);
    const svgWidth = beamLength + 2 + 25; // + phần thân đèn bên phải lens
    const svgHeight = maxHalf * 2;

    const beamPolygon = `
    0,${-NEAR_WIDTH / 2}
    0,${NEAR_WIDTH / 2}
    ${-beamLength},${farHalf}
    ${-beamLength},${-farHalf}
  `;

    return (
        <div ref={wrapperRef} className="relative">
            <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 z-10"
                strokeWidth={1.5}
            />

            <div className="relative overflow-hidden rounded border border-navy-500/30 focus-within:border-navy-700 focus-within:ring-1 focus-within:ring-navy-700 transition-colors bg-white">
                {!isOn ? (
                    <input
                        type="password"
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        minLength={minLength}
                        maxLength={maxLength}
                        autoComplete="current-password"
                        className="w-full pl-10 pr-12 py-2.5 text-ink bg-transparent focus:outline-none relative z-10"
                    />
                ) : (
                    <>
                        <input
                            type="text"
                            value={value}
                            readOnly
                            tabIndex={-1}
                            className="w-full pl-10 pr-12 py-2.5 text-transparent bg-transparent focus:outline-none relative z-10 pointer-events-none"
                        />

                        <div className="absolute inset-0 flex items-center pl-10 pr-12 pointer-events-none">
                            <span className="text-ink tracking-wider">
                                {reveal ? value : "•".repeat(value.length)}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {!isOn ? (
                // Trạng thái tắt: icon tĩnh, đúng vị trí góc phải ô nhập
                <button
                    type="button"
                    onClick={toggleFlashlight}
                    tabIndex={-1}
                    aria-label="Bật đèn pin xem mật khẩu"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-50 p-1"
                >
                    <svg width="30" height="18" viewBox="0 0 30 18" fill="none">
                        <rect x="12" y="5" width="15" height="8" rx="2" fill="#CBD5E1" />
                        <rect x="17" y="2.5" width="4" height="3" rx="1" fill="#94A3B8" />
                        <path d="M12 3.5 L4 6 L4 12 L12 14.5 Z" fill="#E2E8F0" />
                        <ellipse cx="4.5" cy="9" rx="1.8" ry="4.2" fill="#F1F5F9" />
                    </svg>
                </button>
            ) : (
                // Trạng thái bật: icon + tia sáng gộp thành 1 khối, cùng xoay quanh đúng đầu đèn (lens)
                <button
                    type="button"
                    onClick={toggleFlashlight}
                    aria-label="Tắt đèn pin"
                    className="absolute z-50"
                    style={{
                        left: pivot.x + svgLeftLocal,
                        top: pivot.y - maxHalf,
                        width: svgWidth,
                        height: svgHeight,
                        transformOrigin: `${beamLength + 2}px ${maxHalf}px`,
                        transform: `rotate(${angleDeg - 180}deg)`,
                    }}
                >
                    <svg
                        width={svgWidth}
                        height={svgHeight}
                        viewBox={`${svgLeftLocal} ${-maxHalf} ${svgWidth} ${svgHeight}`}
                    >
                        {/* Tia sáng - hình thang, đầu gần đèn không nhọn, đầu xa thu hẹp bớt */}
                        <polygon points={beamPolygon} fill={`rgba(${BEAM_COLOR},0.32)`} />

                        {/* Quầng sáng nhẹ quanh lens */}
                        <circle cx="0" cy="0" r="7" fill="#FBBF24" opacity="0.35" style={{ filter: "blur(2.5px)" }} />

                        {/* Thân đèn (bên phải lens) */}
                        <rect x="7.5" y="-4" width="15" height="8" rx="2" fill="#F59E0B" />
                        <rect x="12.5" y="-6.5" width="4" height="3" rx="1" fill="#D97706" />
                        {/* Housing loe ra, nối thân với lens */}
                        <path d="M7.5 -5.5 L-0.5 -3 L-0.5 3 L7.5 5.5 Z" fill="#FDE68A" />
                        {/* Lens - đúng điểm gốc xoay, cũng là điểm phát sáng */}
                        <ellipse cx="0" cy="0" rx="1.8" ry="4.2" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="0.6" />
                    </svg>
                </button>
            )}
        </div>
    );
}