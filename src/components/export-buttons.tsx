'use client'

import { useState } from 'react'
import { Download, FileText } from 'lucide-react'

interface Props {
  status: string
  from: string
  to: string
}

function buildParams(status: string, from: string, to: string, format: string) {
  const p = new URLSearchParams({ format })
  if (status) p.set('status', status)
  if (from) p.set('from', from)
  if (to) p.set('to', to)
  return p.toString()
}

export function ExportButtons({ status, from, to }: Props) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const csvUrl = `/admin/relatorio?${buildParams(status, from, to, 'csv')}`

  async function downloadPdf() {
    setPdfLoading(true)
    setPdfError(null)

    try {
      const res = await fetch(`/admin/relatorio?${buildParams(status, from, to, 'json')}`)
      if (!res.ok) throw new Error('Falha ao carregar dados')
      const { donations, summary } = await res.json()

      // Dynamic import to keep PDF libs out of the initial bundle
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      // Header
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(44, 39, 35)
      doc.text('Ajudando Todos em Amor', 14, 18)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(140, 127, 118)
      doc.text('Relatório de Doações · Araquari/SC', 14, 25)

      const now = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      })
      doc.text(`Gerado em ${now}`, 14, 31)

      // Filters info
      const filterParts: string[] = []
      if (status) filterParts.push(`Status: ${status === 'confirmed' ? 'Confirmado' : status === 'pending' ? 'Pendente' : 'Cancelado'}`)
      if (from) filterParts.push(`De: ${new Date(from).toLocaleDateString('pt-BR')}`)
      if (to) filterParts.push(`Até: ${new Date(to).toLocaleDateString('pt-BR')}`)
      if (filterParts.length) {
        doc.setFontSize(9)
        doc.setTextColor(92, 83, 75)
        doc.text(filterParts.join('  ·  '), 14, 37)
      }

      // Summary strip
      const summaryY = filterParts.length ? 44 : 38
      doc.setFillColor(224, 90, 80)
      doc.roundedRect(14, summaryY, 268, 18, 3, 3, 'F')

      const stats = [
        { label: 'Arrecadado (conf.)', value: `R$ ${Number(summary.total_money).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
        { label: 'Total de doações', value: String(summary.total_donations) },
        { label: 'Pendentes', value: String(summary.pending_count) },
        { label: 'Itens recebidos', value: `${summary.total_items} un.` },
      ]

      stats.forEach((s, i) => {
        const x = 14 + i * 67 + 10
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(255, 255, 255)
        doc.text(s.value, x, summaryY + 8)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(255, 220, 215)
        doc.text(s.label, x, summaryY + 14)
      })

      // Table
      const tableY = summaryY + 24

      const statusLabel = (s: string) =>
        s === 'confirmed' ? 'Confirmado' : s === 'pending' ? 'Pendente' : 'Cancelado'

      const valorItem = (d: { donation_type: string; amount?: number | null; item_description?: string | null; item_quantity?: number | null }) => {
        if (d.donation_type === 'money') {
          return d.amount != null
            ? `R$ ${Number(d.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            : '—'
        }
        return `${d.item_quantity ?? '?'}× ${d.item_description ?? ''}`
      }

      autoTable(doc, {
        startY: tableY,
        head: [['Doador', 'Email / Telefone', 'Tipo', 'Valor / Item', 'Status', 'Data']],
        body: donations.map((d: {
          donor_name: string; donor_email: string; donor_phone?: string | null;
          donation_type: string; amount?: number | null; item_description?: string | null;
          item_quantity?: number | null; status: string; donated_at: string;
        }) => [
          d.donor_name,
          d.donor_email || d.donor_phone || '',
          d.donation_type === 'money' ? 'Dinheiro' : 'Item',
          valorItem(d),
          statusLabel(d.status),
          new Date(d.donated_at).toLocaleDateString('pt-BR'),
        ]),
        headStyles: {
          fillColor: [247, 242, 237],
          textColor: [138, 127, 118],
          fontStyle: 'bold',
          fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: [44, 39, 35] },
        alternateRowStyles: { fillColor: [252, 250, 248] },
        columnStyles: {
          0: { cellWidth: 48 },
          1: { cellWidth: 55 },
          2: { cellWidth: 22 },
          3: { cellWidth: 50 },
          4: { cellWidth: 28 },
          5: { cellWidth: 22 },
        },
        margin: { left: 14, right: 14 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        didDrawPage: (data: any) => {
          doc.setFontSize(8)
          doc.setTextColor(138, 127, 118)
          doc.text(
            `Página ${data.pageNumber} de ${data.pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 6,
            { align: 'center' }
          )
        },
      })

      doc.save(`doacoes-${now.replace(/\//g, '-')}.pdf`)
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Erro ao gerar PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <a
          href={csvUrl}
          download
          className="inline-flex items-center gap-2 bg-white border-[1.5px] border-coral text-coral-deep font-semibold text-sm px-5 py-2.5 rounded-[10px] hover:bg-coral-light transition-colors"
        >
          <Download size={15} />
          Baixar CSV
        </a>

        <button
          onClick={downloadPdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 bg-coral text-white font-semibold text-sm px-5 py-2.5 rounded-[10px] hover:bg-coral-deep transition-colors disabled:opacity-60 shadow-coral"
        >
          <FileText size={15} />
          {pdfLoading ? 'Gerando…' : 'Baixar PDF'}
        </button>
      </div>

      {pdfError && (
        <p className="text-red-500 text-xs mt-1">{pdfError}</p>
      )}
    </div>
  )
}
