import { LogSessionClient } from "./LogSessionClient";

export default async function LogSessionPage({
	params,
}: {
	params: Promise<{ sessionId: string }>;
}) {
	const { sessionId } = await params;
	return <LogSessionClient sessionId={sessionId} />;
}
