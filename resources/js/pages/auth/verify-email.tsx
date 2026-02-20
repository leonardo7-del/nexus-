// Components
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';

export default function VerifyEmail({ status }: { status?: string }) {
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);

        router.post(logout.url(), undefined, {
            onFinish: () => {
                setIsLoggingOut(false);
                setIsLogoutDialogOpen(false);
            },
        });
    };

    return (
        <AuthLayout
            title="Verifica tu correo"
            description="Verifica tu dirección de correo haciendo clic en el enlace que te enviamos."
        >
            <Head title="Verificación de correo" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Se envió un nuevo enlace de verificación al correo que
                    registraste.
                </div>
            )}

            <Form
                action="/email/verification-notification"
                method="post"
                className="space-y-6 text-center"
            >
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Reenviar correo de verificación
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                setIsLogoutDialogOpen(true);
                            }}
                        >
                            Cerrar sesión
                        </TextLink>
                    </>
                )}
            </Form>

            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <DialogContent>
                    <DialogTitle>¿Seguro que quieres cerrar sesión?</DialogTitle>
                    <DialogDescription>
                        Tu sesión actual se cerrará en este dispositivo.
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut && <Spinner />}
                            Aceptar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthLayout>
    );
}
