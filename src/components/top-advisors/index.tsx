"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAdvisors } from "@/hooks/advisors-hooks";
import { Loading } from "../loading";

export const description = "A bar chart with a custom label";

const chartConfig = {
  name: {
    label: "Nome do Orientador",
    color: "hsl(var(--chart-0))",
  },
} satisfies ChartConfig;

export function TopAdvisors() {
  const { getTopAdvisors } = useAdvisors();
  const { data: topAdvisors, isLoading } = getTopAdvisors();

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Card className="md:break-inside-avoid overflow-hidden min-h-64 drop-shadow-md shadow-black/10">
      <CardHeader>
        <CardTitle>Orientadores</CardTitle>
        <CardDescription>
          Mostrando a lista dos orientadores por orientandos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={topAdvisors}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="authors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="authors"
              layout="vertical"
              fill="var(--color-name)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-current text-primary"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
