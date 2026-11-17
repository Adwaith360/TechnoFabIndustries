"use client";

import { useRef, useState, type KeyboardEvent } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
}

export const manufacturingServices: AccordionItem[] = [
  { id: "fabrication", title: "Fabrication & assembly", imageUrl: "/assets/fabrication.webp", alt: "Welded brackets and reinforced assemblies" },
  { id: "laser", title: "Laser cutting", imageUrl: "/assets/laser-cutting.webp", alt: "Laser cutting a steel plate" },
  { id: "bending", title: "CNC bending", imageUrl: "/assets/cnc-bending.webp", alt: "Press brake bending sheet metal" },
  { id: "coating", title: "Coating", imageUrl: "/assets/coating.webp", alt: "Powder coated brackets and enclosures" },
];

interface Props {
  items?: AccordionItem[];
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
}

/** React/Tailwind edition of the live site's native accordion.
 * Adapted from the Interactive Image Accordion supplied by the user (Le Thanh).
 * The existing static website does not import this optional TSX file.
 */
export function LandingAccordionItem({ items = manufacturingServices, defaultActiveId, onActiveChange }: Props) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const select = (id: string) => { setActiveId(id); onActiveChange?.(id); };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: (index + 1) % items.length, ArrowDown: (index + 1) % items.length, ArrowLeft: (index - 1 + items.length) % items.length, ArrowUp: (index - 1 + items.length) % items.length, Home: 0, End: items.length - 1 };
    if (event.key in keys) { event.preventDefault(); refs.current[keys[event.key]]?.focus(); }
  };

  return (
    <div role="group" aria-label="Explore manufacturing services" className="flex h-[475px] w-full flex-col gap-2 md:h-[470px] md:flex-row md:gap-3">
      {items.map((item, index) => {
        const active = item.id === activeId;
        return (
          <button key={item.id} ref={element => { refs.current[index] = element; }} type="button" aria-pressed={active} aria-label={item.title}
            onPointerEnter={event => { if (event.pointerType === "mouse") select(item.id); }}
            onClick={() => select(item.id)} onFocus={() => select(item.id)} onKeyDown={event => keyboard(event, index)}
            className={`relative min-h-0 min-w-0 overflow-hidden rounded-md bg-neutral-900 text-left text-white transition-[flex-grow,flex-basis] duration-700 ease-in-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${active ? "flex-1 basis-0" : "grow-0 shrink-0 basis-[58px]"}`}>
            <img src={item.imageUrl} alt={item.alt} loading="lazy" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />
            <span aria-hidden="true" className="absolute left-4 top-4 text-xs font-semibold">{String(index + 1).padStart(2, "0")}</span>
            <span className={active ? "absolute bottom-6 left-5 right-5 text-2xl font-semibold" : "absolute left-12 top-4 whitespace-nowrap text-base font-semibold md:bottom-6 md:left-1/2 md:top-auto md:-translate-x-1/2 md:rotate-180 md:[writing-mode:vertical-rl]"}>{item.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LandingAccordionItem;
