import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renderiza label e input', () => {
    render(<FormField label="Nombre" />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('pasa props al input', () => {
    const handleChange = vi.fn();
    render(<FormField label="Email" type="email" placeholder="test@mail.com" onChange={handleChange} />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'test@mail.com');
  });

  it('muestra error y conecta con aria-describedby', () => {
    render(<FormField label="Nombre" error="Campo requerido" />);
    const input = screen.getByLabelText('Nombre');
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Campo requerido');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('no muestra error si no hay error', () => {
    render(<FormField label="Nombre" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Nombre').getAttribute('aria-invalid')).toBeNull();
  });

  it('responde a input del usuario', async () => {
    render(<FormField label="Nombre" />);
    const input = screen.getByLabelText('Nombre');
    await userEvent.type(input, 'Juan');
    expect(input).toHaveValue('Juan');
  });
});
