import { Head, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfil',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;
    const profileInitial = (auth.user.name?.[0] ?? auth.user.email?.[0] ?? 'U')
        .toUpperCase();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil" />

            <h1 className="sr-only">Configuración de perfil</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted text-xl font-semibold">
                            {profileInitial}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                {auth.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {auth.user.email}
                            </p>
                        </div>
                    </div>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
