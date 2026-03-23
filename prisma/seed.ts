import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

type SeedProduct = {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  isFeatured?: boolean;
};

type SeedCategory = {
  nameEn: string;
  nameAr: string;
  products: SeedProduct[];
};

type SeedShop = {
  owner: { name: string; email: string };
  name: string;
  slug: string;
  city: string;
  description: string;
  phoneNumber: string;
  whatsappNumber: string;
  address: string;
  defaultLanguage: "en" | "ar";
  deliveryFee: number;
  categories: SeedCategory[];
};

const shops: SeedShop[] = [
  {
    owner: { name: "Beirut Bakery Owner", email: "owner@beirutbakery.demo" },
    name: "Beirut Bakery",
    slug: "beirut-bakery",
    city: "Beirut",
    description: "Fresh man2oushe, kaak, croissants, and breakfast trays.",
    phoneNumber: "+9611111111",
    whatsappNumber: "9611111111",
    address: "Hamra Main Street, Beirut",
    defaultLanguage: "en",
    deliveryFee: 1.5,
    categories: [
      {
        nameEn: "Manakish",
        nameAr: "مناقيش",
        products: [
          { nameEn: "Zaatar Man2oushe", nameAr: "مناقيش زعتر", descriptionEn: "Classic zaatar on saj dough.", descriptionAr: "زعتر بلدي على عجينة صاج.", price: 1.5, isFeatured: true },
          { nameEn: "Cheese Man2oushe", nameAr: "مناقيش جبنة", descriptionEn: "Akkawi cheese with sesame crust.", descriptionAr: "جبنة عكاوي مع سمسم.", price: 2.0 },
          { nameEn: "Labneh Veggie Man2oushe", nameAr: "مناقيش لبنة وخضرة", descriptionEn: "Labneh, cucumber, mint, and olives.", descriptionAr: "لبنة وخيار ونعنع وزيتون.", price: 2.5 }
        ]
      },
      {
        nameEn: "Pastries",
        nameAr: "معجنات",
        products: [
          { nameEn: "Butter Croissant", nameAr: "كرواسان زبدة", descriptionEn: "Flaky butter croissant baked daily.", descriptionAr: "كرواسان زبدة طازج يوميًا.", price: 1.75 },
          { nameEn: "Pizza Roll", nameAr: "رول بيتزا", descriptionEn: "Mini pizza roll with cheese.", descriptionAr: "رول بيتزا صغير مع جبنة.", price: 1.25 },
          { nameEn: "Mini Spinach Pie", nameAr: "فطيرة سبانخ صغيرة", descriptionEn: "Tangy spinach pastry.", descriptionAr: "فطيرة سبانخ بحامض.", price: 1.1 }
        ]
      },
      {
        nameEn: "Drinks",
        nameAr: "مشروبات",
        products: [
          { nameEn: "Orange Juice", nameAr: "عصير برتقال", descriptionEn: "Freshly squeezed orange juice.", descriptionAr: "عصير برتقال طازج.", price: 2.25 },
          { nameEn: "Ayran", nameAr: "لبن عيران", descriptionEn: "Cold yogurt drink.", descriptionAr: "شراب لبن بارد.", price: 1.0 }
        ]
      }
    ]
  },
  {
    owner: { name: "Saida Mini Market Owner", email: "owner@saidamarket.demo" },
    name: "Saida Mini Market",
    slug: "saida-mini-market",
    city: "Saida",
    description: "Everyday groceries, snacks, and home essentials for quick neighborhood delivery.",
    phoneNumber: "+9612222222",
    whatsappNumber: "9612222222",
    address: "Riad El Solh Avenue, Saida",
    defaultLanguage: "ar",
    deliveryFee: 2,
    categories: [
      {
        nameEn: "Dairy & Breakfast",
        nameAr: "ألبان وفطور",
        products: [
          { nameEn: "Labneh Tub", nameAr: "لبنة علبة", descriptionEn: "Creamy labneh 500g.", descriptionAr: "لبنة كريمية ٥٠٠ غرام.", price: 2.8 },
          { nameEn: "Halloumi Cheese", nameAr: "جبنة حلوم", descriptionEn: "Traditional halloumi block.", descriptionAr: "قالب جبنة حلوم.", price: 3.6 },
          { nameEn: "Brown Eggs (12)", nameAr: "بيض بلدي ١٢", descriptionEn: "Twelve fresh brown eggs.", descriptionAr: "اثنا عشر بيضة طازجة.", price: 2.9 }
        ]
      },
      {
        nameEn: "Snacks",
        nameAr: "سناكات",
        products: [
          { nameEn: "Kaak Sticks", nameAr: "كعك أصابع", descriptionEn: "Sesame kaak sticks.", descriptionAr: "أصابع كعك بالسمسم.", price: 1.2 },
          { nameEn: "Mixed Nuts Cup", nameAr: "كوب مكسرات مشكلة", descriptionEn: "Roasted mixed nuts.", descriptionAr: "مكسرات محمصة مشكلة.", price: 2.4, isFeatured: true },
          { nameEn: "Potato Chips", nameAr: "شيبس بطاطا", descriptionEn: "Crunchy salted chips.", descriptionAr: "شيبس مملح مقرمش.", price: 0.95 }
        ]
      },
      {
        nameEn: "Home Essentials",
        nameAr: "احتياجات منزلية",
        products: [
          { nameEn: "Dish Soap", nameAr: "سائل جلي", descriptionEn: "Lemon dish soap bottle.", descriptionAr: "سائل جلي برائحة الليمون.", price: 1.8 },
          { nameEn: "Paper Towels", nameAr: "محارم مطبخ", descriptionEn: "Two-roll paper towel pack.", descriptionAr: "عبوة محارم مطبخ رولين.", price: 1.6 }
        ]
      }
    ]
  },
  {
    owner: { name: "Zahle Coffee Spot Owner", email: "owner@zahlecoffee.demo" },
    name: "Zahle Coffee Spot",
    slug: "zahle-coffee-spot",
    city: "Zahle",
    description: "Coffee, cold drinks, dessert cups, and fast morning pickup.",
    phoneNumber: "+9613333333",
    whatsappNumber: "9613333333",
    address: "Midan Area, Zahle",
    defaultLanguage: "en",
    deliveryFee: 1,
    categories: [
      {
        nameEn: "Coffee",
        nameAr: "قهوة",
        products: [
          { nameEn: "Arabic Coffee", nameAr: "قهوة عربية", descriptionEn: "Traditional Arabic coffee.", descriptionAr: "قهوة عربية تقليدية.", price: 1.5, isFeatured: true },
          { nameEn: "Cappuccino", nameAr: "كابتشينو", descriptionEn: "Espresso with steamed milk.", descriptionAr: "إسبريسو مع حليب مبخر.", price: 2.8 },
          { nameEn: "Iced Latte", nameAr: "آيس لاتيه", descriptionEn: "Cold latte with ice cubes.", descriptionAr: "لاتيه بارد مع مكعبات ثلج.", price: 3.1 }
        ]
      },
      {
        nameEn: "Breakfast Bites",
        nameAr: "لقمات فطور",
        products: [
          { nameEn: "Chocolate Croissant", nameAr: "كرواسان شوكولا", descriptionEn: "Warm croissant filled with chocolate.", descriptionAr: "كرواسان دافئ بحشوة شوكولا.", price: 2.2 },
          { nameEn: "Cheese Kaak", nameAr: "كعك جبنة", descriptionEn: "Street-style cheese kaak.", descriptionAr: "كعك جبنة على الطريقة اللبنانية.", price: 2.5 },
          { nameEn: "Date Maamoul", nameAr: "معمول تمر", descriptionEn: "Soft maamoul stuffed with dates.", descriptionAr: "معمول طري محشو تمر.", price: 1.6 }
        ]
      },
      {
        nameEn: "Cold Drinks",
        nameAr: "مشروبات باردة",
        products: [
          { nameEn: "Lemon Mint", nameAr: "ليمون نعنع", descriptionEn: "Fresh mint lemonade.", descriptionAr: "ليموناضة بالنعنع الطازج.", price: 2.9 },
          { nameEn: "Orange Juice", nameAr: "عصير برتقال", descriptionEn: "Fresh orange juice.", descriptionAr: "عصير برتقال طازج.", price: 2.4 }
        ]
      }
    ]
  }
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo12345", 10);

  for (const shopInput of shops) {
    const owner = await prisma.user.create({
      data: {
        name: shopInput.owner.name,
        email: shopInput.owner.email,
        passwordHash,
        role: UserRole.shop_owner,
      },
    });

    const shop = await prisma.shop.create({
      data: {
        ownerUserId: owner.id,
        name: shopInput.name,
        slug: shopInput.slug,
        description: shopInput.description,
        phoneNumber: shopInput.phoneNumber,
        whatsappNumber: shopInput.whatsappNumber,
        address: shopInput.address,
        city: shopInput.city,
        defaultLanguage: shopInput.defaultLanguage,
        openingHoursJson: JSON.stringify([
          { day: "Mon-Fri", hours: "7:00 - 20:00" },
          { day: "Sat-Sun", hours: "8:00 - 18:00" }
        ]),
        deliverySettingsJson: JSON.stringify({
          mode: "fixed",
          fee: shopInput.deliveryFee,
          areas: ["Hamra", "Achrafieh", "Verdun", "Saida Center", "Riad El Solh", "Zahle Midan"],
        }),
      },
    });

    for (const [categoryIndex, categoryInput] of shopInput.categories.entries()) {
      const category = await prisma.category.create({
        data: {
          shopId: shop.id,
          nameEn: categoryInput.nameEn,
          nameAr: categoryInput.nameAr,
          sortOrder: categoryIndex,
        },
      });

      for (const [productIndex, productInput] of categoryInput.products.entries()) {
        await prisma.product.create({
          data: {
            shopId: shop.id,
            categoryId: category.id,
            nameEn: productInput.nameEn,
            nameAr: productInput.nameAr,
            descriptionEn: productInput.descriptionEn,
            descriptionAr: productInput.descriptionAr,
            price: productInput.price,
            isFeatured: productInput.isFeatured ?? false,
            sortOrder: productIndex,
          },
        });
      }
    }

    await prisma.subscription.create({
      data: {
        shopId: shop.id,
        planName: "MVP",
        status: "trial",
        startDate: new Date(),
        monthlyPrice: 15,
      },
    });
  }

  const platformPassword = await bcrypt.hash("admin12345", 10);
  await prisma.user.create({
    data: {
      name: "Platform Admin",
      email: "admin@platform.demo",
      passwordHash: platformPassword,
      role: UserRole.platform_admin,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
