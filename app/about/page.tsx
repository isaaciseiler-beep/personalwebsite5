// app/about/page.tsx — FULL FILE (redirect old /about → /experience)
import { redirect } from "next/navigation";
export default function AboutRedirect() {
  redirect("/experience");
}
