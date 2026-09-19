"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, ShieldCheck, Key, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ApiConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metaStatus: {
    isConfigured: boolean;
    phoneNumberId: string | null;
    graphVersion: string;
  };
}

export function ApiConfigModal({
  open,
  onOpenChange,
  metaStatus,
}: ApiConfigModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const webhookUrl = typeof window !== "undefined" ? `${window.location.origin}/api/whatsapp` : "https://your-domain.vercel.app/api/whatsapp";
  const verifyToken = "gustosa_secret_webhook_verify_token_2026";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto border-border/80 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Key className="h-4 w-4" />
            </div>
            <DialogTitle>Meta WhatsApp Cloud API Configuration</DialogTitle>
          </div>
          <DialogDescription>
            Connect Gustosa Food directly to Meta WhatsApp Business Platform for live real-time orders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/30">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">API Connection Status</p>
              <p className="text-xs text-muted-foreground">
                {metaStatus.isConfigured
                  ? `Active with Phone Number ID ${metaStatus.phoneNumberId}`
                  : "Mock Mode Active (Local / Simulated orders)"}
              </p>
            </div>
            <Badge variant={metaStatus.isConfigured ? "delivered" : "pending"}>
              {metaStatus.isConfigured ? "Live Connected" : "Mock / Fallback"}
            </Badge>
          </div>

          {/* Webhook Setup details for Meta Developer Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              1. Meta Webhook Configuration
            </h4>
            <p className="text-xs text-muted-foreground">
              Add this callback URL and Verify Token in your{" "}
              <a
                href="https://developers.facebook.com/apps"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Meta Developer App Dashboard <ExternalLink className="w-3 h-3" />
              </a>{" "}
              under WhatsApp &gt; Configuration.
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between">
                <div className="overflow-hidden mr-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Callback URL (GET / POST)
                  </span>
                  <span className="font-mono text-xs text-foreground truncate block select-all">
                    {webhookUrl}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(webhookUrl, "Callback URL")}
                >
                  {copiedField === "Callback URL" ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="p-2.5 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between">
                <div className="overflow-hidden mr-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Verify Token
                  </span>
                  <span className="font-mono text-xs text-foreground truncate block select-all">
                    {verifyToken}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(verifyToken, "Verify Token")}
                >
                  {copiedField === "Verify Token" ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              2. Environment Variables (.env.local or Vercel)
            </h4>
            <div className="rounded-xl border border-border/80 bg-slate-950 p-3.5 text-slate-200 font-mono text-xs overflow-x-auto space-y-1">
              <p className="text-slate-400"># Required for live messaging</p>
              <p>WHATSAPP_API_TOKEN=your_permanent_access_token</p>
              <p>WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id</p>
              <p>WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id</p>
              <p>WHATSAPP_WEBHOOK_VERIFY_TOKEN={verifyToken}</p>
              <p>META_GRAPH_API_VERSION={metaStatus.graphVersion}</p>
            </div>
          </div>

          {/* Webhook Subscription fields */}
          <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-950 dark:text-blue-200 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> Webhook Event Fields to Subscribe
            </div>
            <p className="text-muted-foreground">
              In Meta App Dashboard, subscribe to the <code className="font-mono text-primary font-bold">messages</code> field to automatically receive catalog orders and customer texts.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
