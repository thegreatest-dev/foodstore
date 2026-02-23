/**
 * Shared category configuration.
 *
 * `id`   – URL slug used in ?category=<id>
 * `name` – exact string stored in Firestore products.category
 * `image` – local public image for the carousel card
 * `isHighlighted` – accent style on the carousel card
 */
export interface CategoryConfig {
  id: string;
  name: string;
  image: string;
  isHighlighted: boolean;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "rice-grains",
    name: "Rice & Grains",
    image: "/images/grain.png",
    isHighlighted: false,
  },
  {
    id: "proteins",
    name: "Proteins",
    image: "/images/protein.png",
    isHighlighted: false,
  },
  {
    id: "condiments-spices",
    name: "Condiments & Spices",
    image: "/images/spice.png",
    isHighlighted: true,
  },
  {
    id: "oils-pantry",
    name: "Oils & Pantry Staples",
    image: "/images/oils.png",
    isHighlighted: false,
  },
  {
    id: "beverages",
    name: "Beverages",
    image: "/images/beverages.png",
    isHighlighted: false,
  },
  {
    id: "pasta-packaged",
    name: "Pasta & Packaged Goods",
    image: "/images/spag.png",
    isHighlighted: false,
  },
  {
    id: "food-bundles",
    name: "Food Bundles",
    image: "/images/mixed_vegetables.png",
    isHighlighted: false,
  },
  {
    id: "fresh-produce",
    name: "Fresh Produce",
    image: "/images/potato.png",
    isHighlighted: false,
  },
  {
    id: "cooking-essentials",
    name: "Cooking Essentials",
    image: "/images/honey.png",
    isHighlighted: false,
  },
];

/** Maps URL slug → Firestore category name */
export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.name])
);

/** Maps Firestore category name → URL slug */
export const CATEGORY_TO_SLUG: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.id])
);
