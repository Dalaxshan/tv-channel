"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { shows, news, presenters } from "@/lib/data";

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      shows: shows.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 4),
      news: news.filter((n) => n.title.toLowerCase().includes(q)).slice(0, 4),
      presenters: presenters.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-24 z-71 w-[92vw] max-w-2xl -translate-x-1/2 rounded-2xl glass p-2 shadow-2xl">
          <Dialog.Title className="sr-only">Search TV Channel</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <Search className="h-5 w-5 text-text-muted shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs, news, presenters..."
              className="w-full bg-transparent text-base outline-none placeholder:text-text-muted"
            />
            <Dialog.Close className="shrink-0 rounded-full p-1.5 hover:bg-white/10" aria-label="Close search">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {!results && (
              <p className="py-8 text-center text-sm text-text-muted">
                Start typing to search across programs, news and presenters.
              </p>
            )}
            {results && (
              <div className="space-y-5">
                {results.shows.length > 0 && (
                  <ResultGroup title="Programs">
                    {results.shows.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/programs/${s.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5"
                      >
                        {s.title} <span className="text-text-muted">· {s.category}</span>
                      </Link>
                    ))}
                  </ResultGroup>
                )}
                {results.news.length > 0 && (
                  <ResultGroup title="News">
                    {results.news.map((n) => (
                      <Link
                        key={n.slug}
                        href={`/news/${n.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5"
                      >
                        {n.title}
                      </Link>
                    ))}
                  </ResultGroup>
                )}
                {results.presenters.length > 0 && (
                  <ResultGroup title="Presenters">
                    {results.presenters.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/presenters/${p.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </ResultGroup>
                )}
                {results.shows.length === 0 &&
                  results.news.length === 0 &&
                  results.presenters.length === 0 && (
                    <p className="py-8 text-center text-sm text-text-muted">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                  )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}
