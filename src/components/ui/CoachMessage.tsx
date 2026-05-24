import { Fragment, type ReactNode } from "react";
import { palette as defaultPal, type Palette } from "@/lib/palette";
import { MathPill } from "@/components/ui/Primitives";

/**
 * Render a Gemini-authored coach reply as React nodes with light formatting:
 *   $...$            inline math (italic, monospace-serif span)
 *   $$...$$          block math (MathPill block)
 *   **bold**         strong
 *   *italic*         em
 *   `code`           inline code
 *   blank line       paragraph break
 *
 * Raw LaTeX is normalised to common Unicode glyphs so the output stays readable
 * without pulling in a math renderer (KaTeX/MathJax).
 */
export function CoachMessage({
  text,
  pal = defaultPal,
}: {
  text: string;
  pal?: Palette;
}) {
  const cleaned = normaliseCoachText(text);
  const paragraphs = cleaned.split(/\n{2,}/);
  return (
    <Fragment>
      {paragraphs.map((para, i) => {
        const nodes = renderInline(para, pal);
        const blockMatches = para.match(/^\$\$([\s\S]+?)\$\$$/);
        if (blockMatches) {
          return (
            <MathPill key={i} pal={pal} block>
              {prettifyMath(blockMatches[1].trim())}
            </MathPill>
          );
        }
        return (
          <p
            key={i}
            style={{
              margin: i === 0 ? "0 0 8px 0" : "8px 0",
              lineHeight: 1.55,
              whiteSpace: "pre-wrap",
            }}
          >
            {nodes}
          </p>
        );
      })}
    </Fragment>
  );
}

function renderInline(src: string, pal: Palette): ReactNode[] {
  const out: ReactNode[] = [];
  // Token boundaries: $$...$$ | $...$ | **...** | *...* (single) | `...`
  const re =
    /(\$\$[\s\S]+?\$\$)|(\$[^$\n]+?\$)|(\*\*[^*\n]+?\*\*)|(\*[^*\n]+?\*)|(`[^`\n]+?`)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("$$") && tok.endsWith("$$")) {
      out.push(
        <MathPill key={`mp-${key++}`} pal={pal} block>
          {prettifyMath(tok.slice(2, -2).trim())}
        </MathPill>,
      );
    } else if (tok.startsWith("$") && tok.endsWith("$")) {
      out.push(
        <InlineMath key={`im-${key++}`} pal={pal}>
          {prettifyMath(tok.slice(1, -1).trim())}
        </InlineMath>,
      );
    } else if (tok.startsWith("**") && tok.endsWith("**")) {
      out.push(<strong key={`b-${key++}`}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*") && tok.endsWith("*")) {
      out.push(<em key={`i-${key++}`}>{tok.slice(1, -1)}</em>);
    } else if (tok.startsWith("`") && tok.endsWith("`")) {
      out.push(
        <code
          key={`c-${key++}`}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.92em",
            background: pal.surfaceAlt,
            border: `1px solid ${pal.line}`,
            borderRadius: 4,
            padding: "0 4px",
          }}
        >
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

function InlineMath({
  children,
  pal,
}: {
  children: ReactNode;
  pal: Palette;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px 6px",
        margin: "0 2px",
        borderRadius: 6,
        background: pal.surfaceAlt,
        border: `1px solid ${pal.line}`,
        fontFamily: '"Newsreader", "Times New Roman", serif',
        fontStyle: "italic",
        fontSize: "0.96em",
        color: pal.text,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// ─────────────────── normalisation ───────────────────

/** Collapse stray whitespace and unify newline conventions. */
function normaliseCoachText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Replace common LaTeX-only macros with Unicode so a plain serif span is
 * readable without a real math typesetter. Conservative — only touches things
 * that have a clean 1:1 Unicode equivalent. */
function prettifyMath(src: string): string {
  let s = src;
  // Common operators
  s = s.replace(/\\cdot\b/g, "·");
  s = s.replace(/\\times\b/g, "×");
  s = s.replace(/\\div\b/g, "÷");
  s = s.replace(/\\pm\b/g, "±");
  s = s.replace(/\\mp\b/g, "∓");
  s = s.replace(/\\leq?\b/g, "≤");
  s = s.replace(/\\geq?\b/g, "≥");
  s = s.replace(/\\neq?\b/g, "≠");
  s = s.replace(/\\approx\b/g, "≈");
  s = s.replace(/\\infty\b/g, "∞");
  s = s.replace(/\\sum\b/g, "∑");
  s = s.replace(/\\prod\b/g, "∏");
  s = s.replace(/\\int\b/g, "∫");
  s = s.replace(/\\to\b/g, "→");
  s = s.replace(/\\Rightarrow\b/g, "⇒");
  s = s.replace(/\\leftarrow\b/g, "←");
  // Greek
  const greek: Record<string, string> = {
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε",
    zeta: "ζ", eta: "η", theta: "θ", iota: "ι", kappa: "κ",
    lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", omicron: "ο",
    pi: "π", rho: "ρ", sigma: "σ", tau: "τ", upsilon: "υ",
    phi: "φ", chi: "χ", psi: "ψ", omega: "ω",
    Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ",
    Pi: "Π", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
  };
  s = s.replace(/\\([A-Za-z]+)/g, (full, name) => {
    if (name === "sqrt") return "√";
    if (name === "frac") return "";
    return greek[name] ?? full;
  });
  // \sqrt{...} → √…
  s = s.replace(/√\{([^{}]+)\}/g, "√($1)");
  // \frac{a}{b} → (a)/(b)
  s = s.replace(/\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");
  // Common exponents
  s = s.replace(/\^2\b/g, "²");
  s = s.replace(/\^3\b/g, "³");
  s = s.replace(/\^\{2\}/g, "²");
  s = s.replace(/\^\{3\}/g, "³");
  // Drop remaining single-char {x} braces around subscript/superscript
  s = s.replace(/_\{([^{}]+)\}/g, "_$1");
  s = s.replace(/\^\{([^{}]+)\}/g, "^$1");
  return s;
}
