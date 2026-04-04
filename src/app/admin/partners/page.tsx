"use client";

import { useState, useEffect } from "react";
import { fetchPartners, addPartner, updatePartner, deletePartner } from "@/lib/api/partners";
import { PartnerCompany } from "@/types/partner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerCompany[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    sector: "",
    initials: "",
    domain: "",
    primaryColor: "#0a192f",
  });
  const [editingPartner, setEditingPartner] = useState<PartnerCompany | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadPartners = async () => {
    const data = await fetchPartners();
    setPartners(data.reverse()); // Show newest first
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const partnerToSave: PartnerCompany = {
      id: newPartner.name.toLowerCase().replace(/\s+/g, '-'),
      name: newPartner.name,
      sector: newPartner.sector,
      initials: newPartner.initials,
      domains: [newPartner.domain],
      branding: {
        primaryColor: newPartner.primaryColor,
        welcomeMessage: `Bienvenue à la famille ${newPartner.name}`,
      }
    };

    await addPartner(partnerToSave);
    await loadPartners();
    setIsDialogOpen(false);
    setNewPartner({ name: "", sector: "", initials: "", domain: "", primaryColor: "#0a192f" });
  };

  const handleEditPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    await updatePartner(editingPartner);
    await loadPartners();
    setIsEditDialogOpen(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
      await deletePartner(id);
      await loadPartners();
    }
  };

  return (
    <div className="p-8 space-y-8 text-[#0a192f]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partenaires</h2>
          <p className="text-[#5c6b7a]">Gérez les entreprises membres du réseau Manara.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0a192f] text-white hover:bg-[#1e3a5f]">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un partenaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau partenaire</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de l'entreprise</label>
                <Input required value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Secteur d'activité</label>
                <Input required value={newPartner.sector} onChange={e => setNewPartner({...newPartner, sector: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initiales (Logo)</label>
                  <Input required maxLength={2} value={newPartner.initials} onChange={e => setNewPartner({...newPartner, initials: e.target.value.toUpperCase()})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Couleur Principale</label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 p-1" value={newPartner.primaryColor} onChange={e => setNewPartner({...newPartner, primaryColor: e.target.value})} />
                    <Input type="text" className="flex-1" value={newPartner.primaryColor} onChange={e => setNewPartner({...newPartner, primaryColor: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Domaine d'email corporatif (ex: renault.com)</label>
                <Input required value={newPartner.domain} onChange={e => setNewPartner({...newPartner, domain: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-[#0a192f] text-white font-bold hover:bg-[#1e3a5f]">
                Enregistrer
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le partenaire</DialogTitle>
            </DialogHeader>
            {editingPartner && (
              <form onSubmit={handleEditPartner} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de l'entreprise</label>
                  <Input required value={editingPartner.name} onChange={e => setEditingPartner({...editingPartner, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secteur d'activité</label>
                  <Input required value={editingPartner.sector} onChange={e => setEditingPartner({...editingPartner, sector: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initiales (Logo)</label>
                    <Input required maxLength={2} value={editingPartner.initials} onChange={e => setEditingPartner({...editingPartner, initials: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Couleur Principale</label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 p-1" value={editingPartner.branding?.primaryColor || "#0a192f"} onChange={e => setEditingPartner({...editingPartner, branding: { ...editingPartner.branding, primaryColor: e.target.value }})} />
                      <Input type="text" className="flex-1" value={editingPartner.branding?.primaryColor || "#0a192f"} onChange={e => setEditingPartner({...editingPartner, branding: { ...editingPartner.branding, primaryColor: e.target.value }})} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Domaine d'email corporatif</label>
                  <Input required value={editingPartner.domains[0] || ""} onChange={e => setEditingPartner({...editingPartner, domains: [e.target.value]})} />
                </div>
                <Button type="submit" className="w-full bg-[#0a192f] text-white font-bold hover:bg-[#1e3a5f]">
                  Mettre à jour
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <Card key={partner.id} className="border-[#dde5ee] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div
                className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-[var(--brand-border)] font-heading text-xl font-bold text-white shadow-sm"
                style={{ backgroundColor: partner.branding?.primaryColor || '#0a192f' }}
              >
                {partner.initials}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg text-[#0a192f]">{partner.name}</CardTitle>
                <CardDescription className="text-[#5c6b7a]">{partner.sector}</CardDescription>
              </div>
              <div className="flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity">
                 <button onClick={() => { setEditingPartner(partner); setIsEditDialogOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                    <Edit className="h-4 w-4" />
                 </button>
                 <button onClick={() => handleDeletePartner(partner.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 className="h-4 w-4" />
                 </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-[#5c6b7a] bg-[#f4f7fb] p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Domaine: <strong>@{partner.domains[0]}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
