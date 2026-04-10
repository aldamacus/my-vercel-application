"use client";

import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Baby,
  Bed,
  Blinds,
  CalendarCheck,
  CircleAlert,
  Coffee,
  CookingPot,
  DoorOpen,
  Droplets,
  Fence,
  Flame,
  KeyRound,
  Lock,
  Microwave,
  Refrigerator,
  Shirt,
  Sparkles,
  Thermometer,
  Home,
  Tv,
  Utensils,
  UtensilsCrossed,
  Wind,
  Wifi,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AmenityItem = {
  label: string;
  detail?: string;
  icon: LucideIcon;
};

export type AmenityCategory = {
  title: string;
  items: AmenityItem[];
};

type AmenitiesPreviewVariant = "default" | "compact";

const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    title: "Bathroom",
    items: [
      { label: "Hair dryer", icon: Wind },
      { label: "Shampoo", icon: Sparkles },
      { label: "Hot water", icon: Droplets },
    ],
  },
  {
    title: "Bedroom and laundry",
    items: [
      {
        label: "Essentials",
        detail: "Towels, bed sheets, soap, and toilet paper",
        icon: Bed,
      },
      { label: "Hangers", icon: Shirt },
      { label: "Bed linens", icon: Bed },
      { label: "Extra pillows and blankets", icon: Bed },
      { label: "Room-darkening shades", icon: Blinds },
    ],
  },
  {
    title: "Entertainment",
    items: [{ label: "TV with standard cable", icon: Tv }],
  },
  {
    title: "Family",
    items: [
      { label: "Pack 'n play/Travel crib", icon: Baby },
      { label: "High chair", icon: Armchair },
    ],
  },
  {
    title: "Heating and cooling",
    items: [{ label: "Heating", icon: Thermometer }],
  },
  {
    title: "Home safety",
    items: [{ label: "Smoke alarm", icon: CircleAlert }],
  },
  {
    title: "Internet and office",
    items: [{ label: "Wifi", icon: Wifi }],
  },
  {
    title: "Kitchen and dining",
    items: [
      {
        label: "Kitchen",
        detail: "Space where guests can cook their own meals",
        icon: Utensils,
      },
      { label: "Refrigerator", icon: Refrigerator },
      { label: "Microwave", icon: Microwave },
      {
        label: "Cooking basics",
        detail: "Pots and pans, oil, salt and pepper",
        icon: CookingPot,
      },
      {
        label: "Dishes and silverware",
        detail: "Bowls, chopsticks, plates, cups, etc.",
        icon: UtensilsCrossed,
      },
      { label: "Stove", icon: Flame },
      { label: "Coffee maker", icon: Coffee },
    ],
  },
  {
    title: "Location features",
    items: [
      {
        label: "Private entrance",
        detail: "Separate street or building entrance",
        icon: DoorOpen,
      },
    ],
  },
  {
    title: "Outdoor",
    items: [{ label: "Private patio or balcony", icon: Fence }],
  },
  {
    title: "Parking and facilities",
    items: [
      {
        label: "Single level home",
        detail: "No stairs in home",
        icon: Home,
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        label: "Long term stays allowed",
        detail: "Allow stay for 28 days or more",
        icon: CalendarCheck,
      },
      { label: "Self check-in", icon: KeyRound },
      {
        label: "Keypad",
        detail: "Check yourself into the home with a door code",
        icon: Lock,
      },
    ],
  },
];

/** Column-first preview: left column top-to-bottom, then right column (Airbnb-style). */
const PREVIEW_LABELS: readonly string[] = [
  "Kitchen",
  "TV with standard cable",
  "Pack 'n play/Travel crib",
  "Hair dryer",
  "Microwave",
  "Wifi",
  "Private patio or balcony",
  "High chair",
  "Refrigerator",
  "Smoke alarm",
];

const PREVIEW_COUNT = 10;

function amenityByLabelMap(
  categories: AmenityCategory[]
): Map<string, AmenityItem> {
  const map = new Map<string, AmenityItem>();
  for (const cat of categories) {
    for (const item of cat.items) {
      if (!map.has(item.label)) map.set(item.label, item);
    }
  }
  return map;
}

function PreviewGrid({ items }: { items: AmenityItem[] }) {
  const rowCount = Math.ceil(items.length / 2);
  return (
    <div
      className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 sm:grid-flow-col"
      style={
        items.length > 0
          ? { gridTemplateRows: `repeat(${rowCount}, minmax(0, auto))` }
          : undefined
      }
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-start gap-3">
            <Icon
              className="size-6 shrink-0 text-neutral-900"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="text-base text-neutral-900">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CompactPreviewGrid({ items }: { items: AmenityItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex min-h-16 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
          >
            <Icon
              className="size-5 shrink-0 text-neutral-900"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="text-sm font-medium text-neutral-900">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FullAmenityList({ categories }: { categories: AmenityCategory[] }) {
  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <div key={cat.title}>
          <h3 className="text-lg font-semibold text-neutral-900">{cat.title}</h3>
          <ul className="mt-4 space-y-4">
            {cat.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-start gap-4">
                  <Icon
                    className="size-6 shrink-0 text-neutral-900"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-base text-neutral-900">{item.label}</p>
                    {item.detail ? (
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                        {item.detail}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Amenities({
  className,
  title = "What this place offers",
  categories = AMENITY_CATEGORIES,
  previewLabels = PREVIEW_LABELS,
  previewCount = PREVIEW_COUNT,
  showToggle,
  previewVariant = "default",
}: {
  className?: string;
  title?: string;
  categories?: AmenityCategory[];
  previewLabels?: readonly string[];
  previewCount?: number;
  showToggle?: boolean;
  previewVariant?: AmenitiesPreviewVariant;
}) {
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);

  const labelMap = useMemo(
    () => amenityByLabelMap(categories),
    [categories]
  );

  const totalCount = useMemo(
    () => categories.reduce((n, c) => n + c.items.length, 0),
    [categories]
  );

  const previewItems = useMemo(() => {
    const list: AmenityItem[] = [];
    for (const label of previewLabels) {
      const item = labelMap.get(label);
      if (item) list.push(item);
      if (list.length >= previewCount) break;
    }
    return list;
  }, [labelMap, previewCount, previewLabels]);

  const shouldShowToggle = showToggle ?? totalCount > previewCount;

  useEffect(() => {
    if (!amenitiesModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAmenitiesModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [amenitiesModalOpen]);

  return (
    <section
      className={cn("mt-12", className)}
      aria-labelledby="amenities-heading"
    >
      <h2
        id="amenities-heading"
        className="text-xl font-semibold text-neutral-900 md:text-2xl"
      >
        {title}
      </h2>

      <div className="mt-6">
        {previewVariant === "compact" ? (
          <CompactPreviewGrid items={previewItems} />
        ) : (
          <PreviewGrid items={previewItems} />
        )}
      </div>

      {shouldShowToggle ? (
        <Button
          type="button"
          variant="outline"
          className="mt-8 rounded-lg border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-50"
          onClick={() => setAmenitiesModalOpen(true)}
        >
          {`Show all ${totalCount} amenities`}
        </Button>
      ) : null}

      {amenitiesModalOpen ? (
        <div
          className="fixed inset-0 z-70 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onClick={() => setAmenitiesModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="amenities-modal-title"
            className="flex max-h-[min(90vh,44rem)] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
              <h2
                id="amenities-modal-title"
                className="text-lg font-semibold text-neutral-900 md:text-xl"
              >
                What this place offers
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                onClick={() => setAmenitiesModalOpen(false)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <FullAmenityList categories={categories} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
