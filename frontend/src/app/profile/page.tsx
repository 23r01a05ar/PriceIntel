"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, Loader2, Save, AlertCircle, Phone, AtSign, AlignLeft, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";

interface Profile {
  username: string;
  full_name: string;
  whatsapp_no: string;
  twitter_handle: string;
  facebook_url: string;
  instagram_url: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    full_name: "",
    whatsapp_no: "",
    twitter_handle: "",
    facebook_url: "",
    instagram_url: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }
      
      if (session.user.email) setEmail(session.user.email);

      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Failed to load profile");
        }
        const data = await res.json();
        if (data.profile) {
          setProfile({
            username: data.profile.username || "",
            full_name: data.profile.full_name || "",
            whatsapp_no: data.profile.whatsapp_no || "",
            twitter_handle: data.profile.twitter_handle || "",
            facebook_url: data.profile.facebook_url || "",
            instagram_url: data.profile.instagram_url || ""
          });
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update profile");
      }

      setSuccess(true);
      // clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full max-w-2xl mx-auto p-6 pt-24">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto min-h-screen pt-28 px-6 pb-12 flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-[0_0_20px_hsla(var(--primary),0.15)]">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-jakarta text-foreground tracking-tight">Public Profile</h1>
            <p className="text-muted-foreground font-medium mt-1">
              Manage your personal information
            </p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border/40"></div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 w-full animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-500 flex items-center gap-3 w-full animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">Profile updated successfully.</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-background/50 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative group">
              <input 
                type="email" 
                disabled 
                value={email}
                className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-muted/30 text-muted-foreground cursor-not-allowed outline-none shadow-sm"
              />
            </div>
            <p className="text-[11px] text-muted-foreground pl-1 mt-1">Your email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <AtSign className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                name="username"
                value={profile.username}
                onChange={handleChange}
                maxLength={80}
                placeholder="dealhunter99"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <AlignLeft className="w-5 h-5" />
              </div>
              <input 
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                maxLength={150}
                placeholder="Jane Doe"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">WhatsApp No.</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  name="whatsapp_no"
                  value={profile.whatsapp_no}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Twitter Handle</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  name="twitter_handle"
                  value={profile.twitter_handle}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="@username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Facebook URL</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input 
                  type="url" 
                  name="facebook_url"
                  value={profile.facebook_url}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="https://facebook.com/username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Instagram URL</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input 
                  type="url" 
                  name="instagram_url"
                  value={profile.instagram_url}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="https://instagram.com/username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold tracking-wide hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
