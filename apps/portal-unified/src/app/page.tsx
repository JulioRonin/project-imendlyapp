import { redirect } from "next/navigation";

// La entrada principal es el portal de clientes: se explora sin cuenta y
// el registro se pide solo al momento de solicitar algo.
export default function RootPage() {
  redirect("/cliente");
}
