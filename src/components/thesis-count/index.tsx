import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import { TrendingUp } from "lucide-react";
import { useTheses } from "@/hooks/theses-hooks";
import { Loading } from "../loading";

export const description = "An area chart with gradient fill";

const chartConfig = {
  thesis: {
    label: "TCCs/ano",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ThesisCount() {
  const { getThesesByYear } = useTheses();
  const { data: thesesByYear, isLoading } = getThesesByYear();

  if (isLoading) {
    <Loading />;
  }

  return (
    <Card className="md:break-inside-avoid overflow-hidden min-h-64 drop-shadow-md shadow-black/10">
      <CardHeader>
        <CardTitle className="flex gap-2">
          Trabalhos
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Mostrando a quantidade de trabalhos por ano de publicação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={thesesByYear}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => String(value).slice(2, 4)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillThesis" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-thesis)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-thesis)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="thesis"
              type="natural"
              fill="url(#fillThesis)"
              fillOpacity={0.4}
              stroke="var(--color-thesis)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
