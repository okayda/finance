import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <div className="container pt-24">
      <Loader2 className="animate-spin h-8 w-8 mx-auto" />
    </div>
  );
}
