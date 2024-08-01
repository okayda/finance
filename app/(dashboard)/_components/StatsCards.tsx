"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkelettonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

export default function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(`/api/stats/balance?from=${from}&to=${DateToUTCDate(to)}`).then(
        (res) => res.json()
      ),
  });

  const formatter = React.useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkelettonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp
              className="h-12 w-12 items-center
              rounded-lg
              p-2
              text-emerald-500 bg-emerald-400/10"
            />
          }
        />
      </SkelettonWrapper>

      <SkelettonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown
              className="h-12 w-12 items-center
              rounded-lg
              p-2
              text-rose-500 bg-rose-400/10"
            />
          }
        />
      </SkelettonWrapper>

      <SkelettonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet
              className="h-12 w-12 items-center
              rounded-lg
              p-2
              text-purple-500 bg-purple-400/10"
            />
          }
        />
      </SkelettonWrapper>
    </div>
  );
}

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  const formatFn = React.useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card
      className={cn("flex h-24 w-full items-center gap-2 p-4", {
        "border-purple-500": title === "Balance",
      })}
    >
      {icon}
      <div>
        <p className="text-muted-foreground font-bold">{title}</p>
        <div className="flex flex-col items-center gap-0">
          <CountUp
            preserveValue
            redraw={false}
            end={value}
            decimal="2"
            formattingFn={formatFn}
            className="text-2xl"
          />
        </div>
      </div>
    </Card>
  );
}
