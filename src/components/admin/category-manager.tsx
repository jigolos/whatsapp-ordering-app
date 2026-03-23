"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Category = {
  id: string;
  nameEn: string;
  nameAr: string;
  sortOrder: number;
  isActive: boolean;
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState({ nameEn: "", nameAr: "", sortOrder: 0 });
  const [loading, setLoading] = useState(false);

  async function createCategory() {
    setLoading(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, isActive: true, sortOrder: Number(draft.sortOrder) }),
    });
    setDraft({ nameEn: "", nameAr: "", sortOrder: 0 });
    router.refresh();
    setLoading(false);
  }

  async function updateCategory(category: Category) {
    await fetch(`/api/admin/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    router.refresh();
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Name (EN)" value={draft.nameEn} onChange={(e) => setDraft((state) => ({ ...state, nameEn: e.target.value }))} />
          <Input placeholder="Name (AR)" value={draft.nameAr} onChange={(e) => setDraft((state) => ({ ...state, nameAr: e.target.value }))} />
          <Input type="number" placeholder="Sort order" value={draft.sortOrder} onChange={(e) => setDraft((state) => ({ ...state, sortOrder: Number(e.target.value) }))} />
          <Button type="button" onClick={createCategory} disabled={loading}>Add category</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {categories.map((category) => (
          <EditableCategoryRow key={category.id} category={category} onSave={updateCategory} onDelete={deleteCategory} />
        ))}
      </div>
    </div>
  );
}

function EditableCategoryRow({
  category,
  onSave,
  onDelete,
}: {
  category: Category;
  onSave: (category: Category) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(category);

  return (
    <Card>
      <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr,1fr,120px,120px,120px]">
        <Input value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
        <Input value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
        <Input type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} />
        <Button type="button" variant="outline" onClick={() => onSave(draft)}>Save</Button>
        <Button type="button" variant="destructive" onClick={() => onDelete(draft.id)}>Delete</Button>
      </CardContent>
    </Card>
  );
}
