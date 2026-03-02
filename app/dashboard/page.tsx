"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [clients, setClients] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

    useEffect(() => {
    const checkSession = async () => {
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
        router.replace("/login");
        return;
        }

        const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

        if (!error && data) {
        setClients(data);
        }

        setLoading(false);
    };

    checkSession();
    }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

    const addClient = async () => {
    if (!newName.trim() || !newPhone.trim()) {
        alert("Completa nombre y teléfono");
        return;
    }

    const { data, error } = await supabase
        .from("clients")
        .insert([
        {
            full_name: newName,
            phone: newPhone,
        },
        ])
        .select();

    if (error) {
        alert("Error: " + error.message);
        return;
    }

    if (data && data.length > 0) {
        setClients([data[0], ...clients]);
        setNewName("");
        setNewPhone("");
    }
    };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Ya estás logueado ✅</p>
      <button onClick={logout}>Cerrar sesión</button>

        <h2 style={{ marginTop: 30 }}>Nuevo Cliente</h2>

        <input
        placeholder="Nombre completo"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        />

        <br /><br />

        <input
        placeholder="Teléfono"
        value={newPhone}
        onChange={(e) => setNewPhone(e.target.value)}
        />

        <br /><br />

        <button onClick={addClient}>Agregar</button>
        
        
        <h2 style={{ marginTop: 30 }}>Mis Clientes</h2>

        {clients.length === 0 && <p>No tienes clientes aún.</p>}

        <ul>
        {clients.map((client) => (
            <li key={client.id}>
            {client.full_name} - {client.phone}
            </li>
        ))}
        </ul>

    </div>
  );
}