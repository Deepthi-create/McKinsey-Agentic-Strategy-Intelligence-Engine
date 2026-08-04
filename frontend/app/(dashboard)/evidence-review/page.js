"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { api } from "../../../lib/api";
import { isReviewerRole } from "../../../lib/roles";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export default function EvidenceReviewPage() {
  const qc = useQueryClient();
  const user = useSelector(state => state.auth.user);
  const canReview = isReviewerRole(user?.role);
  const { data = [], isLoading, error } = useQuery({ queryKey: ["jobs-evidence"], enabled: canReview, queryFn: async () => (await api.get("/research-jobs")).data.jobs });
  const evidenceQuery = useQuery({ queryKey: ["evidence-all", data.map(j => j._id).join(",")], enabled: data.length > 0, queryFn: async () => {
    const all = await Promise.all(data.map(j => api.get(`/research-jobs/${j._id}`)));
    return all.flatMap(r => r.data.evidence);
  } });
  const review = useMutation({ mutationFn: ({ id, status }) => api.patch(`/evidence/${id}/review`, { status }), onSuccess: () => qc.invalidateQueries({ queryKey: ["evidence-all"] }) });
  const rows = evidenceQuery.data || [];

  if (!canReview) {
    return (
      <Card>
        <CardHeader><CardTitle>Evidence Review</CardTitle></CardHeader>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Evidence decisions are available only to reviewer and admin accounts.
        </CardContent>
      </Card>
    );
  }

  if (isLoading || evidenceQuery.isLoading) return <p className="text-sm text-muted-foreground">Loading evidence review queue...</p>;
  if (error || evidenceQuery.error) return <p className="text-sm text-red-700">{(error || evidenceQuery.error).message}</p>;

  return (
    <Card>
      <CardHeader><CardTitle>Evidence Review Queue</CardTitle></CardHeader>
      <CardContent className="overflow-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground"><tr>{["Claim", "Source", "Confidence", "Status", "Actions"].map(h => <th key={h} className="border-b border-border p-4">{h}</th>)}</tr></thead>
          <tbody>{rows.length ? rows.map(e => <tr key={e._id} className="border-b border-border/70">
            <td className="p-4">{e.claim}</td>
            <td className="p-4"><a className="text-primary hover:underline" href={e.source?.url} target="_blank">{e.source?.publisher || "Source"}</a></td>
            <td className="p-4 text-muted-foreground">{Math.round(e.confidence * 100)}%</td>
            <td className="p-4 capitalize text-muted-foreground">{e.validationStatus}</td>
            <td className="flex gap-2 p-4">
              <Button variant="secondary" disabled={review.isPending} onClick={() => review.mutate({ id: e._id, status: "approved" })}>Approve</Button>
              <Button variant="secondary" disabled={review.isPending} onClick={() => review.mutate({ id: e._id, status: "flagged" })}>Flag</Button>
              <Button variant="danger" disabled={review.isPending} onClick={() => review.mutate({ id: e._id, status: "rejected" })}>Reject</Button>
            </td>
          </tr>) : <tr><td className="p-6 text-muted-foreground" colSpan="5">No evidence records available for review.</td></tr>}</tbody>
        </table>
      </CardContent>
    </Card>
  );
}
