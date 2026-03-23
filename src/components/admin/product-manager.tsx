"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CategoryOption = {
  id: string;
  nameEn: string;
};

type Product = {
  id: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  sortOrder: number;
  isAvailable: boolean;
  isFeatured: boolean;
};

const emptyDraft = {
  categoryId: "",
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  price: 0,
  sortOrder: 0,
  isAvailable: true,
  isFeatured: false,
};

export function ProductManager({
  categories,
  products,
}: {
  categories: CategoryOption[];
  products: Product[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(emptyDraft);

  async function createProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(emptyDraft);
    router.refresh();
  }

  async function updateProduct(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    router.refresh();
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create product</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <select className="h-10 rounded-xl border bg-white/80 px-3 text-sm" value={draft.categoryId} onChange={(e) => setDraft((state) => ({ ...state, categoryId: e.target.value }))}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nameEn}</option>
            ))}
          </select>
          <Input placeholder="Price" type="number" value={draft.price} onChange={(e) => setDraft((state) => ({ ...state, price: Number(e.target.value) }))} />
          <Input placeholder="Name (EN)" value={draft.nameEn} onChange={(e) => setDraft((state) => ({ ...state, nameEn: e.target.value }))} />
          <Input placeholder="Name (AR)" value={draft.nameAr} onChange={(e) => setDraft((state) => ({ ...state, nameAr: e.target.value }))} />
          <Input placeholder="Description (EN)" value={draft.descriptionEn} onChange={(e) => setDraft((state) => ({ ...state, descriptionEn: e.target.value }))} />
          <Input placeholder="Description (AR)" value={draft.descriptionAr} onChange={(e) => setDraft((state) => ({ ...state, descriptionAr: e.target.value }))} />
          <Button type="button" onClick={createProduct}>Add product</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {products.map((product) => (
          <EditableProductRow key={product.id} product={product} categories={categories} onSave={updateProduct} onDelete={deleteProduct} />
        ))}
      </div>
    </div>
  );
}

function EditableProductRow({
  product,
  categories,
  onSave,
  onDelete,
}: {
  product: Product;
  categories: CategoryOption[];
  onSave: (product: Product) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(product);

  return (
    <Card>
      <CardContent className="grid gap-3 p-4 md:grid-cols-3">
        <select className="h-10 rounded-xl border bg-white/80 px-3 text-sm" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.nameEn}</option>
          ))}
        </select>
        <Input value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
        <Input value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
        <Input value={draft.descriptionEn} onChange={(e) => setDraft({ ...draft, descriptionEn: e.target.value })} />
        <Input value={draft.descriptionAr} onChange={(e) => setDraft({ ...draft, descriptionAr: e.target.value })} />
        <Input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.isAvailable} onChange={(e) => setDraft({ ...draft, isAvailable: e.target.checked })} /> Available</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.isFeatured} onChange={(e) => setDraft({ ...draft, isFeatured: e.target.checked })} /> Featured</label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => onSave(draft)}>Save</Button>
          <Button type="button" variant="destructive" onClick={() => onDelete(draft.id)}>Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
}
