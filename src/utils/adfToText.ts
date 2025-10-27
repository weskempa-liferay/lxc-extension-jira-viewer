/**
 * Extracts plain text from Atlassian Document Format (ADF) objects
 * ADF is a JSON structure used by Jira for rich text content
 */

interface AdfNode {
  type: string;
  content?: AdfNode[];
  text?: string;
  marks?: any[];
  attrs?: any;
}

/**
 * Recursively extracts text from an ADF node and its children
 */
function extractTextFromNode(node: AdfNode): string {
  if (!node) return '';

  // If this is a text node, return its text content
  if (node.type === 'text' && node.text) {
    return node.text;
  }

  // If this node has children, recursively extract text from them
  if (node.content && Array.isArray(node.content)) {
    const textParts = node.content.map(child => extractTextFromNode(child));
    
    // Add spacing based on node type
    switch (node.type) {
      case 'paragraph':
      case 'heading':
        return textParts.join('') + '\n';
      case 'listItem':
        return '• ' + textParts.join('') + '\n';
      case 'orderedList':
      case 'bulletList':
        return textParts.join('');
      default:
        return textParts.join('');
    }
  }

  return '';
}

/**
 * Converts an ADF object to plain text
 * @param adf - Atlassian Document Format object or plain string
 * @returns Plain text string
 */
export function adfToPlainText(adf: any): string {
  // If it's already a string, return it
  if (typeof adf === 'string') {
    return adf;
  }

  // If it's null or undefined, return empty string
  if (!adf) {
    return '';
  }

  // If it's an ADF object, extract the text
  if (typeof adf === 'object' && adf.type === 'doc') {
    const text = extractTextFromNode(adf);
    // Trim extra newlines and whitespace
    return text.trim();
  }

  // If we can't parse it, return empty string
  return '';
}
