import React from 'react'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'react-router-dom'
import { useURLSync } from '@/hooks/useURLSync'
import { debounce } from 'lodash'
import HsTree from '@/components/HsTree'
import PageLoading from '@/components/PageLoading'
import PageError from '@/components/PageError'
import { useGetHsCodesQuery } from '@/services/gshopApi'
import HsCodeUploadPreviewDialog from '@/components/HsCodeUploadPreviewDialog'
import { toast } from 'sonner'

const REQUIRED_COLUMNS = ["id", "rate", "region", "taxName", "taxType", "hsCode"]

const HsCodeConfig = () => {
  const fileInputRef = useRef(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadRows, setUploadRows] = useState([])

  const [searchParams, setSearchParams] = useSearchParams()
  const [search] = useURLSync(searchParams, setSearchParams, 'search', 'string', '')
  const [hsCode] = useURLSync(searchParams, setSearchParams, 'hsCode', 'string', '')

  const [searchInput, setSearchInput] = useState(search || '')
  const [hsCodeInput, setHsCodeInput] = useState(hsCode || '')

  const { data: hsCodesData, isLoading, isError, isUninitialized } = useGetHsCodesQuery({
    ...(search && { description: search }),
    ...(hsCode && { hsCode }),
  })

  const debounceSearch = useMemo(
    () =>
      debounce((event) => {
        setSearchParams((params) => {
          params.set('search', event.target.value)
          return params
        })
      }, 1000),
    [setSearchParams]
  )

  const debounceHSCode = useMemo(
    () =>
      debounce((event) => {
        setSearchParams((params) => {
          params.set('hsCode', event.target.value)
          return params
        })
      }, 1000),
    [setSearchParams]
  )

  useEffect(() => {
    return () => {
      debounceSearch.cancel()
      debounceHSCode.cancel()
    }
  }, [debounceSearch, debounceHSCode])

  const onChooseFile = () => fileInputRef.current?.click()

  const parseAndOpenPreview = async (file) => {
    if (!file) return
    const fileExtension = (file.name.split('.').pop() || '').toLowerCase()
    try {
      // Lazy import to avoid adding to initial bundle
      const xlsxModule = await import('xlsx')

      if (fileExtension === 'csv') {
        const csvText = await file.text()
        const workbook = xlsxModule.read(csvText, { type: 'string' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rowsFromSheet = xlsxModule.utils.sheet_to_json(worksheet, { defval: '' })
        setUploadRows(normalizeRows(rowsFromSheet))
        setUploadOpen(true)
      } else {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = xlsxModule.read(arrayBuffer, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rowsFromSheet = xlsxModule.utils.sheet_to_json(worksheet, { defval: '' })
        setUploadRows(normalizeRows(rowsFromSheet))
        setUploadOpen(true)
      }
    } catch (err) {
      console.error(err)
      toast.error('Không thể đọc tệp. Vui lòng kiểm tra định dạng CSV/XLSX.')
    }
  }

  const normalizeRows = (rows) => {
    if (!Array.isArray(rows)) return []
    return rows
      .map((row) => {
        const normalizedRow = {}
        Object.entries(row || {}).forEach(([key, value]) => {
          const trimmedKey = String(key).trim()
          normalizedRow[trimmedKey] = value
        })
        return normalizedRow
      })
      .filter((row) => Object.values(row).some((value) => value !== '' && value != null))
  }

  const onConfirmImport = async (rows) => {
    // TODO: integrate API import once backend is available
    const missing = REQUIRED_COLUMNS.filter((c) => !rows.some((r) => c in r))
    if (missing.length) {
      toast.error(`Thiếu cột bắt buộc: ${missing.join(', ')}`)
      return
    }
    toast.success(`Đã đọc ${rows.length} dòng. Vui lòng xác nhận lưu (chưa có API).`)
    setUploadOpen(false)
  }

  return (
    <div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Tìm kiếm theo mô tả"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value)
              debounceSearch(event)
            }}
            className="w-64"
          />
          <Input
            type="text"
            placeholder="Tìm kiếm theo code"
            value={hsCodeInput}
            onChange={(event) => {
              setHsCodeInput(event.target.value)
              debounceHSCode(event)
            }}
            className="w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="hidden"
            onChange={(e) => parseAndOpenPreview(e.target.files?.[0])}
          />
          <Button onClick={onChooseFile}>Tải lên CSV/XLSX</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        {isError ? (
          <PageError />
        ) : isLoading || isUninitialized ? (
          <PageLoading />
        ) : !hsCodesData ? (
          <div className="text-sm text-gray-500">Không có dữ liệu.</div>
        ) : (
          <HsTree treeData={hsCodesData.content} selectedCode={hsCode} showSearch={false} />
        )}
      </div>

      <HsCodeUploadPreviewDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        rows={uploadRows}
        setRows={setUploadRows}
        onConfirm={onConfirmImport}
      />
    </div>
  )
}

export default HsCodeConfig