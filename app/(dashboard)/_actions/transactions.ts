"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemeType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemeType) {
  const parseBody = CreateTransactionSchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error(parseBody.error.message);
  }

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { amount, category, date, description, type } = parseBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not fount");
  }

  await prisma.$transaction([
    // Create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update month aggregates table
    prisma.monthHistory.upsert({
      // searching for the existed data
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      // if data is not existed will create a new data
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      // if data is existed the data will be updated
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },

        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // Update year aggregatestable
    prisma.yearHistory.upsert({
      // searching for the existed data
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      // if data is not existed will create a new data
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      // if data is existed the data will be updated
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },

        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
