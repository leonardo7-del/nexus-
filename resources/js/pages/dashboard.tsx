import { Head } from '@inertiajs/react';
import { ChevronDown, ClipboardList, Users } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type AuditLog = {
    id: number;
    user_id: number | null;
    action: string | null;
    ip_address: string | null;
    details: Record<string, unknown> | string | null;
    created_at: string;
};

type UserRow = {
    id: number;
    email: string;
    created_at: string | null;
};

type Props = {
    auditLogs: AuditLog[];
    users: UserRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel',
        href: dashboard().url,
    },
];

export default function Dashboard({ auditLogs, users }: Props) {
    const [showAllAuditLogs, setShowAllAuditLogs] = useState(false);
    const visibleLogs = showAllAuditLogs ? auditLogs : auditLogs.slice(0, 5);

    const formatDate = (value: string) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
    };

    const renderJsonValue = (value: unknown): ReactNode => {
        if (value === null) {
            return <span className="text-zinc-500">null</span>;
        }

        if (typeof value === 'string') {
            return <span className="text-emerald-400">"{value}"</span>;
        }

        if (typeof value === 'number') {
            return <span className="text-amber-300">{value}</span>;
        }

        if (typeof value === 'boolean') {
            return <span className="text-violet-300">{String(value)}</span>;
        }

        if (Array.isArray(value)) {
            return (
                <>
                    <span className="text-zinc-400">[</span>
                    {value.map((item, index) => (
                        <span key={index}>
                            {index > 0 && <span className="text-zinc-400">, </span>}
                            {renderJsonValue(item)}
                        </span>
                    ))}
                    <span className="text-zinc-400">]</span>
                </>
            );
        }

        if (typeof value === 'object') {
            const entries = Object.entries(value as Record<string, unknown>);

            return (
                <>
                    <span className="text-zinc-400">{'{'}</span>
                    {entries.map(([key, entryValue], index) => (
                        <span key={key}>
                            {index > 0 && <span className="text-zinc-400">, </span>}
                            <span className="text-sky-300">"{key}"</span>
                            <span className="text-zinc-400">: </span>
                            {renderJsonValue(entryValue)}
                        </span>
                    ))}
                    <span className="text-zinc-400">{'}'}</span>
                </>
            );
        }

        return <span className="text-zinc-300">{String(value)}</span>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel" />
            <div className="p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h1 className="text-xl font-semibold">Panel Nexus</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Bienvenido. El inicio de sesión con OTP está activo.
                    </p>
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <ClipboardList className="size-5" />
                                Audit Logs
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Mostrando {visibleLogs.length} de {auditLogs.length}{' '}
                                eventos de auditoría.
                            </p>
                        </div>

                        <div
                            id="audit-logs-table"
                            className="mt-4 overflow-x-auto border-y border-white/20"
                        >
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="border-b border-white/20 text-zinc-300">
                                    <tr>
                                        <th className="px-2 py-2 font-medium">ID</th>
                                        <th className="px-2 py-2 font-medium">Usuario</th>
                                        <th className="px-2 py-2 font-medium">Acción</th>
                                        <th className="px-2 py-2 font-medium">IP</th>
                                        <th className="px-2 py-2 font-medium">Fecha</th>
                                        <th className="px-2 py-2 font-medium">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono">
                                    {auditLogs.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-2 py-4 text-zinc-400"
                                            >
                                                No hay registros en audit_logs.
                                            </td>
                                        </tr>
                                    ) : (
                                        visibleLogs.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="border-b border-white/10 align-top text-zinc-200"
                                            >
                                                <td className="px-2 py-2 text-cyan-300">
                                                    {log.id}
                                                </td>
                                                <td className="px-2 py-2 text-indigo-200">
                                                    {log.user_id ?? '-'}
                                                </td>
                                                <td className="px-2 py-2 text-fuchsia-300">
                                                    {log.action ?? '-'}
                                                </td>
                                                <td className="px-2 py-2 text-emerald-300">
                                                    {log.ip_address ?? '-'}
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-amber-200">
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td className="px-2 py-2">
                                                    <code className="break-all text-xs">
                                                        {log.details === null ? (
                                                            <span className="text-zinc-500">
                                                                -
                                                            </span>
                                                        ) : (
                                                            renderJsonValue(
                                                                log.details,
                                                            )
                                                        )}
                                                    </code>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {auditLogs.length > 5 && (
                            <div className="mt-3 flex justify-center">
                                <button
                                    type="button"
                                    className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    onClick={() =>
                                        setShowAllAuditLogs((prev) => !prev)
                                    }
                                    aria-expanded={showAllAuditLogs}
                                    aria-controls="audit-logs-table"
                                    aria-label={
                                        showAllAuditLogs
                                            ? 'Mostrar solo 5 logs'
                                            : 'Mostrar todos los logs'
                                    }
                                >
                                    <ChevronDown
                                        className={`size-5 transition-transform ${showAllAuditLogs ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Users className="size-5" />
                            Usuarios
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Listado de usuarios registrados.
                        </p>

                        <div className="mt-4 overflow-x-auto border-y border-white/20">
                            <table className="w-full min-w-[520px] text-left text-sm">
                                <thead className="border-b border-white/20 text-zinc-300">
                                    <tr>
                                        <th className="px-2 py-2 font-medium">ID</th>
                                        <th className="px-2 py-2 font-medium">Correo</th>
                                        <th className="px-2 py-2 font-medium">Creado</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-2 py-4 text-zinc-400"
                                            >
                                                No hay usuarios registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-white/10 text-zinc-200"
                                            >
                                                <td className="px-2 py-2 text-cyan-300">
                                                    {user.id}
                                                </td>
                                                <td className="px-2 py-2 text-emerald-300">
                                                    {user.email}
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-amber-200">
                                                    {formatDate(
                                                        user.created_at ?? '-',
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
