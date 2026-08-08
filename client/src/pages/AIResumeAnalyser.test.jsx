import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AIResumeAnalyser from './AIResumeAnalyser';
import { toast } from 'react-hot-toast';

// Mock dependencies
vi.mock('../store/useAuthStore', () => ({
  default: () => ({ isAuthenticated: true, user: { id: '123' } })
}));

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

describe('AIResumeAnalyser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL.createObjectURL for file uploads
    window.URL.createObjectURL = vi.fn();
  });

  it('renders the initial layout with resume upload section', () => {
    render(<AIResumeAnalyser />);
    expect(screen.getByText(/Smart Resume/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyser/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Resume \(PDF\)/i)).toBeInTheDocument();
  });

  it('disables the analyze button when no file is uploaded', () => {
    render(<AIResumeAnalyser />);
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i });
    expect(analyzeButton).toBeDisabled();
  });

  it('displays validation error if target role is missing on submit', async () => {
    const { container } = render(<AIResumeAnalyser />);
    
    // Upload file so button becomes enabled
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    await userEvent.upload(fileInput, file);
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i });
    
    // Ensure button is enabled now
    await waitFor(() => {
      expect(analyzeButton).not.toBeDisabled();
    });
    
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please specify a target role.');
    });
  });

  it('allows file selection and updates the UI', async () => {
    const { container } = render(<AIResumeAnalyser />);
    
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });
  });
});
