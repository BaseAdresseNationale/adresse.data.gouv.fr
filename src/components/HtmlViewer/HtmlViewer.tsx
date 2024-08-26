export default function HtmlViewer({ html }: { html: string }) {
  return html && <div dangerouslySetInnerHTML={{ __html: html }} />
}
