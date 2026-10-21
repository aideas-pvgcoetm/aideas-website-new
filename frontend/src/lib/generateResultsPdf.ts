export interface SelectedTeam {
  srNo: number;
  teamName: string;
  teamLeader: string;
}

function escapePdfText(str: string): string {
  return String(str)
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

/**
 * Generates a clean, vector-based, text-searchable standard PDF (PDF-1.4)
 * containing the official Round 1 selected-team results across two pages.
 * Page 1: College Header, NEUROVERSE Title, Summary Chips, and Teams 1–15.
 * Page 2: Continuation Header, Teams 16–30, Grand Finale motivation banner, and Footer.
 */
export function generateResultsPdf(
  teamsPart1: SelectedTeam[],
  teamsPart2: SelectedTeam[]
): Uint8Array {
  const enc = new TextEncoder();
  const pageWidth = 595.28; // Standard A4 width in pt
  const pageHeight = 841.89; // Standard A4 height in pt
  const marginL = 42;
  const contentW = 511.28;

  function renderHeader(isFirstPage: boolean): string {
    let s = '';
    // Navy top banner bar
    s += `0.027 0.102 0.208 rg 0 765 ${pageWidth} 76.89 re f\n`;
    // Cyan bottom border rule
    s += `0.22 0.82 1.0 RG 2 w 0 765 m ${pageWidth} 765 l S\n`;

    if (isFirstPage) {
      s += `BT /F2 9.5 Tf 1 1 1 rg ${marginL} 812 Td (PUNE VIDYARTHI GRIHA'S COLLEGE OF ENGINEERING, TECHNOLOGY & MANAGEMENT) Tj ET\n`;
      s += `BT /F1 8 Tf 0.45 0.72 1.0 rg ${marginL} 798 Td (ARTIFICIAL INTELLIGENCE & DATA SCIENCE ENGINEERING ASSOCIATION OF STUDENTS (aIDEAS)) Tj ET\n`;
      s += `BT /F2 8 Tf 1.0 0.83 0.28 rg 450 805 Td (NAAC 'A' ACCREDITED) Tj ET\n`;
      s += `BT /F3 7.5 Tf 0.7 0.85 1.0 rg 450 793 Td (Ideas Today. Impact Tomorrow.) Tj ET\n`;
    } else {
      s += `BT /F2 11 Tf 1 1 1 rg ${marginL} 808 Td (NEUROVERSE IDEATHON 2026 - ROUND 1 RESULTS) Tj ET\n`;
      s += `BT /F1 8.5 Tf 0.45 0.72 1.0 rg ${marginL} 793 Td (Pune Vidyarthi Griha's COET&M • aIDEAS Student Association) Tj ET\n`;
      s += `BT /F3 8 Tf 1.0 0.83 0.28 rg 430 800 Td (Official Shortlist Continuation) Tj ET\n`;
    }
    return s;
  }

  function renderFooter(pageNum: number): string {
    let s = '';
    // Divider rule
    s += `0.80 0.85 0.92 RG 0.75 w ${marginL} 50 m ${marginL + contentW} 50 l S\n`;
    s += `BT /F1 8 Tf 0.40 0.48 0.58 rg ${marginL} 38 Td (NEUROVERSE Ideathon 2026 • Official Round 1 Shortlisting • aIDEAS Association) Tj ET\n`;
    s += `BT /F2 8.5 Tf 0.20 0.30 0.45 rg ${marginL + contentW - 55} 38 Td (Page ${pageNum} of 2) Tj ET\n`;
    return s;
  }

  function renderTableRows(teams: SelectedTeam[], startY: number): string {
    let s = '';
    const colX = { sr: marginL, team: marginL + 65, leader: marginL + 295 };
    const tableW = contentW;
    const headerH = 22;
    const rowH = 21;

    // Table Header bar
    s += `0.043 0.239 0.510 rg ${marginL} ${startY - headerH} ${tableW} ${headerH} re f\n`;
    s += `BT /F2 9 Tf 1 1 1 rg ${colX.sr + 12} ${startY - 15} Td (Sr. No.) Tj ET\n`;
    s += `BT /F2 9 Tf 1 1 1 rg ${colX.team + 5} ${startY - 15} Td (Team Name) Tj ET\n`;
    s += `BT /F2 9 Tf 1 1 1 rg ${colX.leader + 5} ${startY - 15} Td (Team Leader) Tj ET\n`;

    let y = startY - headerH - rowH;
    teams.forEach((t, i) => {
      // Alternating row background
      if (i % 2 === 0) {
        s += `0.965 0.982 1.0 rg ${marginL} ${y} ${tableW} ${rowH} re f\n`;
      } else {
        s += `1 1 1 rg ${marginL} ${y} ${tableW} ${rowH} re f\n`;
      }
      // Row border
      s += `0.88 0.92 0.97 RG 0.5 w ${marginL} ${y} ${tableW} ${rowH} re S\n`;

      // Compact Sr. No. badge
      s += `0.0 0.50 0.85 rg ${colX.sr + 10} ${y + 3.5} 22 14 re f\n`;
      const srOffset = t.srNo >= 10 ? 14 : 18;
      s += `BT /F2 8.5 Tf 1 1 1 rg ${colX.sr + srOffset} ${y + 6.5} Td (${t.srNo}) Tj ET\n`;

      // Team Name
      s += `BT /F2 9.5 Tf 0.06 0.10 0.20 rg ${colX.team + 5} ${y + 7} Td (${escapePdfText(t.teamName)}) Tj ET\n`;

      // Team Leader
      s += `BT /F1 9.5 Tf 0.20 0.26 0.38 rg ${colX.leader + 5} ${y + 7} Td (${escapePdfText(t.teamLeader)}) Tj ET\n`;

      y -= rowH;
    });

    return s;
  }

  // --- PAGE 1 STREAM ---
  let p1 = renderHeader(true);

  // Title section
  p1 += `BT /F2 11 Tf 0.0 0.60 0.92 rg ${marginL} 738 Td (NEUROVERSE IDEATHON 2026) Tj ET\n`;
  p1 += `BT /F2 20 Tf 0.03 0.10 0.22 rg ${marginL} 714 Td (ROUND 1 RESULTS) Tj ET\n`;
  p1 += `BT /F3 9.5 Tf 0.35 0.42 0.52 rg ${marginL} 700 Td (Ideas Today. Impact Tomorrow.) Tj ET\n`;

  // Announcement Box
  p1 += `0.94 0.97 1.0 rg 0.70 0.82 0.98 RG 0.75 w ${marginL} 648 ${contentW} 40 re B\n`;
  p1 += `0.0 0.60 0.92 rg ${marginL} 648 4 40 re f\n`;
  p1 += `BT /F2 10 Tf 0.04 0.12 0.25 rg ${marginL + 14} 672 Td (Congratulations to the 30 teams selected for the next round!) Tj ET\n`;
  p1 += `BT /F1 8.5 Tf 0.30 0.38 0.50 rg ${marginL + 14} 658 Td (Grand Finale on 24th October 2026 at PVG's COET&M campus, Pune.) Tj ET\n`;

  // 4 Summary Metric Cards (y: 592 to 636, h=44)
  const cardW = (contentW - 30) / 4;
  const metrics = [
    { num: '30', label: 'Teams Selected', col: '0.0 0.55 0.85' },
    { num: 'Round 1', label: 'PPT Shortlisting', col: '0.05 0.12 0.25' },
    { num: '24 Oct', label: 'Grand Finale', col: '0.50 0.22 0.80' },
    { num: 'Rs. 15,000', label: 'Prize Pool', col: '0.85 0.55 0.0' },
  ];
  metrics.forEach((m, idx) => {
    const cx = marginL + idx * (cardW + 10);
    p1 += `0.96 0.98 1.0 rg 0.82 0.88 0.96 RG 0.5 w ${cx} 592 ${cardW} 44 re B\n`;
    p1 += `BT /F2 13 Tf ${m.col} rg ${cx + 10} 618 Td (${escapePdfText(m.num)}) Tj ET\n`;
    p1 += `BT /F1 7.5 Tf 0.40 0.48 0.58 rg ${cx + 10} 602 Td (${escapePdfText(m.label)}) Tj ET\n`;
  });

  // Section 1 Header
  p1 += `BT /F2 11 Tf 0.04 0.12 0.28 rg ${marginL} 566 Td (Selected Teams 1 - 15) Tj ET\n`;

  // Table 1
  p1 += renderTableRows(teamsPart1, 554);
  p1 += renderFooter(1);

  // --- PAGE 2 STREAM ---
  let p2 = renderHeader(false);

  // Section 2 Header
  p2 += `BT /F2 11 Tf 0.04 0.12 0.28 rg ${marginL} 738 Td (Selected Teams 16 - 30) Tj ET\n`;

  // Table 2
  p2 += renderTableRows(teamsPart2, 726);

  // Motivation / Grand Finale Card (y: 210 to 335, h=125)
  p2 += `0.027 0.102 0.208 rg 0.20 0.45 0.80 RG 1 w ${marginL} 210 ${contentW} 125 re B\n`;
  // Gold badge
  p2 += `1.0 0.82 0.20 rg ${marginL + 18} 307 85 18 re f\n`;
  p2 += `BT /F2 8.5 Tf 0.03 0.10 0.22 rg ${marginL + 26} 312 Td (ALL THE BEST !!) Tj ET\n`;
  // Heading
  p2 += `BT /F2 16 Tf 1 1 1 rg ${marginL + 18} 283 Td (SEE YOU ON 24 OCT !!) Tj ET\n`;
  // Description
  p2 += `BT /F1 9 Tf 0.80 0.88 0.98 rg ${marginL + 18} 263 Td (The 30 selected teams will present and pitch their solutions live during the 6-hour NEUROVERSE Ideathon) Tj ET\n`;
  p2 += `BT /F1 9 Tf 0.80 0.88 0.98 rg ${marginL + 18} 249 Td (on 24th October 2026 at PVG's COET&M campus, Pune.) Tj ET\n`;
  // Footer within card
  p2 += `0.15 0.30 0.55 RG 0.5 w ${marginL + 18} 239 m ${marginL + contentW - 18} 239 l S\n`;
  p2 += `BT /F2 8.5 Tf 0.40 0.85 1.0 rg ${marginL + 18} 225 Td (Venue: PVG's COET&M, Pune  •  Date: 24 Oct 2026  •  Prize Pool: Up to Rs. 15,000) Tj ET\n`;
  p2 += `BT /F1 8 Tf 0.65 0.75 0.90 rg ${marginL + contentW - 195} 225 Td (Instagram: @AIDEAS_PVG) Tj ET\n`;

  p2 += renderFooter(2);

  // --- PDF OBJECT GRAPH ---
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>\nendobj\n';
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 5 0 R /Resources << /Font << /F1 7 0 R /F2 8 0 R /F3 9 0 R >> >> >>\nendobj\n`;
  const obj4 = `4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 6 0 R /Resources << /Font << /F1 7 0 R /F2 8 0 R /F3 9 0 R >> >> >>\nendobj\n`;

  const stream1Bytes = enc.encode(p1);
  const stream2Bytes = enc.encode(p2);
  const obj5Header = `5 0 obj\n<< /Length ${stream1Bytes.length} >>\nstream\n`;
  const obj5Footer = '\nendstream\nendobj\n';
  const obj6Header = `6 0 obj\n<< /Length ${stream2Bytes.length} >>\nstream\n`;
  const obj6Footer = '\nendstream\nendobj\n';
  const obj7 = '7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj8 = '8 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  const obj9 = '9 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n';

  const parts = [
    enc.encode('%PDF-1.4\n'),
    enc.encode(obj1),
    enc.encode(obj2),
    enc.encode(obj3),
    enc.encode(obj4),
    enc.encode(obj5Header),
    stream1Bytes,
    enc.encode(obj5Footer),
    enc.encode(obj6Header),
    stream2Bytes,
    enc.encode(obj6Footer),
    enc.encode(obj7),
    enc.encode(obj8),
    enc.encode(obj9),
  ];

  const objOffsets = [0];
  let cur = enc.encode('%PDF-1.4\n').length;
  objOffsets.push(cur); cur += enc.encode(obj1).length;
  objOffsets.push(cur); cur += enc.encode(obj2).length;
  objOffsets.push(cur); cur += enc.encode(obj3).length;
  objOffsets.push(cur); cur += enc.encode(obj4).length;
  objOffsets.push(cur); cur += enc.encode(obj5Header).length + stream1Bytes.length + enc.encode(obj5Footer).length;
  objOffsets.push(cur); cur += enc.encode(obj6Header).length + stream2Bytes.length + enc.encode(obj6Footer).length;
  objOffsets.push(cur); cur += enc.encode(obj7).length;
  objOffsets.push(cur); cur += enc.encode(obj8).length;
  objOffsets.push(cur); cur += enc.encode(obj9).length;

  const xrefStart = cur;
  let xrefStr = 'xref\n0 10\n0000000000 65535 f \n';
  for (let i = 1; i <= 9; i++) {
    xrefStr += String(objOffsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  xrefStr += `trailer\n<< /Size 10 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  parts.push(enc.encode(xrefStr));

  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const out = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

/**
 * Initiates direct browser file download of the generated PDF.
 * Compatible with all desktop and mobile browsers.
 */
export function downloadResultsPdf(
  teamsPart1: SelectedTeam[],
  teamsPart2: SelectedTeam[],
  filename = 'NeuroVerse_Round1_Results.pdf'
): void {
  if (typeof window === 'undefined') return;

  const bytes = generateResultsPdf(teamsPart1, teamsPart2);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
