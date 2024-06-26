import { cn } from "@aniways/ui";
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
					<TableHead>Service</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Time</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Object.entries(healthcheck.data.dependencies).map(([key, value]) => (
					<TableRow key={key}>
						<TableCell className="capitalize">{key} Service</TableCell>
						<TableCell
							className={cn(
								"font-bold",
								value.isDown ? "text-red-500" : "text-green-500",
							)}
						>
							{value.isDown ? "Down" : "Up"}
						</TableCell>
						<TableCell>{value.date.toLocaleTimeString()}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
