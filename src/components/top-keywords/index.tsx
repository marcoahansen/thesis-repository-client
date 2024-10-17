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
import { useTheses } from "@/hooks/theses-hooks";
import { Loading } from "../loading";

const chartConfig = {
  keyword: {
    label: "Palavra chave",
    color: "hsl(var(--chart-0))",
  },
} satisfies ChartConfig;

export function TopKeywords() {
  const { getTopKeywords } = useTheses();
  const { data: topKeywords, isLoading } = getTopKeywords();

  if (isLoading) {
    <Loading />;
  }
  return (
    <Card className="md:break-inside-avoid overflow-hidden min-h-64 drop-shadow-md shadow-black/10">
      <CardHeader>
        <CardTitle>Palavras Chave</CardTitle>
        <CardDescription>
          Mostrando a lista das palavras chaves mais utilizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={topKeywords}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="keyword"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-keyword)"
              radius={4}
            >
              <LabelList
                dataKey="keyword"
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
