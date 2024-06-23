import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aniways/ui/table";

import { useHealthCheck } from "../hooks/useHealthCheck";

export const HealthCheckTable = () => {
  const healthcheck = useHealthCheck();

  return (
    <Table>
      <TableCaption>
        {healthcheck.data.message} - {healthcheck.data.success ? "🟢" : "🔴"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <TableCell>Service</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Time</TableCell>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(healthcheck.data.dependencies).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{value.isDown ? "Down" : "Up"}</TableCell>
            <TableCell>{value.date.toLocaleTimeString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
