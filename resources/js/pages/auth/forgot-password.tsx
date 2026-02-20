// Components
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

type Props = {
    status?: string;
    otpEmail?: string;
};

export default function ForgotPassword({ status, otpEmail }: Props) {
    return (
        <AuthLayout
            title="Olvidé mi contraseña"
            description="Ingresa tu correo para recibir un código OTP y restablecer tu contraseña"
        >
            <Head title="Recuperar contraseña" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form action="/forgot-password/otp" method="post">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="w-full"
                                    disabled={processing}
                                    data-test="send-password-reset-otp-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Enviar código OTP
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {otpEmail && (
                    <Form
                        action="/forgot-password/otp/verify"
                        method="post"
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <p className="text-center text-sm text-muted-foreground">
                                    Código enviado a{' '}
                                    <span className="font-medium">{otpEmail}</span>
                                </p>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">Código OTP</Label>
                                    <InputOTP
                                        id="code"
                                        name="code"
                                        maxLength={6}
                                        inputMode="numeric"
                                        pattern={REGEXP_ONLY_DIGITS}
                                        autoComplete="one-time-code"
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
                                    className="w-full"
                                    disabled={processing}
                                    data-test="verify-password-reset-otp-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Verificar OTP y continuar
                                </Button>
                            </>
                        )}
                    </Form>
                )}

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>O vuelve a</span>
                    <TextLink href={login()}>iniciar sesión</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
