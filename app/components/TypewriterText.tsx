import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

interface TypewriterTextProps {
    text: string;
    speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 30 }) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentLine, setCurrentLine] = useState('');
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        // Reset state when text changes
        setLines(text.split('\n'));
        setCurrentIndex(0);
        setDisplayText('');
        setCurrentLine('');
        setIsComplete(false);
    }, [text]);

    useEffect(() => {
        if (currentIndex < lines.length) {
            const line = lines[currentIndex];
            if (currentLine.length < line.length) {
                const timer = setTimeout(() => {
                    setCurrentLine(line.substring(0, currentLine.length + 1));
                }, speed);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setDisplayText(prev => prev + (prev ? '\n' : '') + currentLine);
                    setCurrentLine('');
                    setCurrentIndex(prev => prev + 1);
                }, speed * 2); // Pause slightly longer between lines
                return () => clearTimeout(timer);
            }
        } else {
            setIsComplete(true);
        }
    }, [currentIndex, currentLine, lines, speed]);

    const getProcessedHTML = () => {
        const textToRender = displayText + (currentLine ? (displayText ? '\n' : '') + currentLine : '');
        return {
            __html: marked(textToRender, {
                gfm: true,
                breaks: true,
                renderer: new marked.Renderer()
            })
        };
    };

    return (
        <div className="report-content">
            <div
                className="markdown-content"
                dangerouslySetInnerHTML={getProcessedHTML()}
            />
            {!isComplete && (
                <span className="typewriter-cursor" />
            )}
        </div>
    );
};

export default TypewriterText;
