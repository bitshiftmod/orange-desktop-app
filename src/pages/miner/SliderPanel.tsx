import * as Slider from "@radix-ui/react-slider";
import { HTMLAttributes } from "react";
interface SliderPanelProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  setValue: (value: number) => void;
  ticker: string;
  min: number;
  max: number;
  step: number;
}

const SliderPanel = ({
  label,
  value,
  setValue,
  ticker,
  min,
  max,
  step,
}: SliderPanelProps) => {
  return (
    <div className="text-sm p-2 rounded bg-orange-300/60 w-full text-center">
      <div className="font-bold">{label}</div>
      <div className="flex gap-2 items-center">
        <button
          className="rounded px-1 bg-orange-500 size-5 text-orange-100"
          disabled={value <= min}
          onClick={() => setValue(Math.max(value - step, min))}
        >
          -
        </button>
        <Slider.Root
          className="relative flex h-5 w-full touch-none select-none items-center grow"
          min={min}
          max={max}
          step={step}
          onValueChange={(value) => setValue(value[0])}
          value={[value]}
        >
          <Slider.Track className="relative h-[3px] grow rounded-full bg-orange-400">
            <Slider.Range className="absolute h-full rounded-full bg-orange-400" />
          </Slider.Track>
          <Slider.Thumb
            className="block size-3 rounded-full bg-orange-500 border border-orange-600 hover:bg-violet3 focus:outline-none"
            aria-label={label}
          />
        </Slider.Root>

        <button className="rounded px-1 bg-orange-500 size-5 text-orange-100"
          disabled={value >= max}
          onClick={() => setValue(Math.min(value + step, max))}
        >
          +
        </button>
      </div>
      <div className="text-xs font-semibold">{ticker}</div>
    </div>
  );
};
export default SliderPanel;
