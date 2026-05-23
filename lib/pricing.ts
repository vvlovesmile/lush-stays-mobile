import type { DiscountRule } from "@/data/listings";

export type PricingResult = {
  nights: number;
  basePrice: number;
  discountRate: number;
  discountLabel: string;
  originalTotal: number;
  finalTotal: number;
  savedAmount: number;
};

const DEFAULT_DISCOUNT_RULES: DiscountRule[] = [
  {
    min_nights: 1,
    max_nights: 6,
    discount_rate: 1,
    label: "1-6晚 · 标准价格",
  },
  {
    min_nights: 7,
    max_nights: 13,
    discount_rate: 0.9,
    label: "7-13晚 · 9折",
  },
  {
    min_nights: 14,
    max_nights: 20,
    discount_rate: 0.8,
    label: "14-20晚 · 8折",
  },
  {
    min_nights: 21,
    max_nights: 27,
    discount_rate: 0.7,
    label: "21-27晚 · 7折",
  },
  {
    min_nights: 28,
    max_nights: null,
    discount_rate: 0.6,
    label: "28晚及以上 · 6折",
  },
];

function findDiscountRule(nights: number, rules: DiscountRule[]) {
  const activeRules = rules.length > 0 ? rules : DEFAULT_DISCOUNT_RULES;

  return (
    activeRules.find((rule) => {
      const meetsMin = nights >= rule.min_nights;
      const meetsMax = rule.max_nights === null || nights <= rule.max_nights;

      return meetsMin && meetsMax;
    }) ?? DEFAULT_DISCOUNT_RULES[0]
  );
}

export function calculateBookingPrice(params: {
  pricePerNightThb: number;
  nights: number;
  rooms: number;
  discountRules?: DiscountRule[];
}): PricingResult {
  const { pricePerNightThb, nights, rooms, discountRules = [] } = params;

  const safeNights = Math.max(nights, 0);
  const safeRooms = Math.max(rooms, 1);

  const originalTotal = pricePerNightThb * safeNights * safeRooms;
  const rule = findDiscountRule(safeNights, discountRules);

  const discountRate = rule.discount_rate;
  const finalTotal = Math.round(originalTotal * discountRate);

  return {
    nights: safeNights,
    basePrice: pricePerNightThb,
    discountRate,
    discountLabel: rule.label,
    originalTotal,
    finalTotal,
    savedAmount: originalTotal - finalTotal,
  };
}