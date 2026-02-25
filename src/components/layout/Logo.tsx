import Image from "next/image";

interface LogoProps {
  size?: number;
  variant?: "default" | "white";
}

export default function Logo({ size = 36, variant = "default" }: LogoProps): JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="ReeTrack logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      <span
        className={`text-[17px] font-black tracking-tight ${
          variant === "white" ? "text-white" : "text-[#1F2937]"
        }`}
      >
        ReeTrack
      </span>
    </div>
  );
}