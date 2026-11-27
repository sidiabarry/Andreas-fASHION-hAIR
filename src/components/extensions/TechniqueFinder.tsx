"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import type { MethodId } from "@/lib/collection";
import { rankMethods, type FinderAnswer } from "@/lib/finder";

import { MethodDiagram } from "./MethodDiagram";

export type FinderMethod = { id: MethodId; name: string; tagline: string; best: string; image: string | null; packsHref: string | null; onRequest: boolean };

type Labels = {
  step: string;
  back: string;
  restart: string;
  questions: { legend: string; options: { value: string; label: string }[] }[];
  resultTitle: string;
  resultLead: string;
  best: string;
  also: string;
  toTechnique: string;
  toPacks: string;
  confirm: string;
  selfNote: string;
  bestLabel: string;
  onRequest: string;
};

const KEYS = ["who", "hair", "goal"] as const;

/** Drei Fragen, eine ehrliche Empfehlung. Ergebnis verlinkt auf die Technik, die Packungen und die persönliche Bestätigung. */
export function TechniqueFinder({ labels, methods, inShop, confirmHref, confirmExternal }: { labels: Labels; methods: FinderMethod[]; inShop: MethodId[]; confirmHref: string; confirmExternal: boolean }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<Partial<FinderAnswer>>({});
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const done = step >= KEYS.length;
  const ranked = done ? rankMethods(answer as FinderAnswer, new Set(inShop)) : [];
  const byId = new Map(methods.map((m) => [m.id, m]));

  const focusBox = () => requestAnimationFrame(() => box.current?.querySelector<HTMLElement>("input:checked, input, h3")?.focus());

  return (
    <div className="xf" ref={box}>
      {done ? (
        <div aria-live="polite" className="xf__result">
          <div className="xf__head">
            <h3 className="xf__title" tabIndex={-1}>
              {labels.resultTitle}
            </h3>
            <p className="xf__lead">{labels.resultLead}</p>
          </div>
          <ol className="xf__picks">
            {ranked.map((methodId, i) => {
              const m = byId.get(methodId);
              if (!m) return null;
              return (
                <li className="xf__pick" data-first={i === 0 || undefined} key={methodId}>
                  <div className="xf__img" data-diagram={m.image ? undefined : ""}>
                    {m.image ? <Image alt="" height={400} sizes="(max-width: 760px) 40vw, 220px" src={m.image} width={300} /> : <MethodDiagram id={m.id} title="" />}
                    {m.onRequest ? <span className="xf__symbol">{labels.onRequest}</span> : null}
                  </div>
                  <div className="xf__body">
                    <p className="xf__badge">{i === 0 ? labels.best : labels.also}</p>
                    <h4 className="xf__name">{m.name}</h4>
                    <p className="xf__tag">{m.tagline}</p>
                    <p className="xf__best">
                      <span>{labels.bestLabel}</span> {m.best}
                    </p>
                    <div className="xf__ctas">
                      <a className="af-cta-line" href={`#technik-${m.id}`}>
                        {labels.toTechnique}
                      </a>
                      {m.packsHref ? (
                        <a className="af-cta-line" href={m.packsHref}>
                          {labels.toPacks}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {answer.who === "self" ? <p className="xf__note">{labels.selfNote}</p> : null}
          <div className="xf__foot">
            <a className="af-cta-gold af-glass af-glass--gold" href={confirmHref} {...(confirmExternal ? { rel: "noopener noreferrer", target: "_blank" } : {})}>
              {labels.confirm}
            </a>
            <button
              className="xf__ghost"
              onClick={() => {
                setAnswer({});
                setStep(0);
                focusBox();
              }}
              type="button"
            >
              {labels.restart}
            </button>
          </div>
        </div>
      ) : (
        <fieldset className="xf__q" key={step}>
          <legend className="xf__legend">
            <span className="xf__step">
              <span>{labels.step.replace("{n}", String(step + 1))}</span>
              <i aria-hidden="true">
                {KEYS.map((key, i) => (
                  <b data-on={i <= step || undefined} key={key} />
                ))}
              </i>
            </span>
            <span className="xf__title">{labels.questions[step].legend}</span>
          </legend>
          <div className="xf__opts">
            {labels.questions[step].options.map((option) => {
              const key = KEYS[step];
              const checked = answer[key] === option.value;
              return (
                <label className="xf__opt" data-checked={checked || undefined} key={option.value}>
                  <input
                    checked={checked}
                    name={`${id}-${key}`}
                    onChange={() => {
                      setAnswer((prev) => ({ ...prev, [key]: option.value }));
                      // Wer selbst einsetzt, braucht die Haarfrage nicht für die Empfehlung – trotzdem alle Fragen stellen (ruhiger Ablauf)
                      window.setTimeout(() => {
                        setStep((s) => s + 1);
                        focusBox();
                      }, 220);
                    }}
                    type="radio"
                    value={option.value}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
          {step > 0 ? (
            <button
              className="xf__ghost"
              onClick={() => {
                setStep((s) => Math.max(0, s - 1));
                focusBox();
              }}
              type="button"
            >
              {labels.back}
            </button>
          ) : null}
        </fieldset>
      )}
    </div>
  );
}
