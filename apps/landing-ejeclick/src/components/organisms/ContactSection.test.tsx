import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ContactSection } from './ContactSection';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ContactSection', () => {
  it('renderiza el formulario con todos los campos', () => {
    render(<ContactSection />);
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de Negocio o Emprendimiento')).toBeInTheDocument();
  });

  it('tiene el CTA correcto', () => {
    render(<ContactSection />);
    expect(screen.getByText('Solicitar Diagnóstico Gratuito')).toBeInTheDocument();
  });

  it('envía formulario y muestra éxito', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    render(<ContactSection />);
    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Juan Pérez');
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'juan@test.com');
    await userEvent.type(screen.getByLabelText('WhatsApp'), '+573001234567');
    await userEvent.type(screen.getByLabelText('Tipo de Negocio o Emprendimiento'), 'Restaurante');
    await userEvent.click(screen.getByText('Solicitar Diagnóstico Gratuito'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/gracias/i);
    });
  });

  it('muestra error si el fetch falla', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<ContactSection />);
    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Juan');
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'juan@test.com');
    await userEvent.type(screen.getByLabelText('WhatsApp'), '+573001234567');
    await userEvent.type(screen.getByLabelText('Tipo de Negocio o Emprendimiento'), 'Test');
    await userEvent.click(screen.getByText('Solicitar Diagnóstico Gratuito'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
    });
  });
});
