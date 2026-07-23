import React, { useState, useEffect } from "react";
import { X, MessageCircle, ArrowRight, ArrowLeft, Check, ShieldCheck, Clock, Gift } from "lucide-react";
import { useFormOverlay } from "../App.jsx";
import { WHATSAPP_NUMBER } from "../constants.js";

const PROCEDIMENTOS = [
  "Protocolo ESSENZA",
  "Harmonização facial",
  "Bioestimulador de colágeno",
  "Avaliação geral",
  "Ainda não sei",
];

const ORIGENS = ["Instagram", "Indicação", "Google", "TikTok", "Outro"];

const STEP_HEADER = {
  1: { title: "Vamos dar o primeiro passo ✨", sub: "É rápido e sem compromisso. Comece só com seu nome e WhatsApp." },
  2: { title: "O que você deseja transformar?", sub: "Assim a Dra. Emely já chega preparada pra te orientar." },
  3: { title: "Quase lá — só mais alguns detalhes", sub: "Quanto mais soubermos, mais personalizada será sua avaliação." },
};

export default function FormOverlay() {
  const { formOpen, closeForm } = useFormOverlay();
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    nome: "", telefone: "", cidade: "", idade: "", instagram: "",
    procedimento: "", objetivo: "", origem: "", mensagem: "",
  });

  useEffect(() => {
    if (formOpen) {
      setMounted(true);
      setStep(1);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setActive(true));
      });
    } else {
      setActive(false);
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [formOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeForm();
    };
    if (formOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [formOpen, closeForm]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const canAdvance1 = form.nome.trim().length > 1 && form.telefone.trim().length >= 8;

  const buildMessage = () => {
    const lines = ["Olá! Vim pelo site da clínica."];
    if (form.nome) lines.push(`Meu nome é ${form.nome}.`);
    if (form.idade) lines.push(`Tenho ${form.idade} anos.`);
    if (form.cidade) lines.push(`Moro em ${form.cidade}.`);
    if (form.telefone) lines.push(`Meu telefone: ${form.telefone}.`);
    if (form.instagram) lines.push(`Instagram: ${form.instagram}.`);
    if (form.procedimento) lines.push(`Interesse em: ${form.procedimento}.`);
    if (form.objetivo) lines.push(`Objetivo: ${form.objetivo}.`);
    if (form.origem) lines.push(`Conheci a clínica por: ${form.origem}.`);
    if (form.mensagem) lines.push(`${form.mensagem}`);
    lines.push("Gostaria de agendar uma avaliação. 🙏");
    return lines.join("\n\n");
  };

  const send = () => {
    const text = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    closeForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      if (step === 1 && !canAdvance1) return;
      setStep((s) => s + 1);
      return;
    }
    send();
  };

  if (!mounted) return null;

  const inputClass =
    "w-full px-4 py-3 text-[14px] bg-white/70 border border-[var(--line)] rounded-xl transition-all duration-200 focus:outline-none focus:border-[var(--gold-deep)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(185,141,99,0.1)] placeholder:text-[var(--ink-soft)]/40";
  const labelClass =
    "text-[11px] tracking-wider uppercase block mb-1.5 font-semibold";

  return (
    <div className="form-overlay" role="dialog" aria-modal="true" aria-label="Agendar avaliação">
      <div className={`form-backdrop ${active ? "active" : ""}`} onClick={closeForm} />

      <div className={`form-panel ${active ? "active" : ""}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 pt-5 pb-4 border-b border-[var(--line)] bg-[var(--cream)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Passo {step} de 3</p>
              <p className="font-display text-[1.35rem] leading-snug" style={{ color: "var(--ink)" }}>
                {STEP_HEADER[step].title}
              </p>
            </div>
            <button
              onClick={closeForm}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-[var(--cream-alt)] hover:scale-110 cursor-pointer"
              aria-label="Fechar"
            >
              <X size={18} style={{ color: "var(--ink)" }} />
            </button>
          </div>

          {/* Progresso */}
          <div className="form-progress mt-4" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
            <div className="form-progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-[13.5px] mb-5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            {STEP_HEADER[step].sub}
          </p>

          <form onSubmit={handleSubmit}>
            {/* ─── Passo 1 — Essencial ─── */}
            {step === 1 && (
              <div className="form-step space-y-4">
                <div>
                  <label className={labelClass} style={{ color: "var(--ink-soft)" }}>Como podemos te chamar? *</label>
                  <input autoFocus required value={form.nome} onChange={update("nome")} className={inputClass} placeholder="Seu nome" />
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--ink-soft)" }}>Seu WhatsApp *</label>
                  <input required value={form.telefone} onChange={update("telefone")} className={inputClass} placeholder="(00) 00000-0000" inputMode="tel" />
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--ink-soft)" }}>
                    É por aqui que a equipe vai retornar seu contato.
                  </p>
                </div>
              </div>
            )}

            {/* ─── Passo 2 — Interesse ─── */}
            {step === 2 && (
              <div className="form-step space-y-5">
                <div>
                  <label className={labelClass} style={{ color: "var(--ink-soft)" }}>O que mais te interessa?</label>
                  <div className="flex flex-wrap gap-2">
                    {PROCEDIMENTOS.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setField("procedimento", p)}
                        className={`chip ${form.procedimento === p ? "selected" : ""}`}
                      >
                        {form.procedimento === p && <Check size={14} />}
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--ink-soft)" }}>O que você gostaria de melhorar?</label>
                  <textarea value={form.objetivo} onChange={update("objetivo")} rows={3} className={inputClass} placeholder="Ex.: contorno do rosto, olhar mais descansado, prevenção..." />
                </div>
              </div>
            )}

            {/* ─── Passo 3 — Detalhes ─── */}
            {step === 3 && (
              <div className="form-step space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass} style={{ color: "var(--ink-soft)" }}>Cidade</label>
                    <input value={form.cidade} onChange={update("cidade")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: "var(--ink-soft)" }}>Idade</label>
                    <input value={form.idade} onChange={update("idade")} className={inputClass} inputMode="numeric" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--ink-soft)" }}>Instagram</label>
                  <input value={form.instagram} onChange={update("instagram")} className={inputClass} placeholder="@seuinstagram" />
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--ink-soft)" }}>Como nos encontrou?</label>
                  <div className="flex flex-wrap gap-2">
                    {ORIGENS.map((o) => (
                      <button
                        type="button"
                        key={o}
                        onClick={() => setField("origem", o)}
                        className={`chip ${form.origem === o ? "selected" : ""}`}
                      >
                        {form.origem === o && <Check size={14} />}
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex items-center gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="btn-secondary !px-4 !justify-center"
                  aria-label="Voltar"
                >
                  <ArrowLeft size={16} />
                </button>
              )}

              {step < 3 ? (
                <button
                  type="submit"
                  disabled={step === 1 && !canAdvance1}
                  className="btn-primary flex-1 !justify-center !rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-[var(--ink)]"
                >
                  Continuar <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit" className="btn-primary flex-1 !justify-center !rounded-xl">
                  Enviar pelo WhatsApp <MessageCircle size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Sinais de confiança */}
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mt-5 pt-5 border-t border-[var(--line)]">
            {[
              { icon: Gift, label: "Avaliação gratuita" },
              { icon: ShieldCheck, label: "Sem compromisso" },
              { icon: Clock, label: "Resposta rápida" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-[11.5px] font-medium" style={{ color: "var(--ink-soft)" }}>
                <Icon size={13} style={{ color: "var(--gold-deep)" }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
