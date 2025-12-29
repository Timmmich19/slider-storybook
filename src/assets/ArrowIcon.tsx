import type { FC, SVGProps } from "react";

type ArrowDirection = "right" | "left" | "up" | "down";

interface ArrowIconProps extends SVGProps<SVGSVGElement> {
  direction?: ArrowDirection;
}

const rotationMap: Record<ArrowDirection, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: -90,
};

const ArrowIcon: FC<ArrowIconProps> = ({ direction = "right", ...props }) => {
  return (
    <svg
      width={8}
      height={12}
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${rotationMap[direction]}deg)`,
      }}
      {...props}
    >
      <path d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071" stroke="#3877EE" strokeWidth={2} />
    </svg>
  );
};

export default ArrowIcon;
