import { useEffect, useId, useMemo, useRef, useState, type Ref } from 'react'
import { format, isAfter, isBefore, isValid, parse, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { IMaskInput } from 'react-imask'
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type Validate,
} from 'react-hook-form'

import { Button } from '../../Button'
import CalendarIcon from '../../icons/assets/calendar.svg?react'
import styles from './DatePicker.module.css'

const DISPLAY_FORMAT = 'dd.MM.yyyy'

// date-fns прощает «31.02.2000» и молча сдвигает дату, поэтому сверяем обратное форматирование
const parseDate = (value: unknown) => {
  if (typeof value !== 'string' || value.length !== DISPLAY_FORMAT.length) {
    return undefined
  }

  const parsed = startOfDay(parse(value, DISPLAY_FORMAT, new Date()))

  if (!isValid(parsed) || format(parsed, DISPLAY_FORMAT) !== value) {
    return undefined
  }

  return parsed
}

const isInsideRange = (date: Date, minDate?: Date, maxDate?: Date) => {
  if (minDate && isBefore(date, startOfDay(minDate))) {
    return false
  }

  if (maxDate && isAfter(date, startOfDay(maxDate))) {
    return false
  }

  return true
}

// Единственный источник правды о валидности: его вызывает и react-hook-form через rules,
// и сам инпут — чтобы подсветить ошибку сразу после ввода, не дожидаясь submit
const validateDate = (
  value: unknown,
  minDate: Date | undefined,
  maxDate: Date | undefined,
  message: string,
) => {
  // Пустое поле — зона ответственности rules.required, а не этой проверки
  if (value == null || value === '') {
    return true
  }

  const parsed = parseDate(value)

  if (!parsed || !isInsideRange(parsed, minDate, maxDate)) {
    return message
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
  cancelLabel?: string
  applyLabel?: string
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
  cancelLabel: string
  applyLabel: string
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
  cancelLabel,
  applyLabel,
  className,
}: DatePickerFieldProps) => {
  const selectedDate = useMemo(() => parseDate(value), [value])

  const [inputValue, setInputValue] = useState(typeof value === 'string' ? value : '')

  // Подсказка во время набора: та же проверка, что уходит в форму, просто показанная раньше
  const [typingError, setTypingError] = useState<string>()

  const [isOpen, setIsOpen] = useState(false)

  // Выбор в календаре — черновик: в форму он попадает только по кнопке «Выбрать»
  const [draftDate, setDraftDate] = useState<Date | undefined>(selectedDate)

  const [month, setMonth] = useState<Date>(selectedDate ?? maxDate ?? new Date())

  const rootRef = useRef<HTMLDivElement>(null)

  const generatedId = useId()
  const errorId = `${generatedId}-error`

  const displayedError = error ?? typingError

  useEffect(() => {
    setInputValue(typeof value === 'string' ? value : '')
  }, [value])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const openCalendar = () => {
    if (disabled) {
      return
    }

    setDraftDate(selectedDate)
    setMonth(selectedDate ?? maxDate ?? new Date())
    setIsOpen(true)
  }

  const handleAccept = (nextValue: string) => {
    setInputValue(nextValue)
    onChange(nextValue)

    // Ругаемся только на дописанную до конца дату — иначе ошибка мигает на каждом символе
    const isComplete = nextValue.length === DISPLAY_FORMAT.length
    const result = validateDate(nextValue, minDate, maxDate, invalidDateMessage)

    setTypingError(isComplete && result !== true ? result : undefined)
  }

  const handleApply = () => {
    if (!draftDate) {
      return
    }

    const nextValue = format(draftDate, DISPLAY_FORMAT)

    setInputValue(nextValue)
    onChange(nextValue)
    setTypingError(undefined)
    setIsOpen(false)
  }

  const disabledDays = [
    ...(minDate ? [{ before: startOfDay(minDate) }] : []),
    ...(maxDate ? [{ after: startOfDay(maxDate) }] : []),
  ]

  return (
    <div ref={rootRef} className={`${styles.wrapper} ${className}`.trim()}>
      {label && (
        <label htmlFor={generatedId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={`${styles.inputContainer} ${displayedError ? styles.errorContainer : ''}`.trim()}
      >
        <IMaskInput
          id={generatedId}
          inputRef={inputRef}
          mask="00.00.0000"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          aria-invalid={Boolean(displayedError)}
          aria-describedby={displayedError ? errorId : undefined}
          onAccept={handleAccept}
          onFocus={openCalendar}
          onBlur={onBlur}
        />

        <button
          type="button"
          className={styles.calendarButton}
          aria-label="Открыть календарь"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => (isOpen ? setIsOpen(false) : openCalendar())}
        >
          <CalendarIcon aria-hidden="true" />
        </button>
      </div>

      {displayedError && (
        <span id={errorId} className={styles.errorText}>
          {displayedError}
        </span>
      )}

      {isOpen && !disabled && (
        <div className={styles.popover}>
          <DayPicker
            mode="single"
            selected={draftDate}
            onSelect={setDraftDate}
            month={month}
            onMonthChange={setMonth}
            locale={ru}
            captionLayout="dropdown"
            reverseYears
            hideNavigation
            fixedWeeks
            startMonth={new Date(startYear, 0, 1)}
            endMonth={new Date(endYear, 11, 1)}
            disabled={disabledDays}
            showOutsideDays
            classNames={{
              root: styles.calendar,
              months: styles.months,
              month: styles.month,
              month_caption: styles.monthCaption,
              dropdowns: styles.dropdowns,
              dropdown_root: styles.dropdownRoot,
              dropdown: styles.dropdown,
              caption_label: styles.captionLabel,
              chevron: styles.chevron,
              month_grid: styles.monthGrid,
              weekdays: styles.weekdays,
              weekday: styles.weekday,
              weeks: styles.weeks,
              week: styles.week,
              day: styles.day,
              day_button: styles.dayButton,
              selected: styles.selected,
              today: styles.today,
              outside: styles.outside,
              disabled: styles.disabled,
            }}
          />

          <div className={styles.footer}>
            <Button
              variant="secondary"
              className={styles.footerButton}
              onClick={() => setIsOpen(false)}
            >
              {cancelLabel}
            </Button>

            <Button
              variant="primary"
              className={styles.footerButton}
              disabled={!draftDate}
              onClick={handleApply}
            >
              {applyLabel}
            </Button>
          </div>
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
  cancelLabel = 'Отменить',
  applyLabel = 'Выбрать',
  className = '',
}: DatePickerProps<TFieldValues, TName>) => {
  // Проверка даты живёт в rules, иначе форма считает себя валидной с «31.02.2000» в поле
  const mergedRules = useMemo(() => {
    const custom = rules?.validate

    // Проверку вызывающей стороны не теряем: функцию кладём рядом под ключом custom
    const validate: Record<string, Validate<FieldPathValue<TFieldValues, TName>, TFieldValues>> = {
      ...(typeof custom === 'function' ? { custom } : custom),
      validDate: (fieldValue) => validateDate(fieldValue, minDate, maxDate, invalidDateMessage),
    }

    return { ...rules, validate }
  }, [rules, minDate, maxDate, invalidDateMessage])

  return (
    <Controller
      name={name}
      control={control}
      rules={mergedRules}
      render={({ field, fieldState }) => (
        <DatePickerField
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={fieldState.error?.message}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          startYear={startYear}
          endYear={endYear}
          invalidDateMessage={invalidDateMessage}
          cancelLabel={cancelLabel}
          applyLabel={applyLabel}
          className={className}
        />
      )}
    />
  )
}
