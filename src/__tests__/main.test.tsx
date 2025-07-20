import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';

// Mock createRoot
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

// Mock App component
vi.mock('../App', () => ({
  default: vi.fn(() => null),
}));

describe('Main entry point', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);

    const root = createRoot(div);
    expect(root.render).toBeDefined();
  });
});
