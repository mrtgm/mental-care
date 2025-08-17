import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { sampleMarkdown } from "@/data/dummy-text";

import "highlight.js/styles/github-dark.css";

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-white border-b border-gray-700 pb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-white">{children}</h3>,

  p: ({ children }) => <p className="mb-4 text-gray-200 leading-relaxed">{children}</p>,

  a: ({ href, children }) => (
    <a href={href} className="text-blue-400 hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),

  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,

  ul: ({ children }) => <ul className="mb-4 ml-6 list-disc text-gray-200 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal text-gray-200 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="text-gray-200">{children}</li>,

  blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-500 pl-4 mb-4 bg-gray-800 py-2 italic text-gray-300">{children}</blockquote>,

  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="bg-gray-700 text-gray-200 px-1.5 py-0.5 text-sm font-mono">{children}</code>;
    }
    // ブロックコードの場合はhighlight.jsが自動で処理するので、基本的なスタイルのみ
    return <code className={className}>{children}</code>;
  },

  pre: ({ children, className }) => (
    <div className="relative mb-4">
      <pre className={`hljs overflow-x-auto border p-2 border-gray-600 bg-[#0d1117] text-[#c9d1d9] ${className || ""}`}>{children}</pre>
    </div>
  ),

  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden">{children}</table>
    </div>
  ),

  thead: ({ children }) => <thead className="bg-gray-700">{children}</thead>,

  tbody: ({ children }) => <tbody className="bg-gray-800">{children}</tbody>,

  tr: ({ children }) => <tr className="border-b border-gray-600">{children}</tr>,

  th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-white border-r border-gray-600 last:border-r-0">{children}</th>,

  td: ({ children }) => <td className="px-4 py-2 text-gray-200 border-r border-gray-600 last:border-r-0">{children}</td>,

  del: ({ children }) => <del className="text-gray-400 line-through">{children}</del>,
  input: ({ checked, disabled }) => <input type="checkbox" checked={checked} disabled={disabled} className="mr-2 accent-blue-500" readOnly />,
  hr: () => <hr className="border-gray-600 my-6" />,
  img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full h-auto rounded-lg mb-4 border border-gray-600" />,
};

export const EventDetail = () => {
  return (
    <div className="text-white">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize, rehypeHighlight]} components={markdownComponents}>
          {sampleMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
