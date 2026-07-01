import { RoutineDetailClient } from "./RoutineDetailClient";

export default async function RoutineDetailPage({
	params,
}: {
	params: Promise<{ routineId: string }>;
}) {
	const { routineId } = await params;
	return <RoutineDetailClient routineId={routineId} />;
}
