import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Ref,
} from 'react'
import {
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  startOfDay,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { IMaskInput } from 'react-imask'
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import CalendarIcon from '../icons/assets/calendar.svg?react'
import styles from './DatePicker.module.css'

const DISPLAY_FORMAT = 'dd.MM.yyyy'

const parseDisplayDate = (value: string) => {
  if (value.length !== 10) {
    return null
  }

  const parsed = startOfDay(
    parse(value, DISPLAY_FORMAT, new Date()),
  )

  if (
    !isValid(parsed) ||
    format(parsed, DISPLAY_FORMAT) !== value
  ) {
    return null
  }

  return parsed
}

const parseStoredDate = (value: unknown) => {
  if (typeof value !== 'string' || !value) {
    return undefined
  }

  const parsed = startOfDay(
    parse(value, DISPLAY_FORMAT, new Date()),
  )

  if (
    !isValid(parsed) ||
    format(parsed, DISPLAY_FORMAT) !== value
  ) {
    return undefined
  }

  return parsed
}

const isInsideRange = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
) => {
  if (
    minDate &&
    isBefore(date, startOfDay(minDate))
  ) {
    return false
  }

  if (
    maxDate &&
    isAfter(date, startOfDay(maxDate))
  ) {
    return false
  }

  return true
}

export interface DatePickerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  rules?: ControllerProps<TFieldValues, TName>['rules']
  label?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  startYear?: number
  endYear?: number
  invalidDateMessage?: string
  className?: string
}

interface DatePickerFieldProps {
  value: unknown
  onChange: (value: string) => void
  onBlur: () => void
  inputRef: Ref<HTMLInputElement>
  error?: string
  label?: string
  placeholder: string
  disabled: boolean
  minDate?: Date
  maxDate?: Date
  startYear: number
  endYear: number
  invalidDateMessage: string
  className: string
}

const DatePickerField = ({
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  label,
  placeholder,
  disabled,
  minDate,
  maxDate,
  startYear,
  endYear,
  invalidDateMessage,
  className,
}: DatePickerFieldProps) => {
  const selectedDate = useMemo(
    () => parseStoredDate(value),
    [value],
  )

  const [inputValue, setInputValue] = useState(
    selectedDate
      ? format(selectedDate, DISPLAY_FORMAT)
      : '',
  )

  const [localError, setLocalError] =
    useState<string>()

  const [isOpen, setIsOpen] = useState(false)

  const [month, setMonth] = useState<Date>(
    selectedDate ?? maxDate ?? new Date(),
  )

  const rootRef = useRef<HTMLDivElement>(null)

  const generatedId = useId()
  const errorId = `${generatedId}-error`

  const displayedError = localError || error

  useEffect(() => {
    const nextValue =
      typeof value === 'string' ? value : ''

    setInputValue(nextValue)

    if (selectedDate) {
      setMonth(selectedDate)
      setLocalError(undefined)
    } else if (!nextValue) {
      setLocalError(undefined)
    }
  }, [selectedDate, value])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (
      event: MouseEvent,
    ) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handlePointerDown,
    )

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handlePointerDown,
      )

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [isOpen])

  const validateAndCommit = (
    nextValue: string,
  ) => {
    setInputValue(nextValue)
    onChange(nextValue)

    const parsed =
      parseDisplayDate(nextValue)

    if (!parsed) {
      setLocalError(
        nextValue.length === 10
          ? invalidDateMessage
          : undefined,
      )

      return
    }

    if (
      !isInsideRange(
        parsed,
        minDate,
        maxDate,
      )
    ) {
      setLocalError(invalidDateMessage)
      return
    }

    setLocalError(undefined)
    setMonth(parsed)
  }

  const handleSelect = (
    date: Date | undefined,
  ) => {
    if (!date) {
      return
    }

    const normalized = startOfDay(date)

    if (
      !isInsideRange(
        normalized,
        minDate,
        maxDate,
      )
    ) {
      return
    }

    const nextValue = format(
      normalized,
      DISPLAY_FORMAT,
    )

    onChange(nextValue)
    setInputValue(nextValue)
    setLocalError(undefined)
    setMonth(normalized)
    setIsOpen(false)
  }

  const disabledDays = [
    ...(minDate
      ? [{ before: startOfDay(minDate) }]
      : []),
    ...(maxDate
      ? [{ after: startOfDay(maxDate) }]
      : []),
  ]

  return (
    <div
      ref={rootRef}
      className={`${styles.wrapper} ${className}`.trim()}
    >
      {label && (
        <label
          htmlFor={generatedId}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <div
        className={`${styles.inputContainer} ${
          displayedError
            ? styles.errorContainer
            : ''
        }`.trim()}
      >
        <IMaskInput
          id={generatedId}
          inputRef={inputRef}
          mask="00.00.0000"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          aria-invalid={Boolean(
            displayedError,
          )}
          aria-describedby={
            displayedError
              ? errorId
              : undefined
          }
          onAccept={(
            nextValue: string,
          ) =>
            validateAndCommit(nextValue)
          }
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true)
            }
          }}
          onBlur={() => {
            if (
              inputValue &&
              !parseDisplayDate(inputValue)
            ) {
              setLocalError(
                invalidDateMessage,
              )
            }

            onBlur()
          }}
        />

        <button
          type="button"
          className={
            styles.calendarButton
          }
          aria-label="Открыть календарь"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() =>
            setIsOpen(
              (open) => !open,
            )
          }
        >
          <CalendarIcon aria-hidden="true" />
        </button>
      </div>

      {displayedError && (
        <span
          id={errorId}
          className={styles.errorText}
        >
          {displayedError}
        </span>
      )}

      {isOpen && !disabled && (
        <div className={styles.popover}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            locale={ru}
            captionLayout="dropdown"
            reverseYears
            navLayout="after"
            startMonth={
              new Date(startYear, 0, 1)
            }
            endMonth={
              new Date(endYear, 11, 1)
            }
            disabled={disabledDays}
            showOutsideDays
            classNames={{
              root: styles.calendar,
              months: styles.months,
              month: styles.month,
              month_caption:
                styles.monthCaption,
              dropdowns:
                styles.dropdowns,
              dropdown_root:
                styles.dropdownRoot,
              dropdown:
                styles.dropdown,
              nav: styles.nav,
              button_previous:
                styles.navButton,
              button_next:
                styles.navButton,
              month_grid:
                styles.monthGrid,
              weekdays:
                styles.weekdays,
              weekday:
                styles.weekday,
              weeks: styles.weeks,
              week: styles.week,
              day: styles.day,
              day_button:
                styles.dayButton,
              selected:
                styles.selected,
              today: styles.today,
              outside: styles.outside,
              disabled:
                styles.disabled,
            }}
          />
        </div>
      )}
    </div>
  )
}

export const DatePicker = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  placeholder = 'дд.мм.гггг',
  disabled = false,
  minDate,
  maxDate,
  startYear = 1900,
  endYear = new Date().getFullYear(),
  invalidDateMessage = 'Введите корректную дату',
  className = '',
}: DatePickerProps<TFieldValues, TName>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({
      field,
      fieldState,
    }) => (
      <DatePickerField
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        inputRef={field.ref}
        error={
          fieldState.error?.message
        }
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        startYear={startYear}
        endYear={endYear}
        invalidDateMessage={
          invalidDateMessage
        }
        className={className}
      />
    )}
  />
)