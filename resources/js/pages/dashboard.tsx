import { Head } from '@inertiajs/react';
import { type ReactNode, useMemo, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
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

type UserRow = {
    id: number;
    email: string;
    created_at: string;
};

type OtpCodeRow = {
    id: number;
    user_id: number;
    code: string;
    expires_at: string;
    used: boolean;
};

type Props = {
    auditLogs: AuditLog[];
    metrics: Metrics;
    activity: ActivityPoint[];
    users: UserRow[];
    otpCodes: OtpCodeRow[];
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

export default function Dashboard({ auditLogs, metrics, activity, users, otpCodes }: Props) {
    const [showAuditTable, setShowAuditTable] = useState(true);
    const [showUsersTable, setShowUsersTable] = useState(true);
    const [showOtpTable, setShowOtpTable] = useState(true);
    const [auditQuery, setAuditQuery] = useState('');
    const [auditActionFilter, setAuditActionFilter] = useState('ALL');
    const [auditLimit, setAuditLimit] = useState<'10' | '25' | '50' | 'ALL'>('10');
    const [usersQuery, setUsersQuery] = useState('');
    const [usersDateFilter, setUsersDateFilter] = useState('');
    const [usersLimit, setUsersLimit] = useState<'10' | '25' | '50' | 'ALL'>('10');
    const [otpQuery, setOtpQuery] = useState('');
    const [otpUsedFilter, setOtpUsedFilter] = useState<'ALL' | 'USED' | 'UNUSED'>('ALL');
    const [otpDateFilter, setOtpDateFilter] = useState('');
    const [otpLimit, setOtpLimit] = useState<'10' | '25' | '50' | 'ALL'>('10');
    const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
    const [selectedOtpCode, setSelectedOtpCode] = useState<OtpCodeRow | null>(null);

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
            return <span className="text-white">null</span>;
        }

        if (typeof value === 'string') {
            return <span className="text-white">"{value}"</span>;
        }

        if (typeof value === 'number') {
            return <span className="text-white">{value}</span>;
        }

        if (typeof value === 'boolean') {
            return <span className="text-white">{String(value)}</span>;
        }

        if (Array.isArray(value)) {
            return (
                <>
                    <span className="text-white">[</span>
                    {value.map((item, index) => (
                        <span key={index}>
                            {index > 0 && <span className="text-white">, </span>}
                            {renderJsonValue(item)}
                        </span>
                    ))}
                    <span className="text-white">]</span>
                </>
            );
        }

        if (typeof value === 'object') {
            const entries = Object.entries(value as Record<string, unknown>);

            return (
                <>
                    <span className="text-white">{'{'}</span>
                    {entries.map(([key, entryValue], index) => (
                        <span key={key}>
                            {index > 0 && <span className="text-white">, </span>}
                            <span className="text-white">"{key}"</span>
                            <span className="text-white">: </span>
                            {renderJsonValue(entryValue)}
                        </span>
                    ))}
                    <span className="text-white">{'}'}</span>
                </>
            );
        }

        return <span className="text-white">{String(value)}</span>;
    };

    const auditActions = useMemo(
        () =>
            Array.from(new Set(auditLogs.map((log) => log.action).filter((action): action is string => Boolean(action))))
                .sort((a, b) => a.localeCompare(b)),
        [auditLogs],
    );

    const filteredAuditLogs = useMemo(() => {
        const query = auditQuery.trim().toLowerCase();

        return auditLogs.filter((log) => {
            if (auditActionFilter !== 'ALL' && log.action !== auditActionFilter) {
                return false;
            }

            if (query === '') {
                return true;
            }

            const detailsValue =
                typeof log.details === 'string'
                    ? log.details
                    : log.details === null
                      ? ''
                      : JSON.stringify(log.details);

            const searchable = [
                String(log.id),
                String(log.user_id ?? ''),
                log.action ?? '',
                log.ip_address ?? '',
                detailsValue,
                new Date(log.created_at).toLocaleString(),
            ]
                .join(' ')
                .toLowerCase();

            return searchable.includes(query);
        });
    }, [auditActionFilter, auditLogs, auditQuery]);

    const filteredUsers = useMemo(() => {
        const query = usersQuery.trim().toLowerCase();

        return users.filter((user) => {
            const createdDate = user.created_at.slice(0, 10);
            const matchesDate = usersDateFilter === '' || createdDate === usersDateFilter;

            if (!matchesDate) {
                return false;
            }

            if (query === '') {
                return true;
            }

            const searchable = `${user.id} ${user.email} ${new Date(user.created_at).toLocaleString()}`.toLowerCase();

            return searchable.includes(query);
        });
    }, [users, usersDateFilter, usersQuery]);

    const filteredOtpCodes = useMemo(() => {
        const query = otpQuery.trim().toLowerCase();

        return otpCodes.filter((otp) => {
            const expiresDate = otp.expires_at.slice(0, 10);
            const matchesDate = otpDateFilter === '' || expiresDate === otpDateFilter;

            if (!matchesDate) {
                return false;
            }

            if (otpUsedFilter === 'USED' && !otp.used) {
                return false;
            }

            if (otpUsedFilter === 'UNUSED' && otp.used) {
                return false;
            }

            if (query === '') {
                return true;
            }

            const searchable = `${otp.id} ${otp.user_id} ${otp.code} ${new Date(otp.expires_at).toLocaleString()} ${otp.used ? 'used' : 'unused'}`.toLowerCase();

            return searchable.includes(query);
        });
    }, [otpCodes, otpDateFilter, otpQuery, otpUsedFilter]);

    const visibleAuditLogs = auditLimit === 'ALL' ? filteredAuditLogs : filteredAuditLogs.slice(0, Number(auditLimit));
    const visibleUsers = usersLimit === 'ALL' ? filteredUsers : filteredUsers.slice(0, Number(usersLimit));
    const visibleOtpCodes = otpLimit === 'ALL' ? filteredOtpCodes : filteredOtpCodes.slice(0, Number(otpLimit));

    const downloadAllRecords = () => {
        window.location.href = '/dashboard/export-records';
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
                            <p className="font-numbers mt-3 text-5xl leading-none font-bold text-white">{metrics[card.key] ?? 0}</p>
                            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-white" />
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-sidebar-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">// Actividad del sistema</p>
                        <button
                            type="button"
                            onClick={downloadAllRecords}
                            className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                        >
                            Descargar todos los registros
                        </button>
                    </div>

                    <div className="mt-4 rounded-lg bg-background p-4">
                        <div className="mb-3 flex items-center justify-end gap-4 text-xs">
                            <span className="inline-flex items-center gap-2 text-white">
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

                                <g stroke="#ffffff" strokeWidth="1" strokeOpacity="0.18">
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
                                    stroke="#ffffff"
                                    strokeOpacity="0.28"
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

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Ultimos Eventos</h2>
                                <p className="mt-1 text-sm text-white">
                                    Mostrando {visibleAuditLogs.length} de {filteredAuditLogs.length} registros (filtrados).
                                </p>
                            </div>
                            <button
                                type="button"
                                className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                                onClick={() => setShowAuditTable((value) => !value)}
                            >
                                {showAuditTable ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>

                        {showAuditTable && (
                            <>
                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                    <input
                                        type="text"
                                        value={auditQuery}
                                        onChange={(event) => setAuditQuery(event.target.value)}
                                        placeholder="Buscar por ID, accion, IP, detalles..."
                                        className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/40"
                                    />
                                    <select
                                        value={auditActionFilter}
                                        onChange={(event) => setAuditActionFilter(event.target.value)}
                                        className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/40"
                                    >
                                        <option value="ALL">Todas las acciones</option>
                                        {auditActions.map((action) => (
                                            <option key={action} value={action}>
                                                {action}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={auditLimit}
                                        onChange={(event) => setAuditLimit(event.target.value as '10' | '25' | '50' | 'ALL')}
                                        className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/40"
                                    >
                                        <option value="10">10 registros</option>
                                        <option value="25">25 registros</option>
                                        <option value="50">50 registros</option>
                                        <option value="ALL">Todos</option>
                                    </select>
                                </div>

                                <div
                                    className={`mt-4 overflow-x-auto border-y border-white/10 ${
                                        visibleAuditLogs.length > 10 ? 'max-h-[460px] overflow-y-auto' : ''
                                    }`}
                                >
                                    <table className="w-full min-w-[760px] text-left text-sm">
                                        <thead className="border-b border-white/10 text-white">
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
                                            {visibleAuditLogs.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-2 py-4 text-white">
                                                        No hay registros con esos filtros.
                                                    </td>
                                                </tr>
                                            ) : (
                                                visibleAuditLogs.map((log) => (
                                                    <tr
                                                        key={log.id}
                                                        className="cursor-pointer border-b border-white/10 align-top text-white transition hover:bg-white/5"
                                                        onClick={() => {
                                                            setSelectedAuditLog(log);
                                                            setSelectedUser(null);
                                                            setSelectedOtpCode(null);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter' || event.key === ' ') {
                                                                setSelectedAuditLog(log);
                                                                setSelectedUser(null);
                                                                setSelectedOtpCode(null);
                                                            }
                                                        }}
                                                        tabIndex={0}
                                                    >
                                                        <td className="font-numbers px-2 py-2">{log.id}</td>
                                                        <td className="font-numbers px-2 py-2">{log.user_id ?? '-'}</td>
                                                        <td className="px-2 py-2">{log.action ?? '-'}</td>
                                                        <td className="px-2 py-2">{log.ip_address ?? '-'}</td>
                                                        <td className="font-numbers px-2 py-2 whitespace-nowrap text-amber-200">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            <code className="break-all text-xs">
                                                                {log.details === null ? (
                                                                    <span className="text-white">-</span>
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
                            </>
                        )}
                    </div>

                    <div className="rounded-xl border border-sidebar-border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Usuarios</h2>
                                <p className="mt-1 text-sm text-white">
                                    Mostrando {visibleUsers.length} de {filteredUsers.length} registros (filtrados).
                                </p>
                            </div>
                            <button
                                type="button"
                                className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                                onClick={() => setShowUsersTable((value) => !value)}
                            >
                                {showUsersTable ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>

                        {showUsersTable && (
                            <>
                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                    <input
                                        type="text"
                                        value={usersQuery}
                                        onChange={(event) => setUsersQuery(event.target.value)}
                                        placeholder="Buscar por ID o correo..."
                                        className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/40"
                                    />
                                    <input
                                        type="date"
                                        value={usersDateFilter}
                                        onChange={(event) => setUsersDateFilter(event.target.value)}
                                        className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/40"
                                    />
                                    <select
                                        value={usersLimit}
                                        onChange={(event) => setUsersLimit(event.target.value as '10' | '25' | '50' | 'ALL')}
                                        className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/40"
                                    >
                                        <option value="10">10 registros</option>
                                        <option value="25">25 registros</option>
                                        <option value="50">50 registros</option>
                                        <option value="ALL">Todos</option>
                                    </select>
                                </div>

                                <div
                                    className={`mt-4 overflow-x-auto border-y border-white/10 ${
                                        visibleUsers.length > 10 ? 'max-h-[460px] overflow-y-auto' : ''
                                    }`}
                                >
                                    <table className="w-full min-w-[520px] text-left text-sm">
                                        <thead className="border-b border-white/10 text-white">
                                            <tr>
                                                <th className="px-2 py-2 font-medium">ID</th>
                                                <th className="px-2 py-2 font-medium">Correo</th>
                                                <th className="px-2 py-2 font-medium">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono">
                                            {visibleUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-2 py-4 text-white">
                                                        No hay usuarios con esos filtros.
                                                    </td>
                                                </tr>
                                            ) : (
                                                visibleUsers.map((user) => (
                                                    <tr
                                                        key={user.id}
                                                        className="cursor-pointer border-b border-white/10 align-top text-white transition hover:bg-white/5"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setSelectedAuditLog(null);
                                                            setSelectedOtpCode(null);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter' || event.key === ' ') {
                                                                setSelectedUser(user);
                                                                setSelectedAuditLog(null);
                                                                setSelectedOtpCode(null);
                                                            }
                                                        }}
                                                        tabIndex={0}
                                                    >
                                                        <td className="font-numbers px-2 py-2">{user.id}</td>
                                                        <td className="px-2 py-2">{user.email}</td>
                                                        <td className="font-numbers px-2 py-2 whitespace-nowrap text-amber-200">
                                                            {new Date(user.created_at).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Codigos OTP</h2>
                            <p className="mt-1 text-sm text-white">
                                Mostrando {visibleOtpCodes.length} de {filteredOtpCodes.length} registros (filtrados).
                            </p>
                        </div>
                        <button
                            type="button"
                            className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                            onClick={() => setShowOtpTable((value) => !value)}
                        >
                            {showOtpTable ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>

                    {showOtpTable && (
                        <>
                            <div className="mt-4 grid gap-3 md:grid-cols-4">
                                <input
                                    type="text"
                                    value={otpQuery}
                                    onChange={(event) => setOtpQuery(event.target.value)}
                                    placeholder="Buscar por ID, user_id o code..."
                                    className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/40"
                                />
                                <select
                                    value={otpUsedFilter}
                                    onChange={(event) => setOtpUsedFilter(event.target.value as 'ALL' | 'USED' | 'UNUSED')}
                                    className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/40"
                                >
                                    <option value="ALL">Todos</option>
                                    <option value="USED">Usados</option>
                                    <option value="UNUSED">No usados</option>
                                </select>
                                <input
                                    type="date"
                                    value={otpDateFilter}
                                    onChange={(event) => setOtpDateFilter(event.target.value)}
                                    className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/40"
                                />
                                <select
                                    value={otpLimit}
                                    onChange={(event) => setOtpLimit(event.target.value as '10' | '25' | '50' | 'ALL')}
                                    className="h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/40"
                                >
                                    <option value="10">10 registros</option>
                                    <option value="25">25 registros</option>
                                    <option value="50">50 registros</option>
                                    <option value="ALL">Todos</option>
                                </select>
                            </div>

                            <div
                                className={`mt-4 overflow-x-auto border-y border-white/10 ${
                                    visibleOtpCodes.length > 10 ? 'max-h-[460px] overflow-y-auto' : ''
                                }`}
                            >
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead className="border-b border-white/10 text-white">
                                        <tr>
                                            <th className="px-2 py-2 font-medium">ID</th>
                                            <th className="px-2 py-2 font-medium">Usuario</th>
                                            <th className="px-2 py-2 font-medium">Codigo</th>
                                            <th className="px-2 py-2 font-medium">Expira</th>
                                            <th className="px-2 py-2 font-medium">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono">
                                        {visibleOtpCodes.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-2 py-4 text-white">
                                                    No hay codigos OTP con esos filtros.
                                                </td>
                                            </tr>
                                        ) : (
                                            visibleOtpCodes.map((otp) => (
                                                <tr
                                                    key={otp.id}
                                                    className="cursor-pointer border-b border-white/10 align-top text-white transition hover:bg-white/5"
                                                    onClick={() => {
                                                        setSelectedOtpCode(otp);
                                                        setSelectedAuditLog(null);
                                                        setSelectedUser(null);
                                                    }}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter' || event.key === ' ') {
                                                            setSelectedOtpCode(otp);
                                                            setSelectedAuditLog(null);
                                                            setSelectedUser(null);
                                                        }
                                                    }}
                                                    tabIndex={0}
                                                >
                                                    <td className="font-numbers px-2 py-2">{otp.id}</td>
                                                    <td className="font-numbers px-2 py-2">{otp.user_id}</td>
                                                    <td className="font-numbers px-2 py-2">{otp.code}</td>
                                                    <td className="font-numbers px-2 py-2 whitespace-nowrap text-amber-200">
                                                        {new Date(otp.expires_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-2 py-2">{otp.used ? 'Usado' : 'No usado'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                <Dialog
                    open={Boolean(selectedAuditLog || selectedUser || selectedOtpCode)}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedAuditLog(null);
                            setSelectedUser(null);
                            setSelectedOtpCode(null);
                        }
                    }}
                >
                    <DialogContent className="border-white/20 bg-card text-white sm:max-w-2xl">
                        <DialogTitle className="flex items-center gap-2">
                            <AppLogoIcon className="size-7 text-white" />
                            Detalle del registro
                        </DialogTitle>
                        <DialogDescription className="text-white/70">
                            Vista detallada del registro seleccionado.
                        </DialogDescription>

                        {selectedAuditLog && (
                            <div className="grid gap-2 text-sm text-white md:grid-cols-2">
                                <p>
                                    <span className="text-white/60">Tipo:</span> Auditoria
                                </p>
                                <p>
                                    <span className="text-white/60">ID:</span>{' '}
                                    <span className="font-numbers">{selectedAuditLog.id}</span>
                                </p>
                                <p>
                                    <span className="text-white/60">Usuario:</span>{' '}
                                    <span className="font-numbers">{selectedAuditLog.user_id ?? '-'}</span>
                                </p>
                                <p>
                                    <span className="text-white/60">Accion:</span> {selectedAuditLog.action ?? '-'}
                                </p>
                                <p>
                                    <span className="text-white/60">IP:</span>{' '}
                                    <span className="font-numbers">{selectedAuditLog.ip_address ?? '-'}</span>
                                </p>
                                <p>
                                    <span className="text-white/60">Fecha:</span>{' '}
                                    <span className="font-numbers text-amber-200">
                                        {new Date(selectedAuditLog.created_at).toLocaleString()}
                                    </span>
                                </p>
                                <div className="md:col-span-2">
                                    <p className="mb-1 text-white/60">Detalles:</p>
                                    <pre className="max-h-72 overflow-auto rounded-md border border-white/10 bg-black/20 p-3 text-xs text-white">
                                        {JSON.stringify(selectedAuditLog.details, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {selectedUser && (
                            <div className="grid gap-2 text-sm text-white md:grid-cols-2">
                                <p>
                                    <span className="text-white/60">Tipo:</span> Usuario
                                </p>
                                <p>
                                    <span className="text-white/60">ID:</span>{' '}
                                    <span className="font-numbers">{selectedUser.id}</span>
                                </p>
                                <p className="md:col-span-2">
                                    <span className="text-white/60">Correo:</span> {selectedUser.email}
                                </p>
                                <p>
                                    <span className="text-white/60">Fecha:</span>{' '}
                                    <span className="font-numbers text-amber-200">
                                        {new Date(selectedUser.created_at).toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        )}

                        {selectedOtpCode && (
                            <div className="grid gap-2 text-sm text-white md:grid-cols-2">
                                <p>
                                    <span className="text-white/60">Tipo:</span> OTP Code
                                </p>
                                <p>
                                    <span className="text-white/60">ID:</span>{' '}
                                    <span className="font-numbers">{selectedOtpCode.id}</span>
                                </p>
                                <p>
                                    <span className="text-white/60">Usuario:</span>{' '}
                                    <span className="font-numbers">{selectedOtpCode.user_id}</span>
                                </p>
                                <p>
                                    <span className="text-white/60">Codigo:</span>{' '}
                                    <span className="font-numbers">{selectedOtpCode.code}</span>
                                </p>
                                <p>
                                    <span className="text-white/60">Estado:</span>{' '}
                                    {selectedOtpCode.used ? 'Usado' : 'No usado'}
                                </p>
                                <p>
                                    <span className="text-white/60">Expira:</span>{' '}
                                    <span className="font-numbers text-amber-200">
                                        {new Date(selectedOtpCode.expires_at).toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
