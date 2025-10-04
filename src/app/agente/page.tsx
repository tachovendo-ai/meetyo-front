'use client';

import { useState } from 'react';

// === PALETA ===
const COLOR = {
  accent: '#FFA216',   // laranja
  light:  '#D3D5D5',   // cinza claro
  dark:   '#383C3D',   // fundo
  white:  '#FFFFFF',   // texto principal
};

// URL do backend
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function AgenteClimatico() {
  const [msg, setMsg] = useState('Vai chover em Vilhena Rondônia amanhã?');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function ask() {
    if (!msg.trim()) return;
    setLoading(true); setErr(''); setAnswer('');
    try {
      const r = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg.trim() }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setAnswer((data?.answer ?? '').trim() || '(sem resposta)');
    } catch (e: any) {
      setErr(`Falha ao falar com o backend: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <img src="/images/meetyo.svg" alt="meetyo" width={28} height={28} />
          <h1 style={styles.title}>meetyo — agente climático</h1>
        </div>
        <span style={styles.badge}>MVP</span>
      </header>

      <p style={styles.subtitle}>
        Pergunte em linguagem natural. Ex.: <i>Vai chover em Vilhena amanhã?</i>
      </p>

      <section style={styles.card}>
        <label htmlFor="q" style={styles.label}>Pergunta</label>
        <div style={styles.inputRow}>
          <input
            id="q"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="Vai chover em Vilhena Rondônia amanhã?"
            style={styles.input}
          />
          <button onClick={ask} disabled={loading || !msg.trim()} style={{ ...styles.button, ...(loading || !msg.trim() ? styles.buttonDisabled : {}) }}>
            {loading ? 'Consultando…' : 'Perguntar'}
          </button>
        </div>

        <div style={styles.quickRow}>
          <button onClick={() => setMsg('Vai estar muito quente em Vilhena amanhã?')} style={styles.ghostButton}>Exemplo (calor)</button>
          <button onClick={() => setMsg('Vai chover forte em Vilhena amanhã?')} style={styles.ghostButton}>Exemplo (chuva)</button>
          <button onClick={() => setMsg('Vai ventar forte em Vilhena amanhã?')} style={styles.ghostButton}>Exemplo (vento)</button>
        </div>

        <h2 style={styles.sectionTitle}>Resposta</h2>

        {err && <div style={styles.error}>{err}</div>}

        {answer && (
          <div style={styles.answerBox}>
            {answer}
          </div>
        )}
      </section>

      <footer style={styles.footer}>
        Backend:&nbsp;
        <code style={{ color: COLOR.white }}>{BACKEND}</code>
        &nbsp;· FastAPI + IA local (Ollama).
      </footer>
    </main>
  );
}

// === STYLES ===
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    background: COLOR.dark,
    color: COLOR.white,
    padding: '32px 16px',
  },
  header: {
    maxWidth: 920,
    margin: '0 auto 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  badge: {
    background: COLOR.accent,
    color: '#1a1a1a',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 700,
  },
  subtitle: {
    maxWidth: 920,
    margin: '0 auto 24px',
    color: COLOR.light,
  },
  card: {
    maxWidth: 920,
    margin: '0 auto',
    border: `1px solid ${hexWithAlpha(COLOR.light, 0.25)}`,
    borderRadius: 14,
    padding: 16,
    background: '#2F3334',
    boxShadow: `0 0 0 1px ${hexWithAlpha(COLOR.light, 0.05)} inset`,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    fontSize: 14,
    color: COLOR.light,
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  input: {
    flex: 1,
    minWidth: 260,
    padding: '12px 14px',
    borderRadius: 10,
    border: `1px solid ${hexWithAlpha(COLOR.light, 0.35)}`,
    background: '#26292A',
    color: COLOR.white,
    outline: 'none',
  },
  button: {
    padding: '12px 16px',
    borderRadius: 10,
    border: `1px solid ${COLOR.accent}`,
    background: COLOR.accent,
    color: '#1a1a1a',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform .05s ease',
  },
  buttonDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed',
    filter: 'grayscale(30%)',
  },
  ghostButton: {
    padding: '10px 14px',
    borderRadius: 10,
    border: `1px solid ${hexWithAlpha(COLOR.light, 0.35)}`,
    background: 'transparent',
    color: COLOR.light,
    cursor: 'pointer',
  },
  quickRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    margin: '18px 0 8px',
    color: COLOR.white,
  },
  answerBox: {
    background: '#1F2223',
    color: COLOR.white,
    padding: 14,
    borderRadius: 10,
    whiteSpace: 'pre-wrap' as const,
    lineHeight: 1.5,
    border: `1px solid ${hexWithAlpha(COLOR.light, 0.25)}`,
  },
  error: {
    background: '#3b1f1f',
    color: '#ffb3b3',
    border: '1px solid #6b2a2a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    whiteSpace: 'pre-wrap' as const,
  },
  footer: {
    maxWidth: 920,
    margin: '16px auto 0',
    color: COLOR.light,
    fontSize: 13,
  },
};

// util para aplicar alfa em hex
function hexWithAlpha(hex: string, alpha: number) {
  // alpha 0..1 -> 00..FF
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `${hex}${a}`;
}
