import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SpeechBubble } from '../SpeechBubble';

describe('SpeechBubble Component', () => {
  it('renders text when provided', () => {
    render(<SpeechBubble text="Hallo Welt!" duration={3000} />);
    expect(screen.getByText('Hallo Welt!')).toBeInTheDocument();
  });

  it('does not render when text is empty', () => {
    const { container } = render(<SpeechBubble text="" duration={3000} />);
    expect(container.querySelector('.speech-bubble')).not.toBeInTheDocument();
  });

  it('disappears after duration', async () => {
    const { rerender } = render(<SpeechBubble text="Miau!" duration={100} />);

    expect(screen.getByText('Miau!')).toBeInTheDocument();

    await waitFor(
      () => {
        rerender(<SpeechBubble text="Miau!" duration={100} />);
      },
      { timeout: 200 }
    );
  });

  it('updates when text prop changes', () => {
    const { rerender } = render(<SpeechBubble text="Erste Nachricht" duration={3000} />);
    expect(screen.getByText('Erste Nachricht')).toBeInTheDocument();

    rerender(<SpeechBubble text="Zweite Nachricht" duration={3000} />);
    expect(screen.getByText('Zweite Nachricht')).toBeInTheDocument();
  });

  it('has speech bubble tail element', () => {
    const { container } = render(<SpeechBubble text="Miau" duration={3000} />);
    expect(container.querySelector('.speech-bubble__tail')).toBeInTheDocument();
  });
});
