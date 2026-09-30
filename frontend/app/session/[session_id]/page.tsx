import Chat from "@/components/chat/Chat";

interface SessionPageProps {
    params: Promise<{
        session_id: string;
    }>;
}

export default async function SessionPage({
    params,
}: SessionPageProps) {
    const { session_id } = await params;

    return (
        <Chat sessionId={session_id} />
    );
}