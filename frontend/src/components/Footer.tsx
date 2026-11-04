import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/40">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-8 w-full gap-4 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-xs font-black tracking-widest uppercase text-foreground">
            PredictKaro
          </span>
          <p className="text-sm text-muted-foreground">
            © 2026 PredictKaro. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <Link
            className="text-muted-foreground hover:text-primary transition-colors text-xs font-semibold tracking-wider"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-muted-foreground hover:text-primary transition-colors text-xs font-semibold tracking-wider"
            href="/terms"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
