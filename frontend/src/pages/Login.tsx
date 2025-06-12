import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentAuthContext } from '@/context/StudentContext';
import { AdminAuthContext } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { extractErrorMessage } from '@/utils/errorHandler';

function Login() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const studentAuth = useContext(StudentAuthContext);
    const adminAuth = useContext(AdminAuthContext);

    const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isEnrollment = (value: string) => /^\d{10,}$/.test(value);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isEmail(identifier)) {
                await adminAuth.login(identifier, password);
                toast("Admin Login Successful");
                navigate('/dashboard');
            } else if (isEnrollment(identifier)) {
                await studentAuth.login(identifier, password);
                toast("Student Login Successful");
                navigate('/exam-window');
            } else {
                throw new Error("Invalid identifier format. Use your email or enrollment number.");
            }
        } catch (error: unknown) {
            const errMsg = extractErrorMessage(error, "Login failed. Please try again.");
            toast.error("Login Failed", { description: errMsg });
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-primary-foreground font-bold text-2xl">E</span>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">ExGen AI</h2>
                </div>

                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-xl text-foreground">Sign In</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Enter your credentials to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="identifier" className="text-foreground">Username</Label>
                                <Input
                                    id="identifier"
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="username"
                                    required
                                    className="bg-background border-border text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="bg-background border-border text-foreground"
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-md">{error}</div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Login;
