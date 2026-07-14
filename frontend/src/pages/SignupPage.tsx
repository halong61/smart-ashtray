import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL ?? '/api';
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.');
      }

      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl border border-border-base bg-bg-card p-8">
        <h1 className="text-2xl font-semibold">회원가입</h1>
        <p className="text-sm text-text-secondary">관리자 계정을 생성해 관제 시스템을 시작하세요.</p>

        <input
          className="rounded-lg border border-border-base bg-bg-base px-4 py-3"
          placeholder="이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
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
          {loading ? '처리 중...' : '가입하기'}
        </button>

        <Link to="/login" className="text-center text-sm text-accent">
          이미 계정이 있나요? 로그인하기
        </Link>
      </form>
    </div>
  );
}

export default SignupPage;
