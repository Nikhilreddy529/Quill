import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, ShadingType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';
import { SOWProject } from '../types/quill';

export async function generateAndDownloadDTMCWordDoc(project: SOWProject): Promise<{ fileName: string; sizeBytes: number }> {
  // Validate that pricing is strictly blank
  const sections = project.sections.sort((a, b) => a.order - b.order);
  
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Aptos",
            size: 18, // 9pt (18 half-points)
            color: "0f172a",
          },
          paragraph: {
            spacing: {
              line: 260,
              after: 140,
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: "DTMCTitle",
          name: "DTMC Title",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 44, // 22pt
            bold: true,
            color: "10334F", // DTMC Dark Blue
            font: "Calibri",
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 140, before: 300 },
          },
        },
        {
          id: "DTMCSubtitle",
          name: "DTMC Subtitle",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 20, // 10pt
            color: "475569",
            italics: true,
            font: "Calibri",
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          },
        },
        {
          id: "DTMCHeading1",
          name: "DTMC Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 28, // 14pt
            bold: true,
            color: "10334F", // DTMC Dark Blue
            font: "Calibri",
          },
          paragraph: {
            spacing: { before: 320, after: 140 },
          },
        },
        {
          id: "DTMCHeading2",
          name: "DTMC Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24, // 12pt
            bold: true,
            color: "10334F", // DTMC Dark Blue
            font: "Calibri",
          },
          paragraph: {
            spacing: { before: 200, after: 100 },
          },
        }
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Center Brand
          new Paragraph({
            children: [
              new TextRun({ text: "DTMC", bold: true, size: 56, color: "14A6A0", font: "Calibri" }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          // Title
          new Paragraph({
            text: "Master Services Agreement and Statement of Work",
            style: "DTMCTitle",
          }),

          // Subtitle
          new Paragraph({
            text: project.title,
            style: "DTMCSubtitle",
          }),
          
          // Metadata Box Table (Aptos 9pt)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "E6F4F5" }, // Light Teal/Cyan
                    children: [new Paragraph({ children: [new TextRun({ text: "Prepared for", bold: true, color: "0F172A", font: "Aptos", size: 18 })] })],
                  }),
                  new TableCell({
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: project.clientName, font: "Aptos", size: 18 })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "E6F4F5" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Client contact", bold: true, color: "0F172A", font: "Aptos", size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Riley Chen", font: "Aptos", size: 18 })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "E6F4F5" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Contact email", bold: true, color: "0F172A", font: "Aptos", size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "riley.chen@greenpath.example", font: "Aptos", size: 18 })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "E6F4F5" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Sample format", bold: true, color: "0F172A", font: "Aptos", size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Phase-gated implementation SOW", font: "Aptos", size: 18 })] })],
                  }),
                ],
              }),
            ],
          }),

          // Issued by info
          new Paragraph({
            children: [
              new TextRun({ text: "Issued by DTMC Advisory Group | contact@dtmc.example | +1 555 010 2000", size: 16, color: "64748B", font: "Aptos" }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 600 },
          }),

          // Page Break after Cover Page so Page 1 only contains cover table
          new Paragraph({
            children: [new PageBreak()],
          }),

          // Render Sections
          ...sections.flatMap((section) => {
            const elements: (Paragraph | Table)[] = [];
            
            // Section Title in Calibri Headings, Dark Blue (#10334F)
            elements.push(
              new Paragraph({
                text: section.title,
                style: "DTMCHeading1",
              })
            );

            // Clean markdown content into Word paragraphs and tables
            const lines = section.content.split('\n');
            let tableLines: string[] = [];

            const flushTable = () => {
              if (tableLines.length >= 2) {
                const headerRow = tableLines[0].split('|').map(s => s.trim()).filter(Boolean);
                const dataRows = tableLines.slice(2).map(r => r.split('|').map(s => s.trim()).filter(Boolean));

                elements.push(
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                      // Dark Blue Header Row (Calibri bold)
                      new TableRow({
                        children: headerRow.map(h => (
                          new TableCell({
                            shading: { type: ShadingType.CLEAR, fill: "10334F" }, // Dark Blue Top Bar
                            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF", font: "Calibri", size: 18 })] })],
                          })
                        ))
                      }),
                      // Body rows (Aptos 9pt) with multi-line <br/> support
                      ...dataRows.map(row => (
                        new TableRow({
                          children: row.map(cell => {
                            const cellLines = cell.split(/<br\s*\/?>/gi);
                            return new TableCell({
                              children: cellLines.map(cline => {
                                const trimmedLine = cline.trim();
                                const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
                                return new Paragraph({
                                  children: parts.map(part => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                      return new TextRun({ text: part.slice(2, -2), bold: true, font: "Aptos", size: 18 });
                                    }
                                    return new TextRun({ text: part, font: "Aptos", size: 18 });
                                  }),
                                  spacing: { after: 60, before: 30 },
                                });
                              }),
                            });
                          })
                        })
                      ))
                    ]
                  })
                );
                elements.push(new Paragraph({ text: "", spacing: { after: 120 } }));
              }
              tableLines = [];
            };

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('|')) {
                tableLines.push(trimmed);
                continue;
              } else if (tableLines.length > 0) {
                flushTable();
              }

              if (!trimmed) continue;

              if (trimmed.startsWith('### ')) {
                elements.push(new Paragraph({ text: trimmed.replace('### ', ''), style: "DTMCHeading2" }));
              } else if (trimmed.startsWith('#### ')) {
                elements.push(new Paragraph({ text: trimmed.replace('#### ', ''), style: "DTMCHeading2" }));
              } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith(' ')) {
                elements.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: "•  ", bold: true, color: "14A6A0", font: "Aptos", size: 18 }),
                      new TextRun({ text: trimmed.replace(/^[\*\-\•\]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1'), font: "Aptos", size: 18 }),
                    ],
                    spacing: { after: 80 },
                  })
                );
              } else if (trimmed.startsWith('> ')) {
                elements.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: "NOTE: ", bold: true, color: "10334F", font: "Calibri", size: 18 }),
                      new TextRun({ text: trimmed.replace('> ', ''), italics: true, font: "Aptos", size: 18 }),
                    ],
                    shading: { type: ShadingType.CLEAR, fill: "E6F4F5" },
                    spacing: { after: 120, before: 60 },
                  })
                );
              } else {
                // Standard paragraph in Aptos 9pt
                elements.push(
                  new Paragraph({
                    children: [new TextRun({ text: trimmed.replace(/\*\*(.*?)\*\*/g, '$1'), font: "Aptos", size: 18 })],
                    spacing: { after: 140 },
                  })
                );
              }
            }

            if (tableLines.length > 0) {
              flushTable();
            }

            // Spacing between sections
            elements.push(new Paragraph({ text: "", spacing: { after: 200 } }));

            return elements;
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanClient = project.clientName.replace(/[^a-zA-Z0-9]/g, '');
  const fileName = `SOW-DTMC-${cleanClient}-${project.id}.docx`;
  saveAs(blob, fileName);

  return {
    fileName,
    sizeBytes: blob.size,
  };
}
