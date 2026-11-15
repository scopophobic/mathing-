import Link from "next/link";
import type { ReactNode } from "react";
import type { AwaitedLearner } from "@/components/types";

const navigation = [
  ["/today", "Today", "⌂"], ["/topics", "Topic paths", "⌘"], ["/diagnostic", "Diagnostic", "◫"], ["/memory", "Memory", "↺"],
] as const;

export function AppShell({ learner, children }: { learner: AwaitedLearner; children: ReactNode }) {
  return <>
    <header className="topbar">
      <Link className="wordmark-link" href="/today"><span>∴</span> Mathing</Link>
      <p>A quiet place to understand one thing at a time.</p>
      <div className="account"><span>{learner.name}</span><a href="/logout">Sign out</a></div>
    </header>
    <div className="app-shell">
      <aside className="sidebar">
        <nav aria-label="Main navigation">{navigation.map(([href, label, mark]) => <Link href={href} key={href}><span>{mark}</span>{label}</Link>)}</nav>
        {learner.role === "admin" ? <Link className="admin-link" href="/admin/invites">Manage beta access</Link> : null}
        <div className="weekly-note"><strong>This week</strong><div className="week-rule"><i /><i /><i /><i /><i /></div><p>No streaks to protect.<br />Return when you can think.</p></div>
      </aside>
      <main id="main" className="main-content">{children}</main>
    </div>
  </>;
}
