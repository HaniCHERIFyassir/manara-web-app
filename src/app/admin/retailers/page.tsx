"use client";

import { useState, useEffect } from "react";
import { fetchLeads, updateLeadStatus, Lead } from "@/lib/api/leads";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = async () => {
    const data = await fetchLeads();
    // Sort by date, newest first
    setLeads(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Lead["status"]) => {
    await updateLeadStatus(id, newStatus);
    await loadLeads();
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new": return "bg-red-100 text-red-800";
      case "contacted": return "bg-blue-100 text-blue-800";
      case "converted": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Lead["status"]) => {
    switch (status) {
      case "new": return "Nouveau";
      case "contacted": return "Contacté";
      case "converted": return "Converti";
      default: return status;
    }
  };

  return (
    <div className="p-8 space-y-8 text-[#0a192f]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Demandes de Contact</h2>
        <p className="text-[#5c6b7a]">Suivi des entreprises et fournisseurs souhaitant rejoindre le réseau.</p>
      </div>

      <div className="grid gap-4">
        {leads.length === 0 ? (
          <div className="text-center py-12 text-[#5c6b7a]">
             Aucune demande pour le moment.
          </div>
        ) : leads.map((lead) => (
          <Card key={lead.id} className="border-[#dde5ee] shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={
                    lead.type === "partner" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-orange-50 text-orange-700 border-orange-200"
                  }>
                    {lead.type === "partner" ? "Entreprise" : "Fournisseur"}
                  </Badge>
                  <span className="text-xs text-[#5c6b7a] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(lead.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <CardTitle className="text-xl text-[#0a192f]">{lead.companyName}</CardTitle>
                <CardDescription className="text-[#5c6b7a] font-medium">{lead.contactName}</CardDescription>
              </div>
              <div className="w-32">
                <Select value={lead.status} onValueChange={(val: Lead["status"]) => handleStatusChange(lead.id, val)}>
                  <SelectTrigger className={`h-8 text-xs font-bold ${getStatusColor(lead.status)} border-none shadow-none`}>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nouveau</SelectItem>
                    <SelectItem value="contacted">Contacté</SelectItem>
                    <SelectItem value="converted">Converti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#0a192f]">
                    <Mail className="h-4 w-4 text-[#5b7fa3]" />
                    <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#0a192f]">
                    <Phone className="h-4 w-4 text-[#5b7fa3]" />
                    <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                  </div>
                </div>
                {lead.message && (
                  <div className="bg-[#f4f7fb] p-3 rounded-md border border-[#dde5ee]">
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#5c6b7a] uppercase">
                       <MessageSquare className="h-3 w-3" /> Message
                    </div>
                    <p className="text-sm text-[#0a192f] italic">&quot;{lead.message}&quot;</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
