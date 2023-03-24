import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Votes({
  votes,
}: {
  votes: { contestant?: string; count: number }[];
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Votes</h1>
      <Bar
        options={{ indexAxis: "y" }}
        data={{
          labels: votes.map((vote) => vote.contestant),
          datasets: [{ data: votes.map((vote) => vote.count) }],
        }}
      />
    </div>
  );
}
