"use server"

import { prisma } from "@/lib/prisma"

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  })
  return categories
}

export async function getCategoriesFlat() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      parent: true,
    },
  })
  return categories
}
