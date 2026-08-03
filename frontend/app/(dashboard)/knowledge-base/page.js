"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

export default function KnowledgeBasePage() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["knowledge", submitted], queryFn: async () => (await api.get("/knowledge", { params: { q: submitted || undefined } })).data });
  const rows = data?.results || [];
  return (
    <Card>
      <CardHeader><CardTitle>Knowledge Base</CardTitle></CardHeader>
      <CardContent className="grid gap-4 p-4">
        <form className="flex gap-3" onSubmit={e => { e.preventDefault(); setSubmitted(q); }}>
          <Input placeholder="Search validated insights" value={q} onChange={e => setQ(e.target.value)} />
          <Button>Search</Button>
        </form>
        {error && <p className="text-sm text-red-700">{error.message}</p>}
        {isLoading ? <p className="text-sm text-muted-foreground">Searching knowledge base...</p> : (
          <div className="overflow-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground"><tr>{["Insight", "Category", "Source", "Date"].map(h => <th key={h} className="border-b border-border p-4">{h}</th>)}</tr></thead>
              <tbody>{rows.length ? rows.map(item => <tr key={item._id} className="border-b border-border/70">
                <td className="p-4">{item.title}</td>
                <td className="p-4 text-muted-foreground">{formatCategory(item.collection)}</td>
                <td className="p-4 text-muted-foreground">{item.tags?.[0] || item.industry || "Validated finding"}</td>
                <td className="p-4 text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>) : <tr><td className="p-6 text-muted-foreground" colSpan="4">No knowledge base entries found.</td></tr>}</tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatCategory(value = "") {
  return value.split("_").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(" ");
}
