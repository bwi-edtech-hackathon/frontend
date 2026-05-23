import { useCallback, useEffect, useState } from "react";
import { palette as pal } from "@/lib/palette";
import { FloatingPanel } from "@/components/exam/FloatingPanel";

type Op = "+" | "-" | "*" | "/" | null;

// Simple 4-function calculator: enough for the spec's "Calculator" tool.
export function Calculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [resetNext, setResetNext] = useState(false);

  const inputDigit = useCallback(
    (d: string) => {
      setDisplay((prev) => {
        if (resetNext) {
          setResetNext(false);
          return d === "." ? "0." : d;
        }
        if (d === "." && prev.includes(".")) return prev;
        if (prev === "0" && d !== ".") return d;
        return prev + d;
      });
    },
    [resetNext],
  );

  const apply = useCallback(
    (a: number, b: number, o: Op): number => {
      if (o === "+") return a + b;
      if (o === "-") return a - b;
      if (o === "*") return a * b;
      if (o === "/") return b === 0 ? NaN : a / b;
      return b;
    },
    [],
  );

  const inputOp = useCallback(
    (next: Op) => {
      const cur = parseFloat(display);
      if (acc === null) {
        setAcc(cur);
      } else if (op && !resetNext) {
        const r = apply(acc, cur, op);
        setAcc(r);
        setDisplay(String(r));
      }
      setOp(next);
      setResetNext(true);
    },
    [acc, apply, display, op, resetNext],
  );

  const equals = useCallback(() => {
    if (op === null || acc === null) return;
    const cur = parseFloat(display);
    const r = apply(acc, cur, op);
    setDisplay(String(r));
    setAcc(null);
    setOp(null);
    setResetNext(true);
  }, [acc, apply, display, op]);

  const clear = useCallback(() => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setResetNext(false);
  }, []);

  const backspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-"))) return "0";
      return prev.slice(0, -1);
    });
  }, []);

  const negate = useCallback(() => {
    setDisplay((prev) =>
      prev === "0" ? prev : prev.startsWith("-") ? prev.slice(1) : `-${prev}`,
    );
  }, []);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) inputDigit(k);
      else if (k === ".") inputDigit(".");
      else if (k === "+" || k === "-" || k === "*" || k === "/") inputOp(k as Op);
      else if (k === "Enter" || k === "=") {
        e.preventDefault();
        equals();
      } else if (k === "Backspace") backspace();
      else if (k === "Escape" || k.toLowerCase() === "c") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputDigit, inputOp, equals, backspace, clear]);

  const Key = ({
    label,
    onPress,
    tone = "muted",
    span = 1,
  }: {
    label: string;
    onPress: () => void;
    tone?: "muted" | "primary" | "accent";
    span?: number;
  }) => {
    const bg =
      tone === "primary"
        ? pal.primary
        : tone === "accent"
          ? pal.accent
          : pal.surfaceAlt;
    const fg =
      tone === "primary"
        ? pal.primaryInk
        : tone === "accent"
          ? pal.accentInk
          : pal.text;
    return (
      <button
        type="button"
        onClick={onPress}
        style={{
          gridColumn: `span ${span}`,
          height: 44,
          border: `1px solid ${pal.line}`,
          borderRadius: 10,
          background: bg,
          color: fg,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: '"JetBrains Mono", monospace',
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <FloatingPanel title="Calculator" onClose={onClose} width={280}>
      <div
        style={{
          padding: "10px 12px",
          background: pal.text,
          color: pal.surface,
          borderRadius: 10,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 26,
          textAlign: "right",
          marginBottom: 10,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          minHeight: 50,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {display}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 6,
        }}
      >
        <Key label="AC" onPress={clear} tone="accent" />
        <Key label="±" onPress={negate} />
        <Key label="←" onPress={backspace} />
        <Key label="÷" onPress={() => inputOp("/")} tone="primary" />

        <Key label="7" onPress={() => inputDigit("7")} />
        <Key label="8" onPress={() => inputDigit("8")} />
        <Key label="9" onPress={() => inputDigit("9")} />
        <Key label="×" onPress={() => inputOp("*")} tone="primary" />

        <Key label="4" onPress={() => inputDigit("4")} />
        <Key label="5" onPress={() => inputDigit("5")} />
        <Key label="6" onPress={() => inputDigit("6")} />
        <Key label="−" onPress={() => inputOp("-")} tone="primary" />

        <Key label="1" onPress={() => inputDigit("1")} />
        <Key label="2" onPress={() => inputDigit("2")} />
        <Key label="3" onPress={() => inputDigit("3")} />
        <Key label="+" onPress={() => inputOp("+")} tone="primary" />

        <Key label="0" onPress={() => inputDigit("0")} span={2} />
        <Key label="." onPress={() => inputDigit(".")} />
        <Key label="=" onPress={equals} tone="accent" />
      </div>
    </FloatingPanel>
  );
}
