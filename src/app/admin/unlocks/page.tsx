import { redirect } from "next/navigation";

export default function AdminUnlocksRedirect() {
  redirect("/admin/links");
}
