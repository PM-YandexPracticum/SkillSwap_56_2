import {
  useEffect,
  useState,
} from 'react'
import {
  useDropzone,
  type Accept,
  type FileRejection,
} from 'react-dropzone'
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import {
  RoundImage,
  type RoundImageSize,
} from '../../RoundImage'
import PlusCircleIcon from '../../icons/assets/plus-circle.svg?react'
import styles from './AvatarUpload.module.css'

export interface AvatarUploadProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  rules?: ControllerProps<TFieldValues, TName>['rules']
  label?: string
  alt?: string
  accept?: Accept
  maxSize?: number
  disabled?: boolean
  size?: RoundImageSize
  className?: string
}

interface AvatarUploadFieldProps {
  value: unknown
  onChange: (
    value: File | null,
  ) => void
  onBlur: () => void
  error?: string
  label?: string
  alt: string
  accept: Accept
  maxSize?: number
  disabled: boolean
  size: RoundImageSize
  className: string
}

const getRejectionMessage = (
  rejections: FileRejection[],
) => {
  const firstError =
    rejections[0]?.errors[0]

  if (!firstError) {
    return undefined
  }

  if (
    firstError.code ===
    'file-too-large'
  ) {
    return 'Изображение слишком большое'
  }

  if (
    firstError.code ===
    'file-invalid-type'
  ) {
    return 'Выберите изображение поддерживаемого формата'
  }

  return firstError.message
}

const AvatarUploadField = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  alt,
  accept,
  maxSize,
  disabled,
  size,
  className,
}: AvatarUploadFieldProps) => {
  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | undefined>(
    typeof value === 'string'
      ? value
      : undefined,
  )

  const [dropError, setDropError] =
    useState<string>()

  useEffect(() => {
    if (typeof value === 'string') {
      setPreviewUrl(value)
      return undefined
    }

    if (!(value instanceof File)) {
      setPreviewUrl(undefined)
      return undefined
    }

    const objectUrl =
      URL.createObjectURL(value)

    setPreviewUrl(objectUrl)

    return () =>
      URL.revokeObjectURL(
        objectUrl,
      )
  }, [value])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept,
    multiple: false,
    maxFiles: 1,
    maxSize,
    disabled,

    onDrop: (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
    ) => {
      if (
        fileRejections.length > 0
      ) {
        setDropError(
          getRejectionMessage(
            fileRejections,
          ),
        )

        return
      }

      const file =
        acceptedFiles[0]

      if (file) {
        setDropError(undefined)
        onChange(file)
      }
    },
  })

  const displayedError =
    dropError || error

  const accessibleLabel =
    label || 'Загрузить аватар'

  return (
    <div
      className={`${styles.wrapper} ${className}`.trim()}
    >
      {label && (
        <span className={styles.label}>
          {label}
        </span>
      )}

      <div
        {...getRootProps({
          className: `${styles.dropzone} ${
            isDragActive
              ? styles.dragActive
              : ''
          } ${
            displayedError
              ? styles.errorDropzone
              : ''
          }`.trim(),

          role: 'button',
          tabIndex: disabled ? -1 : 0,

          'aria-label':
            accessibleLabel,

          'aria-invalid':
            Boolean(displayedError),
        })}
      >
        <input
          {...getInputProps({
            onBlur,
          })}
        />

        <RoundImage
          src={previewUrl}
          alt={alt}
          size={size}
        />

        <span
          className={styles.addIcon}
          aria-hidden="true"
        >
          <PlusCircleIcon />
        </span>
      </div>

      {displayedError && (
        <span
          className={styles.errorText}
        >
          {displayedError}
        </span>
      )}
    </div>
  )
}

const DEFAULT_ACCEPT: Accept = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
}

export const AvatarUpload = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  alt = 'Аватар пользователя',
  accept = DEFAULT_ACCEPT,
  maxSize,
  disabled = false,
  size = 'lg',
  className = '',
}: AvatarUploadProps<
  TFieldValues,
  TName
>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({
      field,
      fieldState,
    }) => (
      <AvatarUploadField
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={
          fieldState.error?.message
        }
        label={label}
        alt={alt}
        accept={accept}
        maxSize={maxSize}
        disabled={disabled}
        size={size}
        className={className}
      />
    )}
  />
)