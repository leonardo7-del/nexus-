import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    status?: string;
    email?: string;
};

export default function Otp({ status, email }: Props) {
    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            const navigationEntry = performance.getEntriesByType('navigation')[0] as
                | PerformanceNavigationTiming
                | undefined;
            const isBackForward = navigationEntry?.type === 'back_forward';

            if (event.persisted || isBackForward) {
                window.location.reload();
            }
        };

        window.addEventListener('pageshow', handlePageShow);

        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    return (
        <AuthLayout
            title="Verificación OTP"
            description="Ingresa el código de 6 dígitos enviado a tu correo"
        >
            <Head title="Verificación OTP" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {email && (
                <p className="mb-4 text-center text-sm text-muted-foreground">
                    Correo destino: <span className="font-medium">{email}</span>
                </p>
            )}

            <Form
                action="/otp"
                method="post"
                options={{ replace: true }}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="code">Código OTP</Label>
                            <InputOTP
                                id="code"
                                name="code"
                                maxLength={6}
                                inputMode="numeric"
                                pattern={REGEXP_ONLY_DIGITS}
                                autoComplete="one-time-code"
                                autoFocus
                                required
                                containerClassName="justify-center"
                            >
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0} className="h-12 w-12 rounded-md border border-input text-base first:rounded-md first:border-l" />
                                    <InputOTPSlot index={1} className="h-12 w-12 rounded-md border border-input text-base first:rounded-md first:border-l" />
                                    <InputOTPSlot index={2} className="h-12 w-12 rounded-md border border-input text-base first:rounded-md first:border-l" />
                                    <InputOTPSlot index={3} className="h-12 w-12 rounded-md border border-input text-base first:rounded-md first:border-l" />
                                    <InputOTPSlot index={4} className="h-12 w-12 rounded-md border border-input text-base first:rounded-md first:border-l" />
                                    <InputOTPSlot index={5} className="h-12 w-12 rounded-md border border-input text-base first:rounded-md first:border-l" />
                                </InputOTPGroup>
                            </InputOTP>
                            <InputError message={errors.code} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                            data-test="verify-otp-button"
                        >
                            {processing && <Spinner />}
                            Verificar código
                        </Button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
