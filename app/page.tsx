'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useState, useEffect } from 'react';

const SUGGESTIONS = [
  'Show me all products',
  'What are the top 5 selling products?',
  'Total sales by region',
];

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className="flex flex-col h-dvh max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white text-lg">
          🗄️
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">SQL Agent</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Ask anything about your database in natural language
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="text-5xl">💬</div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Ask me anything about your database!
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div key={message.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${isUser
                    ? 'bg-indigo-100 dark:bg-indigo-900/40'
                    : 'bg-zinc-100 dark:bg-zinc-800'
                  }`}
              >
                {isUser ? '👤' : '🤖'}
              </div>

              {/* Content */}
              <div className={`flex flex-col gap-2 max-w-[85%] min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
                {message.parts.map((part, i) => {
                  const key = `${message.id}-${i}`;
                  switch (part.type) {
                    case 'text':
                      if (!part.text.length) return null;
                      return (
                        <div
                          key={key}
                          className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words
                            ${isUser
                              ? 'bg-indigo-600 text-white rounded-2xl rounded-br-md'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-2xl rounded-bl-md'
                            }`}
                        >
                          {part.text}
                        </div>
                      );

                    case 'tool-schema': {
                      if (part.state === 'output-available') return null;
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700"
                        >
                          <span
                            className="inline-block w-3 h-3 border-2 border-zinc-300 dark:border-zinc-600 border-t-indigo-500 rounded-full"
                            style={{ animation: 'spin 0.6s linear infinite' }}
                          />
                          Fetching database schema...
                        </div>
                      );
                    }

                    case 'tool-db': {
                      const query = (part.input as { query?: string })?.query ?? '';
                      return (
                        <div
                          key={key}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900"
                        >
                          {/* SQL header */}
                          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                              🔍 SQL Query
                            </span>
                          </div>
                          {/* SQL code */}
                          <pre className="px-4 py-3 text-sm leading-relaxed overflow-x-auto bg-zinc-900 text-green-400 font-mono whitespace-pre-wrap break-all">
                            <code>{query}</code>
                          </pre>
                          {/* Result */}
                          <div className="border-t border-zinc-200 dark:border-zinc-700">
                            {part.state === 'output-available' ? (
                              <QueryResult result={part.output} />
                            ) : (
                              <div className="flex items-center gap-2 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                                <span
                                  className="inline-block w-3 h-3 border-2 border-zinc-300 dark:border-zinc-600 border-t-indigo-500 rounded-full"
                                  style={{ animation: 'spin 0.6s linear infinite' }}
                                />
                                Running query...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          );
        })}

        {/* Thinking indicator */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-zinc-100 dark:bg-zinc-800">
              🤖
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-md">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
                  style={{
                    animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-4 pb-4 pt-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        {/* Suggestion chips — always visible */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-colors"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask about your database..."
            disabled={status !== 'ready'}
            className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:opacity-50"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={() => stop()}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm transition-colors cursor-pointer"
            >
              ⏹
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function QueryResult({ result }: { result: unknown }) {
  if (typeof result === 'string') {
    return (
      <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30">
        {result}
      </div>
    );
  }

  const data = result as { columns?: string[]; rows?: Record<string, unknown>[] };

  if (!data.rows || data.rows.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 italic">
        No results found.
      </div>
    );
  }

  const columns = data.columns ?? Object.keys(data.rows[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap bg-zinc-50 dark:bg-zinc-800/50"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                >
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.rows.length > 0 && (
        <div className="px-4 py-1.5 text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700">
          {data.rows.length} row{data.rows.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
