import { redirect } from "next/navigation";

export default function Page() {
  redirect("/house"); // 会立即跳转
}
