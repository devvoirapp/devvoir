import React, {useEffect, useState} from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import {Icon} from "@iconify/react";

interface CodeDiffProps {
    patch: string;
    filename: string;
}

interface DiffChunk {
    header: string;
    lines: Array<{
        type: 'addition' | 'deletion' | 'context';
        content: string;
    }>;
    startLine: number;
}

const CodeDiff: React.FC<CodeDiffProps> = ({ patch, filename }) => {
    const [expandedChunks, setExpandedChunks] = useState<Set<number>>(new Set());
    const [chunks, setChunks] = useState<DiffChunk[]>([]);
    const [isAllExpanded, setIsAllExpanded] = useState(false);

    useEffect(() => {
        Prism.highlightAll();
    }, [patch, expandedChunks]);

    useEffect(() => {
        const parseChunks = (patch: string): DiffChunk[] => {
            const lines = patch.split('\n');
            const chunks: DiffChunk[] = [];
            let currentChunk: DiffChunk | null = null;

            lines.forEach((line) => {
                if (line.startsWith('@@')) {
                    if (currentChunk) {
                        chunks.push(currentChunk);
                    }
                    const match = line.match(/@@ -(\d+),\d+ \+(\d+),\d+ @@/);
                    const newStart = match ? parseInt(match[2]) : 1;
                    
                    currentChunk = {
                        header: line,
                        lines: [],
                        startLine: newStart
                    };
                } else if (currentChunk) {
                    const type = line.startsWith('+') 
                        ? 'addition'
                        : line.startsWith('-') 
                            ? 'deletion' 
                            : 'context';
                    
                    currentChunk.lines.push({
                        type,
                        content: line.slice(1)
                    });
                }
            });

            if (currentChunk) {
                chunks.push(currentChunk);
            }

            return chunks;
        };

        setChunks(parseChunks(patch));
    }, [patch]);

    const getLanguage = (filename: string): string => {
        const ext = filename.split('.').pop()?.toLowerCase() || '';
        const languageMap: { [key: string]: string } = {
            'ts': 'typescript',
            'tsx': 'tsx',
            'js': 'javascript',
            'jsx': 'jsx',
            'css': 'css',
            'json': 'json',
        };
        return languageMap[ext] || 'typescript';
    };

    const toggleChunk = (index: number) => {
        const newExpandedChunks = new Set(expandedChunks);
        if (expandedChunks.has(index)) {
            newExpandedChunks.delete(index);
        } else {
            newExpandedChunks.add(index);
        }
        setExpandedChunks(newExpandedChunks);
    };

    const toggleAllChunks = () => {
        if (isAllExpanded) {
            setExpandedChunks(new Set());
        } else {
            setExpandedChunks(new Set(chunks.map((_, i) => i)));
        }
        setIsAllExpanded(!isAllExpanded);
    };

    const formatChunkHeader = (header: string) => {
        // Extract the line numbers from the chunk header (e.g., "@@ -1,7 +1,7 @@")
        const match = header.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
        if (!match) return header;

        const [, , , newStart, newCount] = match;
        const start = parseInt(newStart);
        const end = start + parseInt(newCount) - 1;
        return `Lines ${start}-${end}`;
    };

    const renderLine = (line: { type: string; content: string }, lineIndex: number, chunkStartLine: number) => {
        const isAddition = line.type === 'addition';
        const isDeletion = line.type === 'deletion';

        // Calculate the actual line number
        let displayLineNumber = '';
        if (!isDeletion) {
            displayLineNumber = (chunkStartLine + lineIndex).toString();
        }

        return (
            <div
                key={lineIndex}
                className={`relative group h-7 ${
                    isAddition
                        ? 'bg-green-950/30 w-full hover:bg-green-950/40'
                        : isDeletion
                        ? 'bg-red-950/30 w-full hover:bg-red-950/40'
                        : 'hover:bg-gray-800/50'
                } transition-colors duration-150`}
            >
                {/* Line number */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-gray-500/70 select-none border-r border-gray-700/50 font-mono text-xs">
                    {displayLineNumber}
                </div>
                {/* Change indicator */}
                <div className="absolute left-12 top-0 bottom-0 w-8 flex items-center justify-center text-gray-500/70 select-none border-r border-gray-700/50">
                    {isAddition ? (
                        <Icon icon={"lucide:plus"} className="w-3.5 h-3.5 text-green-500/70"/>
                    ) : isDeletion ? (
                        <Icon icon={"lucide:minus"} className="w-3.5 h-3.5 text-red-500/70"/>
                    ) : null}
                </div>
                {/* Code content */}
                <div className="pl-24 pr-4 h-full flex items-center whitespace-pre">
                    <span className={`language-${getLanguage(filename)} text-sm font-mono leading-none`}>
                        {line.content}
                    </span>
                </div>
                {/* Change indicator bar */}
                {(isAddition || isDeletion) && (
                    <div className={`absolute inset-y-0 left-0 w-0.5 ${
                        isAddition ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                )}
            </div>
        );
    };

    const totalAdditions = chunks.reduce((sum, chunk) => 
        sum + chunk.lines.filter(l => l.type === 'addition').length, 0
    );
    const totalDeletions = chunks.reduce((sum, chunk) => 
        sum + chunk.lines.filter(l => l.type === 'deletion').length, 0
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden text-sm border border-gray-800 bg-[#1a1a1a] shadow-xl">
                {/* File header */}
                <div className="sticky top-0 px-4 py-3 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon={"lucide:file-code"} className="w-4 h-4 text-gray-400"/>
                        <span className="text-gray-300 font-medium">
                            {filename.split('/').pop()}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleAllChunks}
                            className="text-xs px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        >
                            {isAllExpanded ? 'Collapse all' : 'Expand all'}
                        </button>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1.5">
                                <Icon icon={"lucide:plus"} className="w-3.5 h-3.5 text-green-500"/>
                                <span className="text-green-400">{totalAdditions}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon={"lucide:minus"} className="w-3.5 h-3.5 text-red-500"/>
                                <span className="text-red-400">{totalDeletions}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-800/50">
                    {chunks.map((chunk, chunkIndex) => (
                        <div key={chunkIndex}>
                            {/* Chunk header - Fixed */}
                            <div className="sticky left-0 right-0 bg-[#1a1a1a]">
                                <button
                                    onClick={() => toggleChunk(chunkIndex)}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 bg-gray-900/30 hover:bg-gray-800/30 transition-colors group"
                                >
                                    <Icon icon={"lucide:chevron-right"}
                                        className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                                            expandedChunks.has(chunkIndex) ? 'rotate-90' : ''
                                        } group-hover:text-gray-300`}
                                    />
                                    <span className="font-mono text-xs text-gray-400 group-hover:text-gray-300">
                                        {formatChunkHeader(chunk.header)}
                                    </span>
                                    <div className="flex items-center gap-3 ml-auto text-xs">
                                        <span className="flex items-center gap-1.5">
                                            <Icon icon={"lucide:plus"} className="w-3.5 h-3.5 text-green-500/70"/>
                                            <span className="text-green-400/70">
                                                {chunk.lines.filter(l => l.type === 'addition').length}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Icon icon={"lucide:minus"} className="w-3.5 h-3.5 text-red-500/70"/>
                                            <span className="text-red-400/70">
                                                {chunk.lines.filter(l => l.type === 'deletion').length}
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                            {/* Chunk content - Scrollable */}
                            {expandedChunks.has(chunkIndex) ? (
                                <div className="overflow-x-auto">
                                    {chunk.lines.map((line, lineIndex) => 
                                        renderLine(line, lineIndex, chunk.startLine)
                                    )}
                                </div>
                            ) : (
                                <div className="sticky left-0 right-0 px-4 py-2 text-xs text-gray-500 bg-gray-900/20">
                                    <span className="font-mono">
                                        {chunk.lines.length} line{chunk.lines.length !== 1 ? 's' : ''} changed
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CodeDiff;
