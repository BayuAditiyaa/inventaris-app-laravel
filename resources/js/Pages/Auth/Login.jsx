import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRightOnRectangleIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    CubeIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
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
        <div className="min-h-screen bg-slate-950 text-white">
            <Head title="Log in" />

            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <section className="hidden flex-col justify-between bg-slate-900 px-10 py-10 lg:flex">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600">
                                <CubeIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold">Breeze Inventory</p>
                                <p className="text-sm text-slate-400">Portfolio operations dashboard</p>
                            </div>
                        </div>

                        <div className="mt-16 max-w-xl">
                            <h1 className="text-4xl font-bold leading-tight">Run inventory, sales, procurement, and reports from one workspace.</h1>
                            <p className="mt-5 text-base leading-7 text-slate-300">
                                Demo-ready Laravel and React application with role-based access, stock-sensitive workflows, purchase orders, PDF exports, and activity logging.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            ['Stock Control', CubeIcon],
                            ['Procurement', ClipboardDocumentListIcon],
                            ['Reporting', ChartBarIcon],
                        ].map(([label, Icon]) => (
                            <div key={label} className="rounded-lg border border-slate-700 bg-slate-800/70 p-4">
                                <Icon className="h-6 w-6 text-blue-300" />
                                <p className="mt-3 text-sm font-medium text-slate-100">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600">
                                    <CubeIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold">Breeze Inventory</p>
                                    <p className="text-sm text-slate-400">Portfolio operations dashboard</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-800 bg-white p-6 text-slate-950 shadow-2xl sm:p-8">
                            <div className="mb-6">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                    <ShieldCheckIcon className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-bold">Sign in</h2>
                                <p className="mt-2 text-sm text-slate-600">Use one of the seeded demo accounts to explore admin and staff workflows.</p>
                            </div>

                            {status && (
                                <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="ms-2 text-sm text-slate-600">Remember me</span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm font-medium text-blue-700 hover:text-blue-800"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>

                            <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setData({ email: 'admin@gmail.com', password: 'password123', remember: data.remember })}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    <span>
                                        <span className="block font-semibold text-slate-800">Admin</span>
                                        <span className="text-slate-500">Reports, products, suppliers, purchase orders</span>
                                    </span>
                                    <span className="text-xs font-semibold text-blue-700">Use</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData({ email: 'staff@gmail.com', password: 'password123', remember: data.remember })}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    <span>
                                        <span className="block font-semibold text-slate-800">Staff</span>
                                        <span className="text-slate-500">Sales, customers, operational access</span>
                                    </span>
                                    <span className="text-xs font-semibold text-blue-700">Use</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
