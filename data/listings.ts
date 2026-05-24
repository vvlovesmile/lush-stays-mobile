export type DiscountRule = {
  min_nights: number;
  max_nights: number | null;
  discount_rate: number;
  label: string;
};

export type Listing = {
  id: string;
  slug: string;
  title: string;
  locationLabel: string;
  district: string;
  coverImage: string;
  galleryImages: string[];
  pricePerNightThb: number;
  maxGuests: number;
  bed_label: string;
  bathroomLabel: string;
  shortDescription: string;
  description: string;
  overview: string[];
  amenities: string[];
  houseRules: string[];
  discountRules: DiscountRule[];
};

export const defaultDiscountRules: DiscountRule[] = [
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

export const listings: Listing[] = [
  {
    id: "1",
    slug: "lanna-garden-villa",
    title: "兰纳木质花园别墅",
    locationLabel: "清迈 · 宁曼",
    district: "Nimman",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop",
    ],
    pricePerNightThb: 430,
    maxGuests: 2,
    bed_label: "一张双人床",
    bathroomLabel: "独立卫浴",
    shortDescription: "藏在绿植与木质空间里的安静旅居。",
    description:
      "这是一处适合慢下来生活的清迈小屋。木质空间、自然光线与安静庭院共同构成柔和的旅居氛围，适合短住、远程办公，或只是给自己一段安静的城市假期。",
    overview: ["最多入住 2 位客人", "1 间卧室", "1 间独立卫浴", "适合短住与慢旅行"],
    amenities: ["空调", "Wi-Fi", "独立卫浴", "庭院空间", "基础洗漱用品"],
    houseRules: ["入住时间 15:00 后", "退房时间 11:00 前", "入住前 14 天可免费取消", "请保持安静，尊重邻里"],
    discountRules: defaultDiscountRules,
  },
  {
    id: "2",
    slug: "tropical-courtyard-stay",
    title: "热带庭院小屋",
    locationLabel: "清迈 · 古城边",
    district: "Old City",
    coverImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1400&auto=format&fit=crop",
    ],
    pricePerNightThb: 520,
    maxGuests: 3,
    bed_label: "一张双人床",
    bathroomLabel: "独立卫浴",
    shortDescription: "适合慢下来喝咖啡、晒太阳的庭院空间。",
    description:
      "这间庭院小屋位于清迈古城附近，适合想要靠近市区却仍保留安静感的旅人。早晨可以在庭院喝咖啡，傍晚步行探索附近的小店与餐厅。",
    overview: ["最多入住 3 位客人", "1 间卧室", "1 间独立卫浴", "带庭院休息区"],
    amenities: ["空调", "Wi-Fi", "庭院", "咖啡角", "基础厨房用品"],
    houseRules: ["入住时间 15:00 后", "退房时间 11:00 前", "入住前 14 天可免费取消", "禁止举办派对"],
    discountRules: defaultDiscountRules,
  },
  {
    id: "3",
    slug: "quiet-lane-suite",
    title: "安静巷子套房",
    locationLabel: "清迈 · 素贴",
    district: "Suthep",
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1400&auto=format&fit=crop",
    ],
    pricePerNightThb: 390,
    maxGuests: 2,
    bed_label: "一张双人床",
    bathroomLabel: "独立卫浴",
    shortDescription: "在安静街区里，保留属于自己的旅居节奏。",
    description:
      "位于素贴附近安静巷子中的简洁套房，适合一个人或两个人停留。空间不夸张，却足够舒适，适合想要安静工作与生活的旅人。",
    overview: ["最多入住 2 位客人", "1 间卧室", "1 间独立卫浴", "靠近素贴生活区"],
    amenities: ["空调", "Wi-Fi", "办公桌", "独立卫浴", "洗衣便利"],
    houseRules: ["入住时间 15:00 后", "退房时间 11:00 前", "入住前 14 天可免费取消", "室内禁止吸烟"],
    discountRules: defaultDiscountRules,
  },
  {
    id: "4",
    slug: "forest-view-loft",
    title: "森林景观 Loft",
    locationLabel: "清迈 · 近大学区",
    district: "University Area",
    coverImage:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=1400&auto=format&fit=crop",
    ],
    pricePerNightThb: 680,
    maxGuests: 4,
    bed_label: "一张双人床",
    bathroomLabel: "独立卫浴",
    shortDescription: "明亮开阔的空间，适合朋友或小家庭停留。",
    description:
      "这是一间更适合多人同行的 Loft 房源。明亮的公共空间与舒适卧室让旅居更轻松，适合朋友、小家庭或短期工作旅居。",
    overview: ["最多入住 4 位客人", "2 间卧室", "1 间独立卫浴", "适合朋友与家庭"],
    amenities: ["空调", "Wi-Fi", "客厅", "基础厨房", "停车便利"],
    houseRules: ["入住时间 15:00 后", "退房时间 11:00 前", "入住前 14 天可免费取消", "请勿大声喧哗"],
    discountRules: defaultDiscountRules,
  },
  {
    id: "5",
    slug: "slow-morning-studio",
    title: "慢早晨 Studio",
    locationLabel: "清迈 · 咖啡街区",
    district: "Cafe Area",
    coverImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1400&auto=format&fit=crop",
    ],
    pricePerNightThb: 360,
    maxGuests: 2,
    bed_label: "一张双人床",
    bathroomLabel: "独立卫浴",
    shortDescription: "适合一个人或两个人，住进轻松的清迈日常。",
    description:
      "小而舒适的 Studio，适合喜欢轻松街区氛围的旅人。附近有咖啡馆、小餐厅与生活便利设施，很适合短暂停留。",
    overview: ["最多入住 2 位客人", "1 间卧室", "1 间独立卫浴", "适合个人旅居"],
    amenities: ["空调", "Wi-Fi", "独立卫浴", "咖啡街区", "生活便利"],
    houseRules: ["入住时间 15:00 后", "退房时间 11:00 前", "入住前 14 天可免费取消", "请爱护房间物品"],
    discountRules: defaultDiscountRules,
  },
];

export function getListingBySlug(slug: string) {
  return listings.find((listing) => listing.slug === slug);
}
