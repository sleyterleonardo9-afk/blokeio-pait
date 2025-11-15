"use client"

import { useState, useEffect } from "react"
import { Shield, Plus, Trash2, Phone, MessageSquare, Search, AlertCircle } from "lucide-react"

interface BlockedContact {
  id: string
  number: string
  name?: string
  type: "calls" | "sms" | "both"
  blockedAt: string
}

export default function ShieldGuardApp() {
  const [mounted, setMounted] = useState(false)
  const [isProtectionActive, setIsProtectionActive] = useState(true)
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([
    {
      id: "1",
      number: "+1 (555) 123-4567",
      name: "Spam Caller",
      type: "both",
      blockedAt: "2024-01-15"
    },
    {
      id: "2",
      number: "+1 (555) 987-6543",
      type: "calls",
      blockedAt: "2024-01-20"
    }
  ])
  
  const [newNumber, setNewNumber] = useState("")
  const [newName, setNewName] = useState("")
  const [newReason, setNewReason] = useState("")
  const [blockType, setBlockType] = useState<"calls" | "sms" | "both">("both")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addBlockedContact = () => {
    if (!newNumber.trim()) return

    const newContact: BlockedContact = {
      id: Date.now().toString(),
      number: newNumber,
      name: newName || undefined,
      type: blockType,
      blockedAt: new Date().toISOString().split('T')[0]
    }

    setBlockedContacts([newContact, ...blockedContacts])
    setNewNumber("")
    setNewName("")
    setNewReason("")
    setBlockType("both")
    setShowAddForm(false)
  }

  const removeBlockedContact = (id: string) => {
    setBlockedContacts(blockedContacts.filter(contact => contact.id !== id))
  }

  const filteredContacts = blockedContacts.filter(contact => 
    contact.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getBlockTypeIcon = (type: string) => {
    switch(type) {
      case "calls": return <Phone className="w-4 h-4" />
      case "sms": return <MessageSquare className="w-4 h-4" />
      case "both": return <Shield className="w-4 h-4" />
      default: return null
    }
  }

  const getBlockTypeLabel = (type: string) => {
    switch(type) {
      case "calls": return "Chamadas"
      case "sms": return "SMS"
      case "both": return "Tudo"
      default: return ""
    }
  }

  const formatDate = (dateString: string) => {
    if (!mounted) return ""
    try {
      const date = new Date(dateString + 'T00:00:00')
      return date.toLocaleDateString('pt-BR')
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg shadow-purple-500/50">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Shield Guard
                </h1>
                <p className="text-purple-300 text-sm">Proteção Inteligente Contra Spam</p>
              </div>
            </div>
            
            {/* Protection Toggle */}
            <button
              onClick={() => setIsProtectionActive(!isProtectionActive)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isProtectionActive
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/50"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              }`}
            >
              {isProtectionActive ? "🛡️ Protegido" : "⚠️ Desprotegido"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 p-6 rounded-2xl">
            <div className="text-3xl font-bold mb-1">{blockedContacts.length}</div>
            <div className="text-purple-200 text-sm">Contatos Bloqueados</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl">
            <div className="text-3xl font-bold mb-1">
              {blockedContacts.filter(c => c.type === "calls" || c.type === "both").length}
            </div>
            <div className="text-slate-300 text-sm">Chamadas Bloqueadas</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl">
            <div className="text-3xl font-bold mb-1">
              {blockedContacts.filter(c => c.type === "sms" || c.type === "both").length}
            </div>
            <div className="text-slate-300 text-sm">SMS Bloqueados</div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar contato bloqueado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            <Plus className="w-5 h-5" />
            Bloquear Número
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              Adicionar Número à Lista de Bloqueio
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Número de Telefone *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Spam Telemarketing"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Motivo do Bloqueio (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ligações insistentes"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Bloqueio
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setBlockType("calls")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      blockType === "calls"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-slate-700/50 bg-slate-950/50 hover:border-slate-600"
                    }`}
                  >
                    <Phone className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Chamadas</div>
                  </button>
                  <button
                    onClick={() => setBlockType("sms")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      blockType === "sms"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-slate-700/50 bg-slate-950/50 hover:border-slate-600"
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">SMS</div>
                  </button>
                  <button
                    onClick={() => setBlockType("both")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      blockType === "both"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-slate-700/50 bg-slate-950/50 hover:border-slate-600"
                    }`}
                  >
                    <Shield className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Ambos</div>
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={addBlockedContact}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-xl font-semibold transition-all"
                >
                  Bloquear Agora
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blocked Contacts List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold mb-4 text-slate-300">
            Lista de Bloqueio ({filteredContacts.length})
          </h2>
          
          {filteredContacts.length === 0 ? (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <p className="text-slate-400 text-lg">
                {searchQuery ? "Nenhum contato encontrado" : "Nenhum número bloqueado ainda"}
              </p>
              <p className="text-slate-600 text-sm mt-2">
                {searchQuery ? "Tente outro termo de busca" : "Adicione números para começar a bloquear spam"}
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-purple-600/20 p-2 rounded-lg">
                        {getBlockTypeIcon(contact.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {contact.name && (
                          <div className="font-semibold text-white truncate">
                            {contact.name}
                          </div>
                        )}
                        <div className={`text-slate-400 ${contact.name ? 'text-sm' : 'font-semibold text-white'}`}>
                          {contact.number}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-lg">
                        {getBlockTypeLabel(contact.type)}
                      </span>
                      {mounted && (
                        <span>
                          Bloqueado em {formatDate(contact.blockedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeBlockedContact(contact.id)}
                    className="bg-slate-800 hover:bg-purple-600 p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Desbloquear"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600/20 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Proteção Inteligente Ativa</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Todos os números na lista de bloqueio serão automaticamente rejeitados. 
                Você não receberá chamadas nem mensagens desses contatos. Sua privacidade está protegida.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
