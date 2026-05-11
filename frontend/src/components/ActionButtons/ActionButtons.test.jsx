import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ActionButtons } from '../ActionButtons';

describe('ActionButtons Component', () => {
  const mockHandlers = {
    onFeed: vi.fn(),
    onPlay: vi.fn(),
    onClean: vi.fn(),
    onMedicine: vi.fn(),
    onSleep: vi.fn(),
  };

  it('renders all action buttons', () => {
    render(
      <ActionButtons
        {...mockHandlers}
        isAsleep={false}
        isSick={false}
        isLoading={false}
      />
    );

    expect(screen.getByTitle('Füttern')).toBeInTheDocument();
    expect(screen.getByTitle('Spielen')).toBeInTheDocument();
    expect(screen.getByTitle('Waschen')).toBeInTheDocument();
    expect(screen.getByTitle('Medizin')).toBeInTheDocument();
    expect(screen.getByTitle('Schlafen')).toBeInTheDocument();
  });

  it('disables all buttons when isAsleep is true', () => {
    render(
      <ActionButtons
        {...mockHandlers}
        isAsleep={true}
        isSick={false}
        isLoading={false}
      />
    );

    expect(screen.getByTitle('Füttern')).toBeDisabled();
    expect(screen.getByTitle('Spielen')).toBeDisabled();
    expect(screen.getByTitle('Waschen')).toBeDisabled();
  });

  it('disables medicine button when pet is not sick', () => {
    render(
      <ActionButtons
        {...mockHandlers}
        isAsleep={false}
        isSick={false}
        isLoading={false}
      />
    );

    expect(screen.getByTitle('Medizin')).toBeDisabled();
  });

  it('enables medicine button when pet is sick', () => {
    render(
      <ActionButtons
        {...mockHandlers}
        isAsleep={false}
        isSick={true}
        isLoading={false}
      />
    );

    expect(screen.getByTitle('Medizin')).not.toBeDisabled();
  });

  it('calls handler when button is clicked', () => {
    render(
      <ActionButtons
        {...mockHandlers}
        isAsleep={false}
        isSick={false}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByTitle('Füttern'));
    expect(mockHandlers.onFeed).toHaveBeenCalled();
  });

  it('shows cooldown indicator after action', async () => {
    const { container } = render(
      <ActionButtons
        {...mockHandlers}
        isAsleep={false}
        isSick={false}
        isLoading={false}
      />
    );

    const feedButton = screen.getByTitle('Füttern');
    fireEvent.click(feedButton);

    const cooldownBar = container.querySelector('.action-btn__cooldown');
    expect(cooldownBar).toBeInTheDocument();
  });

  it('disables button during cooldown', async () => {
    render(
      <ActionButtons
        {...mockHandlers}
        isAsleep={false}
        isSick={false}
        isLoading={false}
      />
    );

    const playButton = screen.getByTitle('Играть');
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(playButton).toBeDisabled();
    });
  });
});
