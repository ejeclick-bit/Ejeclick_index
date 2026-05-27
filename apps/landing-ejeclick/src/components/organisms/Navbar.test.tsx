import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renderiza enlaces de navegación', () => {
    render(<Navbar />);
    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText('Proceso')).toBeInTheDocument();
    expect(screen.getByText('Casos de Éxito')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renderiza el logo', () => {
    render(<Navbar />);
    expect(screen.getByText(/Eje/i)).toBeInTheDocument();
  });

  it('tiene navegación con aria-label', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('Navegación principal')).toBeInTheDocument();
  });

  it('tiene botón de menú móvil con aria-label', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Abrir menú');
    expect(menuButton).toBeInTheDocument();
  });

  it('abre menú móvil al hacer clic', async () => {
    render(<Navbar />);
    await userEvent.click(screen.getByLabelText('Abrir menú'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Cerrar menú')).toBeInTheDocument();
  });
});
