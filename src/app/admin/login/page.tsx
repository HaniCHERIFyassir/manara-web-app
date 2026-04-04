"use client";

import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError("Mot de passe incorrect.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f4f7fb] p-4">
      <div className="w-full max-w-md rounded-lg border border-[#dde5ee] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eef5]">
            <Lock className="h-6 w-6 text-[#0a192f]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0a192f]">Accès Restreint</h1>
            <p className="text-sm text-[#5c6b7a]">Veuillez vous identifier pour accéder au portail d'administration Manara.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mot de passe administrateur"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              className="text-center"
            />
            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#0a192f] hover:bg-[#152a45] text-white font-bold"
          >
            Se connecter
          </Button>
          <div className="text-center">
             <p className="text-[10px] text-[#5c6b7a] mt-4">Pour la démo, utilisez le mot de passe: <strong>admin123</strong></p>
          </div>
        </form>
      </div>
    </div>
  );
}
