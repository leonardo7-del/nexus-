import { Head } from '@inertiajs/react';
import { type ReactNode, useMemo } from 'react';
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

type MetricKey = 'total_events' | 'logins_ok' | 'registrations' | 'failed';

type Metrics = Record<MetricKey, number>;

type ActivityPoint = {
    date: string;
    label: string;
    logins: number;
    failed: number;
};

type Props = {
    auditLogs: AuditLog[];
    metrics: Metrics;
    activity: ActivityPoint[];
};

type ChartPoint = {
    x: number;
    y: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel',
        href: dashboard().url,
    },
];

const cards: Array<{ key: MetricKey; title: string }> = [
    {
        key: 'total_events',
        title: 'Total Eventos',
    },
    {
        key: 'logins_ok',
        title: 'Login OK',
    },
    {
        key: 'registrations',
        title: 'Registros',
    },
    {
        key: 'failed',
        title: 'Fallidos',
    },
];

function linePath(points: ChartPoint[]): string {
    if (points.length === 0) {
        return '';
    }

    return points
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
        .join(' ');
}

export default function Dashboard({ auditLogs, metrics, activity }: Props) {
    const chart = useMemo(() => {
        const width = 1400;
        const height = 280;
        const padding = {
            top: 18,
            right: 26,
            bottom: 44,
            left: 26,
        };

        const plotWidth = width - padding.left - padding.right;
        const plotHeight = height - padding.top - padding.bottom;

        const labels = activity.map((point) => point.label);
        const loginValues = activity.map((point) => point.logins);
        const failedValues = activity.map((point) => point.failed);
        const maxValue = Math.max(1, ...loginValues, ...failedValues);

        const toX = (index: number) => {
            if (labels.length <= 1) {
                return padding.left + plotWidth / 2;
            }

            return padding.left + (index / (labels.length - 1)) * plotWidth;
        };

        const toY = (value: number) => padding.top + plotHeight - (value / maxValue) * plotHeight;

        const loginPoints = loginValues.map((value, index) => ({
            x: toX(index),
            y: toY(value),
        }));

        const failedPoints = failedValues.map((value, index) => ({
            x: toX(index),
            y: toY(value),
        }));

        const baseY = toY(0);
        const loginPath = linePath(loginPoints);

        const loginAreaPath = loginPoints.length
            ? `${loginPath} L ${loginPoints[loginPoints.length - 1].x.toFixed(2)} ${baseY.toFixed(2)} L ${loginPoints[0].x.toFixed(2)} ${baseY.toFixed(2)} Z`
            : '';

        return {
            width,
            height,
            padding,
            plotWidth,
            plotHeight,
            labels,
            loginPoints,
            failedPoints,
            loginPath,
            failedPath: linePath(failedPoints),
            loginAreaPath,
            axisY: baseY,
        };
    }, [activity]);

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

            <div className="space-y-5 p-4">
                <div className="rounded-xl border border-sidebar-border bg-card p-5">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">nexus/dashboard</p>
                    <h1 className="mt-2 text-3xl font-semibold text-foreground">Registro de Auditoria</h1>
                    <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">Monitoreo de eventos en tiempo real</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.key}
                            className="relative overflow-hidden rounded-xl border border-sidebar-border bg-card p-5"
                        >
                            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{card.title}</p>
                            <p className="mt-3 text-5xl leading-none font-bold text-white">{metrics[card.key] ?? 0}</p>
                            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-white" />
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-sidebar-border bg-card p-5">
                    <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">// Actividad del sistema</p>

                    <div className="mt-4 rounded-lg bg-background p-4">
                        <div className="mb-3 flex items-center justify-end gap-4 text-xs">
                            <span className="inline-flex items-center gap-2 text-cyan-300">
                                <span className="h-3 w-3 border border-white" /> Logins
                            </span>
                            <span className="inline-flex items-center gap-2 text-zinc-300">
                                <span className="h-3 w-3 border border-white border-dashed" /> Fallidos
                            </span>
                        </div>

                        <div className="h-52 w-full md:h-60">
                            <svg
                                viewBox={`0 0 ${chart.width} ${chart.height}`}
                                className="h-full w-full"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <linearGradient id="loginGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                <g stroke="#172235" strokeWidth="1">
                                    {Array.from({ length: 7 }).map((_, index) => {
                                        const x = chart.padding.left + (index / 6) * chart.plotWidth;
                                        return (
                                            <line
                                                key={`v-${index}`}
                                                x1={x}
                                                y1={chart.padding.top}
                                                x2={x}
                                                y2={chart.padding.top + chart.plotHeight}
                                            />
                                        );
                                    })}
                                    {Array.from({ length: 6 }).map((_, index) => {
                                        const y = chart.padding.top + (index / 5) * chart.plotHeight;
                                        return (
                                            <line
                                                key={`h-${index}`}
                                                x1={chart.padding.left}
                                                y1={y}
                                                x2={chart.width - chart.padding.right}
                                                y2={y}
                                            />
                                        );
                                    })}
                                </g>

                                <line
                                    x1={chart.padding.left}
                                    y1={chart.axisY}
                                    x2={chart.width - chart.padding.right}
                                    y2={chart.axisY}
                                    stroke="#1f2b40"
                                    strokeWidth="1"
                                />

                                {chart.loginAreaPath && <path d={chart.loginAreaPath} fill="url(#loginGradient)" />}

                                {chart.loginPath && (
                                    <path d={chart.loginPath} fill="none" stroke="#ffffff" strokeWidth="3" />
                                )}

                                {chart.failedPath && (
                                    <path
                                        d={chart.failedPath}
                                        fill="none"
                                        stroke="#ffffff"
                                        strokeWidth="3"
                                        strokeDasharray="8 6"
                                    />
                                )}

                                {chart.loginPoints.map((point, index) => (
                                    <circle
                                        key={`login-dot-${index}`}
                                        cx={point.x}
                                        cy={point.y}
                                        r="3.5"
                                        fill="#0a0f1a"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                    />
                                ))}

                                {chart.failedPoints.map((point, index) => (
                                    <rect
                                        key={`fail-dot-${index}`}
                                        x={point.x - 3.2}
                                        y={point.y - 3.2}
                                        width="6.4"
                                        height="6.4"
                                        fill="#0a0f1a"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                    />
                                ))}

                                {chart.labels.map((label, index) => {
                                    const x = chart.padding.left + (index / Math.max(chart.labels.length - 1, 1)) * chart.plotWidth;
                                    return (
                                        <text
                                            key={`label-${label}-${index}`}
                                            x={x}
                                            y={chart.height - 12}
                                            fill="#94a3b8"
                                            textAnchor="middle"
                                            fontSize="13"
                                        >
                                            {label}
                                        </text>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border bg-card p-4">
                    <h2 className="text-lg font-semibold text-foreground">Ultimos Eventos</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Mostrando todos los registros de auditoria.</p>

                    <div className="mt-4 overflow-x-auto border-y border-white/10">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="border-b border-white/10 text-zinc-300">
                                <tr>
                                    <th className="px-2 py-2 font-medium">ID</th>
                                    <th className="px-2 py-2 font-medium">Usuario</th>
                                    <th className="px-2 py-2 font-medium">Accion</th>
                                    <th className="px-2 py-2 font-medium">IP</th>
                                    <th className="px-2 py-2 font-medium">Fecha</th>
                                    <th className="px-2 py-2 font-medium">Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-2 py-4 text-zinc-400">
                                            No hay registros en audit_logs.
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-white/10 align-top text-zinc-200"
                                        >
                                            <td className="px-2 py-2 text-cyan-300">{log.id}</td>
                                            <td className="px-2 py-2 text-indigo-200">{log.user_id ?? '-'}</td>
                                            <td className="px-2 py-2 text-fuchsia-300">{log.action ?? '-'}</td>
                                            <td className="px-2 py-2 text-emerald-300">{log.ip_address ?? '-'}</td>
                                            <td className="px-2 py-2 whitespace-nowrap text-amber-200">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-2">
                                                <code className="break-all text-xs">
                                                    {log.details === null ? (
                                                        <span className="text-zinc-500">-</span>
                                                    ) : (
                                                        renderJsonValue(log.details)
                                                    )}
                                                </code>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
