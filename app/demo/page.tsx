import { redirect } from "next/navigation";

// Demo entry point. Sends the visitor straight to the sample Passport in
// transfer pending state with the demo flag on, so the transfer progress
// banner is visible at the top and the broker can see the four steps
// without having to click anything.
//
// Share /demo as the public broker link.
export default function DemoPage() {
  redirect("/passport/bruce-wayne?view=transfer&demo=1");
}
