import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-slate max-w-none text-sm md:text-base leading-relaxed">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !bg-slate-950 !p-4 my-4 shadow-lg border border-slate-800"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className={`${className} bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono`}>
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-sky-400 mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-sky-300 mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-medium text-sky-200 mt-4 mb-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 my-4 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 my-4 space-y-1" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-slate-300" {...props} />,
          a: ({ node, ...props }) => <a className="text-sky-400 hover:text-sky-300 underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-sky-500 pl-4 py-1 my-4 bg-slate-800/50 rounded-r text-slate-400 italic" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;