"use client";

interface AdSlotProps {
  slot:    string;
  style?:  React.CSSProperties;
  format?: "banner" | "rectangle" | "leaderboard";
}

const DIMENSIONS: Record<string, { w: number; h: number }> = {
  banner:      { w: 728, h: 90  },
  rectangle:   { w: 300, h: 250 },
  leaderboard: { w: 970, h: 90  },
};

export function AdSlot({ slot, style, format = "banner" }: AdSlotProps) {
  const { w, h } = DIMENSIONS[format];

  // In production replace with real AdSense code
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_ADSENSE_CLIENT) {
    return (
      <div style={{ textAlign: "center", ...style }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      className="ad-slot"
      style={{ width: "100%", maxWidth: w, height: h, margin: "0 auto", ...style }}
    >
      Ad · {w}×{h}
    </div>
  );
}
