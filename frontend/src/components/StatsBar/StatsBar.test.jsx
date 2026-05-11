import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsBar } from '../StatsBar';

describe('StatsBar Component', () => {
  it('renders with correct icon and label', () => {
    render(<StatsBar icon="🍖" label="Hunger" value={75} />);
    expect(screen.getByText('🍖')).toBeInTheDocument();
    expect(screen.getByText('Hunger')).toBeInTheDocument();
  });

  it('displays numeric value', () => {
    render(<StatsBar icon="⚡" label="Energie" value={50} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('applies high stat class when value > 60', () => {
    const { container } = render(<StatsBar icon="❤️" label="Gesundheit" value={75} />);
    expect(container.querySelector('.stat')).toHaveClass('stat--high');
  });

  it('applies medium stat class when value 30-60', () => {
    const { container } = render(<StatsBar icon="❤️" label="Gesundheit" value={45} />);
    expect(container.querySelector('.stat')).toHaveClass('stat--medium');
  });

  it('applies low stat class when value < 30', () => {
    const { container } = render(<StatsBar icon="❤️" label="Gesundheit" value={20} />);
    expect(container.querySelector('.stat')).toHaveClass('stat--low');
  });

  it('updates value when prop changes', () => {
    const { rerender } = render(<StatsBar icon="😊" label="Laune" value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();

    rerender(<StatsBar icon="😊" label="Laune" value={50} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});
