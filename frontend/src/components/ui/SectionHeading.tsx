"use client";

import * as React from "react";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import VectorWordmark from "./VectorWordmark";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  wordmarkText?: string;
  fontSize?: string | number;
  height?: string | number;
  reach?: number;
  title?: React.ReactNode;
  gradientText?: string | React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
}

export const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  (
    {
      eyebrow,
      wordmarkText,
      fontSize,
      height,
      reach,
      title,
      gradientText,
      description,
      align = "center",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isCenter = align === "center";
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, {
      margin: "160px 0px 160px 0px",
    });

    const [isLight, setIsLight] = React.useState(false);

    React.useEffect(() => {
      const checkTheme = () => {
        setIsLight(document.documentElement.getAttribute("data-theme") === "light");
      };
      checkTheme();
      const obs = new MutationObserver(checkTheme);
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      return () => obs.disconnect();
    }, []);

    const resolvedFontSize = fontSize
      ? typeof fontSize === "number"
        ? `${fontSize}px`
        : fontSize
      : wordmarkText && wordmarkText.length > 30
      ? "48px"
      : wordmarkText && wordmarkText.length > 20
      ? "56px"
      : "66px";

    const resolvedHeight =
      height || (wordmarkText && wordmarkText.length > 30 ? "82px" : "88px");

    return (
      <div
        ref={ref}
        className={cn(
          "section-heading-block max-w-[880px] mb-12 sm:mb-14",
          isCenter ? "text-center mx-auto" : "text-left",
          className
        )}
        {...props}
      >
        {eyebrow && (
          <div
            className={cn(
              "section-eyebrow inline-flex items-center gap-2.5 mb-3 sm:mb-3.5",
              isCenter ? "justify-center" : "justify-start"
            )}
          >
            <span className="section-eyebrow-line" aria-hidden="true" />
            <span className="section-eyebrow-text">{eyebrow}</span>
          </div>
        )}

        {children ? (
          children
        ) : wordmarkText ? (
          <div
            ref={containerRef}
            className="w-full relative overflow-hidden flex items-center justify-center my-1 select-none"
            style={{
              height: resolvedHeight,
              minHeight: 0,
            }}
          >
            <h2 className="sr-only">{wordmarkText}</h2>
            {isInView ? (
              <VectorWordmark
                text={wordmarkText}
                textColor={isLight ? "#11151C" : "#F2F4F7"}
                shade={isLight ? "#46505C" : "#B7C0CC"}
                accent={isLight ? "#00A2D8" : "#35CFFF"}
                background="transparent"
                reach={reach || 190}
                speed={35}
                damping={65}
                font={{
                  fontFamily: "'Orbitron', 'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: resolvedFontSize,
                  letterSpacing: "-0.015em",
                  textAlign: "center",
                }}
                handles={{
                  labels: false,
                  size: 55,
                  spread: 22,
                }}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-bold tracking-tight text-[#F2F4F7] opacity-0"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                {wordmarkText}
              </div>
            )}
          </div>
        ) : (
          <h2 className="section-heading-title">
            {title}
            {gradientText && (
              <>
                {" "}
                <span className="section-heading-gradient">{gradientText}</span>
              </>
            )}
          </h2>
        )}

        {description && (
          <p className="section-heading-description">{description}</p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = "SectionHeading";

export default SectionHeading;
