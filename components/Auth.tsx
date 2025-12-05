import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Icons } from './Icons';
import { TermsOfService, PrivacyPolicy } from './LegalDocs';
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Input, 
  FieldGroup, 
  Field, 
  FieldLabel, 
  FieldDescription, 
  FieldSeparator 
} from './AuthShared';

interface AuthProps {
  onLogin: () => void;
}

type ViewState = 'LOGIN' | 'SIGNUP' | 'TERMS' | 'PRIVACY';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleAuth = async (e: React.FormEvent, isSignup: boolean) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        if (password !== confirmPass) throw new Error("Passwords do not match");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username }
          }
        });
        if (error) throw error;
        // Session listener in App.tsx handles the rest
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
     setLoading(true);
     const { error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
     });
     if (error) {
        setError(error.message);
        setLoading(false);
     }
  };

  // Render Legal Pages
  if (view === 'TERMS') return <TermsOfService onBack={() => setView('SIGNUP')} />;
  if (view === 'PRIVACY') return <PrivacyPolicy onBack={() => setView('SIGNUP')} />;

  return (
    <div className="bg-dark-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <a href="#" className="flex items-center gap-2 self-center font-medium text-white hover:text-neon-cyan transition-colors">
          <div className="bg-neon-cyan text-black flex size-6 items-center justify-center rounded-md">
            <Icons.Cpu className="size-4" />
          </div>
          Infinite NFT Creator
        </a>
        
        {view === 'LOGIN' ? (
          <LoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={(e) => handleAuth(e, false)}
            onSwitch={() => { setView('SIGNUP'); setError(null); }}
            onGoogle={handleGoogleLogin}
            loading={loading}
            error={error}
          />
        ) : (
          <SignupForm 
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPass={confirmPass}
            setConfirmPass={setConfirmPass}
            onSubmit={(e) => handleAuth(e, true)}
            onSwitch={() => { setView('LOGIN'); setError(null); }}
            onTerms={() => setView('TERMS')}
            onPrivacy={() => setView('PRIVACY')}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

// --- Sub Components ---

interface LoginProps {
  email: string;
  setEmail: (s: string) => void;
  password: string;
  setPassword: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
  onGoogle: () => void;
  loading: boolean;
  error: string | null;
}

function LoginForm({ className, email, setEmail, password, setPassword, onSubmit, onSwitch, onGoogle, loading, error, ...props }: LoginProps & React.ComponentProps<"div">) {
  return (
    <div className={`flex flex-col gap-6 ${className || ''}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={onGoogle} disabled={loading} className="hover:bg-white hover:text-black hover:border-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator>
                Or continue with
              </FieldSeparator>
              
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                  <Icons.Zap className="w-3 h-3" />
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline text-gray-400 hover:text-white">
                    Forgot your password?
                  </a> */}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading} className={loading ? "opacity-70 cursor-wait" : ""}>
                  {loading ? <Icons.RefreshCw className="w-4 h-4 animate-spin" /> : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <button type="button" onClick={onSwitch} className="text-white hover:underline underline-offset-4">Sign up</button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <span className="text-gray-400">Terms of Service</span>{" "}
        and <span className="text-gray-400">Privacy Policy</span>.
      </FieldDescription>
    </div>
  );
}

interface SignupProps {
  username: string;
  setUsername: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  password: string;
  setPassword: (s: string) => void;
  confirmPass: string;
  setConfirmPass: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
  onTerms: () => void;
  onPrivacy: () => void;
  loading: boolean;
  error: string | null;
}

function SignupForm({ 
  className, 
  username, setUsername, 
  email, setEmail, 
  password, setPassword, 
  confirmPass, setConfirmPass, 
  onSubmit, onSwitch, 
  onTerms, onPrivacy, 
  loading, error,
  ...props 
}: SignupProps & React.ComponentProps<"div">) {
  return (
    <div className={`flex flex-col gap-6 ${className || ''}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                  <Icons.Zap className="w-3 h-3" />
                  {error}
                </div>
              )}
              
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="CryptoKing" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm
                    </FieldLabel>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      required 
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading} className={loading ? "opacity-70 cursor-wait" : ""}>
                   {loading ? <Icons.RefreshCw className="w-4 h-4 animate-spin" /> : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <button type="button" onClick={onSwitch} className="text-white hover:underline underline-offset-4">Sign in</button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <button type="button" onClick={onTerms} className="hover:text-white underline underline-offset-4">Terms of Service</button>{" "}
        and <button type="button" onClick={onPrivacy} className="hover:text-white underline underline-offset-4">Privacy Policy</button>.
      </FieldDescription>
    </div>
  );
}

export default Auth;
