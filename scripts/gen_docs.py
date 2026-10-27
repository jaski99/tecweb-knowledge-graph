#!/usr/bin/env python3
"""Genera docs/PIANO_STUDIO.md e docs/CHECKLIST_RIPASSO.md da graph/graph.json.
Uso: python scripts/gen_docs.py [check]
Corso: Tecnologie Web UNIMORE"""
import sys
from kg import ROOT, load_graph, topo_order

DOCS = ROOT / "docs"
SESSIONE_MIN = 120
TOLLERANZA = 1.15  # una sessione può sforare di ~15%
ORIGINE = "<!-- generato da scripts/gen_docs.py: non modificare a mano -->\n"


def fmt(m):
    h, r = divmod(m, 60)
    return f"{h} h {r:02d} min" if h else f"{r} min"


def sessioni(order, by_id, limite=SESSIONE_MIN):
    """Raggruppa l'ordine topologico in sessioni consecutive di al massimo ~limite minuti."""
    out, cur, tot = [], [], 0
    for i in order:
        t = by_id[i]["tempo_studio_min"]
        if cur and tot + t > limite * TOLLERANZA:
            out.append(cur); cur, tot = [], 0
        cur.append(i); tot += t
    if cur:
        out.append(cur)
    return out


def piano(g):
    by_id = {n["id"]: n for n in g["nodi"]}
    order = topo_order(g["nodi"])
    aree = {a["id"]: a["titolo"] for a in g["aree"]}
    
    L = [ORIGINE, "# Piano di studio — Tecnologie Web UNIMORE\n",
         "Ordine topologico dei nodi (ogni prerequisito prima del nodo che lo usa); a parità di vincoli prima la priorità **ALTA**, poi area e id. "
         f"Sessioni di studio da circa {SESSIONE_MIN // 60} ore (un nodo non viene mai spezzato).\n\n",
         "## Legenda\n",
         "- **Gruppo A**: temi esplicitamente elencati nel [programma ufficiale (F1)](SYLLABUS.md) o indispensabili per lo scritto o per la tesina.\n",
         "- **Gruppo B**: approfondimenti o contesto utile.\n",
         "- **Gruppo C**: argomenti non elencati nel programma 2026/27 o opzionali.\n",
         "I gruppi indicano priorità di studio, non frequenze o percentuali accertate delle domande d'esame.\n\n",
         "## Tempo totale per area\n",
         "| area | titolo | nodi | A | B | C | tempo |",
         "|---|---|---|---|---|---|---|"]
    
    for a, t in sorted(aree.items()):
        ns = [n for n in g["nodi"] if n["area"] == a]
        count_a = sum(1 for n in ns if n["gruppo"] == "A")
        count_b = sum(1 for n in ns if n["gruppo"] == "B")
        count_c = sum(1 for n in ns if n["gruppo"] == "C")
        L.append(f"| {a} | {t} | {len(ns)} | {count_a} | {count_b} | {count_c} | {fmt(sum(n['tempo_studio_min'] for n in ns))} |")
    
    total_a = sum(1 for n in g["nodi"] if n["gruppo"] == "A")
    total_b = sum(1 for n in g["nodi"] if n["gruppo"] == "B")
    total_c = sum(1 for n in g["nodi"] if n["gruppo"] == "C")
    L.append(f"| **Totale** | | {len(by_id)} | **{total_a}** | **{total_b}** | **{total_c}** | **{fmt(sum(n['tempo_studio_min'] for n in g['nodi']))}** |\n")
    
    k = 0
    for s, ids in enumerate(sessioni(order, by_id), 1):
        L.append(f"## Sessione {s} ({fmt(sum(by_id[i]['tempo_studio_min'] for i in ids))})\n")
        for i in ids:
            k += 1; n = by_id[i]
            pre = ", ".join(p["id"] for p in n["prerequisiti"]) or "—"
            gruppo = n["gruppo"]
            L.append(f"{k}. [ ] **{n['title']}** (`{i}`) — area {n['area']}, gruppo {gruppo}, {n['tipo']}, priorità {n['priorita']['livello'].upper()}, {n['tempo_studio_min']} min. Prerequisiti: {pre}")
        L.append("")
    return "\n".join(L).rstrip() + "\n"


def checklist(g):
    by_id = {n["id"]: n for n in g["nodi"]}
    aree = {a["id"]: a["titolo"] for a in g["aree"]}
    order = topo_order(g["nodi"])
    
    L = [ORIGINE, "# Checklist di ripasso — Tecnologie Web UNIMORE\n", 
         "## Flashcard per ripasso SM-2\n",
         "> Usa queste flashcard per il ripasso a intervalli (1-3-7-14 giorni).\n\n"]
    
    # Aggiungi flashcard dalle lezioni
    for i in order:
        n = by_id[i]
        if "lezione" in n and "flashcard" in n["lezione"]:
            fc = n["lezione"]["flashcard"]
            L.append(f"### {n['title']}\n")
            L.append(f"**Fronte**: {fc['fronte']}\n")
            L.append(f"**Retro**: {fc['retro']}\n")
            L.append("")
    
    L.append("## Checklist per area\n")
    
    for a, titolo in sorted(aree.items()):
        ids = [i for i in order if by_id[i]["area"] == a and by_id[i].get("checklist_ripasso")]
        if not ids:
            # Usa checklist dalle lezioni
            ids = [i for i in order if by_id[i]["area"] == a and "lezione" in by_id[i] and "checklist" in by_id[i]["lezione"]]
        
        if not ids:
            continue
        L.append(f"\n## Area {a}. {titolo}\n")
        for i in ids:
            n = by_id[i]
            L.append(f"### {n['title']} (priorità {n['priorita']['livello'].upper()}, gruppo {n['gruppo']})\n")
            
            if "checklist_ripasso" in n:
                L += [f"- [ ] {x}" for x in n["checklist_ripasso"]]
            elif "lezione" in n and "checklist" in n["lezione"]:
                cl = n["lezione"]["checklist"]
                if cl.get("so_fare"):
                    L.append("**So fare:**")
                    L += [f"- [ ] {x}" for x in cl["so_fare"]]
                if cl.get("so_dire"):
                    L.append("**So dire:**")
                    L += [f"- [ ] {x}" for x in cl["so_dire"]]
            L.append("")
    
    # Aggiungi trappole dalle lezioni
    L.append("\n## Trappole d'esame\n")
    for i in order:
        n = by_id[i]
        if "lezione" in n and "errori_trappole" in n["lezione"]:
            for err in n["lezione"]["errori_trappole"]:
                L.append(f"- [ ] **{n['title']}**: {err['errore']} → {err['perche_sbagliato']}")
    
    return "\n".join(L).rstrip() + "\n"


def outputs(g=None):
    g = g or load_graph()
    return {DOCS / "PIANO_STUDIO.md": piano(g), DOCS / "CHECKLIST_RIPASSO.md": checklist(g)}


def main():
    check = len(sys.argv) > 1 and sys.argv[1] == "check"
    stale = []
    for p, txt in outputs().items():
        if check:
            if not p.exists() or p.read_text(encoding="utf-8") != txt:
                stale.append(p.name)
        else:
            p.write_text(txt, encoding="utf-8"); print(f"scritto {p}")
    if stale:
        sys.exit("non aggiornati: " + ", ".join(stale) + " (esegui python scripts/gen_docs.py)")


if __name__ == "__main__":
    main()
