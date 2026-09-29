import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type ComponentProps } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import OccurrenceCreateEdit from './OccurrenceCreateEdit';
import { OccurrenceEndsTypeEnum } from '../enum/OccurrenceEndsTypeEnum';
import {
  occurrenceFormSchema,
  type OccurrenceFormValues,
} from '../schemas/occurrenceFormSchema';

type FormProps = ComponentProps<typeof OccurrenceCreateEdit>;

const TestForm = () => {
  const form = useForm<OccurrenceFormValues>({
    resolver: zodResolver(occurrenceFormSchema),
  });

  const props: FormProps = {
    isCreate: true,
    isEvent: true,
    handleSubmit: form.handleSubmit(() => undefined),
    isAllDay: false,
    handleAllDay: () => undefined,
    handleMonthRepetition: () => undefined,
    handleYearRepetition: () => undefined,
    handleWeekRepetition: () => undefined,
    handleWeekRepetitionSpace: () => undefined,
    handleMonthRepetitionSpace: () => undefined,
    handleYearRepetitionSpace: () => undefined,
    endsType: OccurrenceEndsTypeEnum.Never,
    handleEndsType: () => undefined,
    weekRepetition: 0,
    monthRepetition: 0,
    weekRepetitionSpace: 0,
    monthRepetitionSpace: 0,
    register: form.register,
    errors: form.formState.errors,
  };

  return <OccurrenceCreateEdit {...props} />;
};

describe('OccurrenceCreateEdit', () => {
  it('displays validation messages next to required fields after submit', async () => {
    render(<TestForm />);

    const form = screen.getByRole('button', { name: 'Create' }).closest('form');
    if (!form) throw new Error('Occurrence form was not rendered');

    fireEvent.submit(form);

    const titleError = await screen.findByText('Title is required');
    const dateError = await screen.findByText('Date is required');

    expect(titleError).toBeInTheDocument();
    expect(titleError).toBeVisible();
    expect(dateError).toBeInTheDocument();
    expect(dateError).toBeVisible();
  });
});
