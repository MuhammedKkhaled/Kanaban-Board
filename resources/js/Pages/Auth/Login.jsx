import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to pick up where you left off."
            alt={{
                text: "Don't have an account?",
                label: 'Create one',
                href: route('register'),
            }}
        >
            <Head title="Log in" />

            {status && (
                <div className="animate-card-in mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="animate-card-in" style={{ animationDelay: '120ms' }}>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="animate-card-in" style={{ animationDelay: '160ms' }}>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <label
                    className="animate-card-in flex cursor-pointer items-center"
                    style={{ animationDelay: '200ms' }}
                >
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-gray-600">Remember me</span>
                </label>

                <PrimaryButton
                    className="animate-card-in w-full justify-center py-3 text-sm"
                    style={{ animationDelay: '240ms' }}
                    disabled={processing}
                >
                    {processing ? 'Logging in…' : 'Log in'}
                </PrimaryButton>
            </form>
        </AuthLayout>
    );
}
