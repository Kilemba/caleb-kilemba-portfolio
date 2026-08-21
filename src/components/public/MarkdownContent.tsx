import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// Highlight theme. Chosen to sit on the dark `pre` background already set by .prose-caleb.
import "highlight.js/styles/github-dark.css";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-caleb">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // `detect` keeps fenced blocks without a language from rendering unstyled.
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
