import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AccordionItem } from './AccordionItem';

describe('AccordionItem', () => {
  it('renderiza pregunta y respuesta cerrada por defecto', () => {
    render(<AccordionItem question="¿Test?" answer="Respuesta" />);
    expect(screen.getByText('¿Test?')).toBeInTheDocument();
    expect(screen.queryByText('Respuesta')).not.toBeInTheDocument();
  });

  it('abre al hacer clic en el botón', async () => {
    render(<AccordionItem question="¿Test?" answer="Respuesta" />);
    await userEvent.click(screen.getByRole('button', { name: /test/i }));
    expect(screen.getByText('Respuesta')).toBeInTheDocument();
  });

  it('alterna aria-expanded al hacer clic', async () => {
    render(<AccordionItem question="¿Test?" answer="Respuesta" />);
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('tiene aria-expanded y aria-controls', () => {
    render(<AccordionItem question="¿Test?" answer="Respuesta" />);
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls');
  });

  it('abre por defecto si defaultOpen=true', () => {
    render(<AccordionItem question="¿Test?" answer="Respuesta" defaultOpen />);
    expect(screen.getByText('Respuesta')).toBeInTheDocument();
  });
});
