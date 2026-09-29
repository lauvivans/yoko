import DefaultButton from '@/components/action/DefaultButton';
import { WeekDayEnum } from '@/enum/DayEnum';
import { formatDateForInput } from '@/helpers/formatters/date';
import { type IOccurrence } from '@/types/Occurrence';
import { OccurrenceEndsTypeEnum } from '../enum/OccurrenceEndsTypeEnum';
import { OccurrenceCategoryEnum } from '../enum/OccurrenceCategoryEnum';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { OccurrenceFormValues } from '../schemas/occurrenceFormSchema';

const OccurrenceCreateEdit = (props: {
  isCreate: boolean;
  isEvent: boolean;
  occurrence?: IOccurrence;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isAllDay: boolean;
  handleAllDay: () => void;
  handleMonthRepetition: React.Dispatch<React.SetStateAction<number>>;
  handleYearRepetition: React.Dispatch<React.SetStateAction<number>>;
  handleWeekRepetition: React.Dispatch<React.SetStateAction<number>>;
  handleWeekRepetitionSpace: React.Dispatch<React.SetStateAction<number>>;
  handleMonthRepetitionSpace: React.Dispatch<React.SetStateAction<number>>;
  handleYearRepetitionSpace: React.Dispatch<React.SetStateAction<number>>;
  endsType: OccurrenceEndsTypeEnum;
  handleEndsType: React.Dispatch<React.SetStateAction<OccurrenceEndsTypeEnum>>;
  weekRepetition: number;
  monthRepetition: number;
  weekRepetitionSpace: number;
  monthRepetitionSpace: number;
  register: UseFormRegister<OccurrenceFormValues>;
  errors: FieldErrors<OccurrenceFormValues>;
}) => {
  const {
    isCreate,
    isEvent,
    occurrence,
    handleSubmit,
    handleAllDay,
    isAllDay,
    handleMonthRepetition,
    handleMonthRepetitionSpace,
    handleWeekRepetition,
    handleWeekRepetitionSpace,
    handleYearRepetition,
    handleYearRepetitionSpace,
    endsType,
    handleEndsType,
    monthRepetition,
    monthRepetitionSpace,
    weekRepetition,
    weekRepetitionSpace,
    errors,
    register,
  } = props;

  return (
    <form className="c-create-edit-occurrence-form" onSubmit={handleSubmit}>
      {isCreate ? (
        <>
          <textarea
            placeholder="Unamed"
            onClick={(e) => e.stopPropagation()}
            {...register('title')}
            maxLength={50}
            autoFocus
            rows={1}
            className="c-create-edit-occurrence-form__title-edit"
          />
          {errors.title?.message && (
            <span className="c-create-edit-occurrence-form__error" role="alert">
              {errors.title.message}
            </span>
          )}
        </>
      ) : (
        <h3 className="c-create-edit-occurrence-form__title">
          Edit <span>{occurrence?.title}</span>
        </h3>
      )}
      {/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */}
      <textarea
        className="c-create-edit-occurrence-form__desc"
        placeholder={occurrence?.desc || 'Description...'}
        {...register('desc')}
        maxLength={250}
        rows={4}
        defaultValue={occurrence?.desc ?? ''}
      />
      {/* eslint-enable @typescript-eslint/prefer-nullish-coalescing */}
      <select
        defaultValue={occurrence?.category ?? OccurrenceCategoryEnum.Personal}
        {...register('category')}
      >
        <option value="" disabled>
          Choose a category
        </option>
        {Object.values(OccurrenceCategoryEnum).map((occ) => (
          <option key={occ} value={occ}>
            {occ}
          </option>
        ))}
      </select>
      <div className="c-create-edit-occurrence-form__date-wrapper">
        <div className="c-create-edit-occurrence-form__date-wrapper__dates">
          <div className="c-create-edit-occurrence-form__date-wrapper__date-field">
            <input
              type="date"
              defaultValue={
                occurrence?.dateOfOccurrence
                  ? formatDateForInput(occurrence.dateOfOccurrence)
                  : undefined
              }
              {...register('dateOfOccurrence')}
            />
            {errors.dateOfOccurrence?.message && (
              <span
                className="c-create-edit-occurrence-form__error"
                role="alert"
              >
                {errors.dateOfOccurrence.message}
              </span>
            )}
          </div>
          {isEvent && (
            <div className="c-create-edit-occurrence-form__date-wrapper__date-field">
              <input
                type="date"
                {...register('endDateOfOccurrence')}
                defaultValue={
                  occurrence?.endDateOfOccurrence
                    ? formatDateForInput(occurrence.endDateOfOccurrence)
                    : undefined
                }
              />
              {errors.endDateOfOccurrence?.message && (
                <span
                  className="c-create-edit-occurrence-form__error"
                  role="alert"
                >
                  {errors.endDateOfOccurrence.message}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="c-create-edit-occurrence-form__date-wrapper__all-day">
          <input
            {...register('allDay', { onChange: handleAllDay })}
            id="all-day"
            type="checkbox"
            defaultChecked={occurrence?.allDay}
          />
          <label htmlFor="all-day">All day</label>
        </div>
      </div>
      {!isAllDay && (
        <div className="c-create-edit-occurrence-form__times">
          <input
            type="time"
            {...register('startTime')}
            defaultValue={occurrence?.startTime ?? '00:00'}
          />
          <input
            type="time"
            {...register('endTime')}
            defaultValue={occurrence?.endTime ?? '00:00'}
          />
        </div>
      )}
      {!isEvent && (
        <>
          <div className="c-create-edit-occurrence-form__weekday-rep">
            {Object.keys(WeekDayEnum).map((item) => (
              <div key={item}>
                <input
                  type="checkbox"
                  {...register('weekDayRepetition')}
                  id={item}
                  value={item}
                  defaultChecked={occurrence?.weekDayRepetition.some(
                    (wdr) => wdr === (item as WeekDayEnum)
                  )}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}
          </div>
          <div className="c-create-edit-occurrence-form__rep">
            <span>Repeat every: </span>
            <div>
              <div>
                <input
                  {...register('weekRepetition', {
                    valueAsNumber: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleWeekRepetition(parseInt(e.target.value, 10)),
                  })}
                  type="number"
                  id="repeat-week"
                  defaultValue={occurrence?.weekRepetition ?? 0}
                  min={0}
                  disabled={monthRepetition > 0}
                />
                <label htmlFor="repeat-week">week</label>
              </div>
              <div>
                <input
                  {...register('monthRepetition', {
                    valueAsNumber: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleMonthRepetition(parseInt(e.target.value, 10)),
                  })}
                  type="number"
                  id="repeat-month"
                  defaultValue={occurrence?.monthRepetition ?? 0}
                  min={0}
                  disabled={weekRepetition > 0}
                />
                <label htmlFor="repeat-month">month</label>
              </div>
              <div>
                <input
                  {...register('yearRepetition', {
                    valueAsNumber: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleYearRepetition(parseInt(e.target.value, 10)),
                  })}
                  type="number"
                  id="repeat-year"
                  defaultValue={occurrence?.yearRepetition ?? 0}
                  min={0}
                />
                <label htmlFor="repeat-year">year</label>
              </div>
            </div>
          </div>
          <div className="c-create-edit-occurrence-form__rep-space">
            <span>Repetition space: </span>
            <div>
              <div>
                <input
                  {...register('weekRepetitionSpace', {
                    valueAsNumber: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleWeekRepetitionSpace(parseInt(e.target.value, 10)),
                  })}
                  id="repeat-week-space"
                  type="number"
                  defaultValue={occurrence?.weekRepetitionSpace ?? 0}
                  min={0}
                  disabled={weekRepetitionSpace > 0}
                />
                <label htmlFor="repeat-week-space">week</label>
              </div>
              <div>
                <input
                  {...register('monthRepetitionSpace', {
                    valueAsNumber: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleMonthRepetitionSpace(parseInt(e.target.value, 10)),
                  })}
                  id="repeat-month-space"
                  type="number"
                  defaultValue={occurrence?.monthRepetitionSpace ?? 0}
                  min={0}
                  disabled={monthRepetitionSpace > 0}
                />
                <label htmlFor="repeat-month-space">month</label>
              </div>
              <div>
                <input
                  {...register('yearRepetitionSpace', {
                    valueAsNumber: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleYearRepetitionSpace(parseInt(e.target.value, 10)),
                  })}
                  id="repeat-year-space"
                  type="number"
                  defaultValue={occurrence?.yearRepetitionSpace ?? 0}
                  min={0}
                />
                <label htmlFor="repeat-year-space">year</label>
              </div>
            </div>
          </div>
          <div className="c-create-edit-occurrence-form__ends">
            <span>When it ends: </span>
            <div>
              <input
                {...register('endsType', {
                  onChange: () => handleEndsType(OccurrenceEndsTypeEnum.Never),
                })}
                type="radio"
                value={OccurrenceEndsTypeEnum.Never}
                id="ends-never"
                defaultChecked={
                  occurrence?.endsType === OccurrenceEndsTypeEnum.Never ||
                  !occurrence?.endsType
                }
              />
              <label htmlFor="ends-never">{OccurrenceEndsTypeEnum.Never}</label>
            </div>
            <div>
              <input
                {...register('endsType', {
                  onChange: () => handleEndsType(OccurrenceEndsTypeEnum.On),
                })}
                type="radio"
                value={OccurrenceEndsTypeEnum.On}
                id="ends-on"
                defaultChecked={
                  occurrence?.endsType === OccurrenceEndsTypeEnum.On
                }
              />
              <label htmlFor="ends-on">{OccurrenceEndsTypeEnum.On}</label>
              <input
                type="date"
                disabled={endsType !== OccurrenceEndsTypeEnum.On}
                {...register('endDateOfOccurrence')}
                defaultValue={
                  occurrence?.endDateOfOccurrence
                    ? formatDateForInput(occurrence.endDateOfOccurrence)
                    : undefined
                }
              />
            </div>
            <div>
              <input
                {...register('endsType', {
                  onChange: () => handleEndsType(OccurrenceEndsTypeEnum.After),
                })}
                type="radio"
                value={OccurrenceEndsTypeEnum.After}
                id="ends-after"
                defaultChecked={
                  occurrence?.endsType === OccurrenceEndsTypeEnum.After
                }
              />
              <label htmlFor="ends-after">{OccurrenceEndsTypeEnum.After}</label>
              <input
                type="number"
                defaultValue={occurrence?.qntOccurrencesTillEnd ?? 0}
                min={0}
                id="qnt-occurrences"
                {...register('qntOccurrencesTillEnd', { valueAsNumber: true })}
                disabled={endsType !== OccurrenceEndsTypeEnum.After}
              />
              <label htmlFor="qnt-occurrences">occurrences</label>
            </div>
          </div>
        </>
      )}
      <DefaultButton type="submit">
        {isCreate ? 'Create' : 'Save'}
      </DefaultButton>
    </form>
  );
};

export default OccurrenceCreateEdit;
