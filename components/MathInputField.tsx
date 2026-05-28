"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface MathInputHandle {
  insert(latex: string): void;
  deleteBackward(): void;
  moveLeft(): void;
  moveRight(): void;
  clear(): void;
  getAscii(): string;
}

interface Props {
  onInput?: (ascii: string) => void;
  digito?: number;
}

const MathInputField = forwardRef<MathInputHandle, Props>(
  ({ onInput, digito }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mfRef = useRef<any>(null);
    const onInputRef = useRef(onInput);
    const digitoRef = useRef(digito);

    useEffect(() => {
      onInputRef.current = onInput;
    }, [onInput]);

    useEffect(() => {
      digitoRef.current = digito;
    }, [digito]);

    useEffect(() => {
      let active = true;

      import("mathlive").then(({ MathfieldElement }) => {
        if (!active || !containerRef.current || mfRef.current) return;

        // Aponta para as fontes copiadas em /public/mathlive-fonts
        MathfieldElement.fontsDirectory = "/mathlive-fonts";

        const mf = document.createElement("math-field") as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        Object.assign(mf.style, {
          display: "block",
          width: "100%",
          minHeight: "2rem",
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: "1.5rem",
          color: "inherit",
        });

        mf.addEventListener("input", () => {
          onInputRef.current?.(mf.getValue("ascii-math"));
        });

        mf.addEventListener("keydown", (e: KeyboardEvent) => {
          // Sempre deixa: modificadores, navegação, backspace/delete
          const SEMPRE_OK = new Set([
            "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
            "Tab", "Escape", "Backspace", "Delete",
            "Shift", "Control", "Alt", "Meta",
          ]);
          if (SEMPRE_OK.has(e.key)) return;

          // Enter é tratado pelo Game via window listener
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
          }

          // Permite operadores matemáticos
          const OPERADORES = new Set(["+", "-", "*", "/", "^", "!", "(", ")", "."]);
          if (OPERADORES.has(e.key)) return;

          // Permite apenas o dígito do desafio
          if (digitoRef.current !== undefined && e.key === String(digitoRef.current)) return;

          // Bloqueia tudo o mais (outros dígitos, letras, símbolos)
          e.preventDefault();
          e.stopImmediatePropagation();
        }, true);

        containerRef.current.appendChild(mf);

        mf.mathVirtualKeyboardPolicy = "manual";
        mf.menuItems = [];

        type MathVK = EventTarget & { visible: boolean; hide(): void };
        const vk = (window as Window & { mathVirtualKeyboard?: MathVK }).mathVirtualKeyboard;
        if (vk) {
          vk.visible = false;
          vk.addEventListener("before-virtual-keyboard-toggle", (e: Event) => {
            e.preventDefault();
          });
        }

        // Garante que o teclado virtual nunca apareça quando o campo recebe foco
        mf.addEventListener("focus", () => {
          const keyboard = (window as Window & { mathVirtualKeyboard?: MathVK }).mathVirtualKeyboard;
          keyboard?.hide();
        });

        mfRef.current = mf;
      });

      return () => {
        active = false;
        mfRef.current = null;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      insert(latex: string) {
        mfRef.current?.focus();
        mfRef.current?.insert(latex);
      },
      deleteBackward() {
        mfRef.current?.focus();
        mfRef.current?.executeCommand("deleteBackward");
      },
      moveLeft() {
        mfRef.current?.focus();
        mfRef.current?.executeCommand("moveToPreviousChar");
      },
      moveRight() {
        mfRef.current?.focus();
        mfRef.current?.executeCommand("moveToNextChar");
      },
      clear() {
        if (mfRef.current) {
          mfRef.current.value = "";
          onInputRef.current?.("");
        }
      },
      getAscii() {
        return mfRef.current?.getValue("ascii-math") ?? "";
      },
    }));

    return (
      <div
        ref={containerRef}
        className="w-full cursor-text"
        onClick={() => mfRef.current?.focus()}
      />
    );
  },
);

MathInputField.displayName = "MathInputField";
export default MathInputField;
