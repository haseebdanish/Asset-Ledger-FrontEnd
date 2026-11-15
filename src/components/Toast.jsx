import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const styles = {
        success: {
            border: "border-[#69B58A]",
            text: "text-[#9BD5B1]",
            icon: "✓",
        },
        error: {
            border: "border-[#E47D7D]",
            text: "text-[#EBA0A0]",
            icon: "!",
        },
    };

    const currentStyle = styles[type] || styles.success;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed right-5 top-5 z-[100] flex items-center gap-3 border ${currentStyle.border} bg-[#2B3038] px-5 py-4 shadow-xl`}
        >
            <span className={`text-lg font-bold ${currentStyle.text}`}>
                {currentStyle.icon}
            </span>

            <p className="text-sm font-medium text-[#F1EFE8]">
                {message}
            </p>

            <button
                onClick={onClose}
                aria-label="Close notification"
                className="ml-3 text-[#A7ABB4] transition hover:text-[#F1EFE8]"
            >
                ×
            </button>
        </div>
    );
}

export default Toast;
