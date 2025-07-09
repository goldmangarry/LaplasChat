import { Text } from '@chakra-ui/react';
import React from 'react';

export const parseMarkdown = (text: string) => {
  const elements: React.ReactNode[] = [];
  let key = 0;
  
  // Split text by line breaks first
  const lines = text.split('\n');
  
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      // Add line break between lines
      elements.push(<br key={`br-${key++}`} />);
    }
    
    // Process markdown within each line
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    
    // Combined regex to find bold and italic patterns
    const markdownRegex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
    let match;
    
    while ((match = markdownRegex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      
      if (match[1]) {
        // Bold text
        parts.push(
          <Text as="span" fontWeight="700" key={`bold-${key++}`}>
            {match[2]}
          </Text>
        );
      } else if (match[3]) {
        // Italic text
        parts.push(
          <Text as="span" fontStyle="italic" key={`italic-${key++}`}>
            {match[4]}
          </Text>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    
    // If line has content, add it to elements
    if (parts.length > 0) {
      elements.push(...parts);
    } else if (line === '') {
      // Empty line, just space holder
      elements.push(' ');
    }
  });
  
  return <>{elements}</>;
};