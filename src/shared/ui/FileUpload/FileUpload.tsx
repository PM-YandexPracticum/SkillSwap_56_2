import {
  useMemo,
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

import GalleryAddIcon from '../icons/assets/gallery-add.svg?react'
import styles from './FileUpload.module.css'

export interface FileUploadProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  rules?: ControllerProps<TFieldValues, TName>['rules']
  label?: string
  accept?: Accept
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
  className?: string
  dropzoneText?: string
  actionText?: string
}

interface FileUploadFieldProps {
  value: unknown
  onChange: (files: File[]) => void
  onBlur: () => void
  error?: string
  label?: string
  accept?: Accept
  multiple: boolean
  maxFiles: number
  maxSize?: number
  disabled: boolean
  className: string
  dropzoneText: string
  actionText: string
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
    return 'Файл слишком большой'
  }

  if (
    firstError.code ===
    'file-invalid-type'
  ) {
    return 'Неподдерживаемый формат файла'
  }

  if (
    firstError.code ===
    'too-many-files'
  ) {
    return 'Выбрано слишком много файлов'
  }

  return firstError.message
}

const FileUploadField = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  accept,
  multiple,
  maxFiles,
  maxSize,
  disabled,
  className,
  dropzoneText,
  actionText,
}: FileUploadFieldProps) => {
  const [dropError, setDropError] =
    useState<string>()

  const files = useMemo(
    () =>
      Array.isArray(value)
        ? value.filter(
            (
              item,
            ): item is File =>
              item instanceof File,
          )
        : [],
    [value],
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    accept,
    multiple,
    maxFiles: multiple
      ? maxFiles
      : 1,
    maxSize,
    disabled,
    noClick: true,

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
      } else {
        setDropError(undefined)
      }

      if (
        acceptedFiles.length > 0
      ) {
        onChange(
          multiple
            ? acceptedFiles.slice(
                0,
                maxFiles,
              )
            : acceptedFiles.slice(
                0,
                1,
              ),
        )
      }
    },
  })

  const displayedError =
    dropError || error

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

          'aria-invalid':
            Boolean(displayedError),
        })}
      >
        <input
          {...getInputProps({
            onBlur,
          })}
        />

        <span
          className={
            styles.dropzoneText
          }
        >
          {isDragActive
            ? 'Отпустите файлы здесь'
            : dropzoneText}
        </span>

        <button
          type="button"
          className={
            styles.actionButton
          }
          disabled={disabled}
          onClick={open}
        >
          <GalleryAddIcon
            aria-hidden="true"
          />

          <span>{actionText}</span>
        </button>
      </div>

      {files.length > 0 && (
        <ul
          className={styles.fileList}
          aria-label="Выбранные файлы"
        >
          {files.map((file) => (
            <li
              key={`${file.name}-${file.lastModified}`}
              className={
                styles.fileItem
              }
            >
              {file.name}
            </li>
          ))}
        </ul>
      )}

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

export const FileUpload = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  label,
  accept,
  multiple = true,
  maxFiles = 10,
  maxSize,
  disabled = false,
  className = '',
  dropzoneText =
    'Перетащите или выберите изображения навыка',
  actionText = 'Выбрать изображения',
}: FileUploadProps<
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
      <FileUploadField
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={
          fieldState.error?.message
        }
        label={label}
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxSize={maxSize}
        disabled={disabled}
        className={className}
        dropzoneText={dropzoneText}
        actionText={actionText}
      />
    )}
  />
)