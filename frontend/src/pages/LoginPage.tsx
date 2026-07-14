import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LoginPageProps = {
  onLoginSuccess: (token: string) => void;
};

async function readJsonOrText(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@smartashtray.local');
  const [password, setPassword] = useState('admin1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL ?? '/api';
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await readJsonOrText(response);
      if (!response.ok) {
        const detail = data && typeof data === 'object' && 'detail' in data ? String(data.detail) : '로그인에 실패했습니다.';
        throw new Error(detail);
      }

      const token = data && typeof data === 'object' && 'access_token' in data ? String(data.access_token) : 'demo-token';
      onLoginSuccess(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl border border-border-base bg-bg-card p-8">
        <h1 className="text-2xl font-semibold">Smart Clean Ashtray</h1>
        <p className="text-sm text-text-secondary">Sign in to access the real-time monitoring dashboard.</p>
        <input
          className="rounded-lg border border-border-base bg-bg-base px-4 py-3"
          placeholder="이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="rounded-lg border border-border-base bg-bg-base px-4 py-3"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-sm text-state-fire">{error}</p> : null}
        <button className="rounded-lg bg-accent px-4 py-3 font-semibold text-bg-base" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
        <button type="button" className="text-sm text-accent" onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
