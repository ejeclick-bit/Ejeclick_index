import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders text content', () => {
    render(<Typography>Hello</Typography>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders h1 variant as h1 element', () => {
    render(<Typography variant="h1">Title</Typography>);
    expect(screen.getByText('Title').tagName).toBe('H1');
  });

  it('renders custom as prop', () => {
    render(<Typography as="span">Custom</Typography>);
    expect(screen.getByText('Custom').tagName).toBe('SPAN');
  });

  it('applies gradient class when gradient is true', () => {
    const { container } = render(<Typography gradient>Gradient</Typography>);
    expect(container.firstChild).toHaveClass('text-gradient');
  });
});
