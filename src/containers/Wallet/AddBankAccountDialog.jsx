import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, ChevronsUpDown, Check } from 'lucide-react'
import { useAddBankAccountMutation } from '@/services/gshopApi'
import { getBanks } from '@/services/bankService'
import { toast } from 'sonner'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

const AddBankAccountDialog = () => {
  const [open, setOpen] = useState(false)
  const [banks, setBanks] = useState([])
  const [loadingBanks, setLoadingBanks] = useState(false)
  const [errorBanks, setErrorBanks] = useState('')
  const [selectedBank, setSelectedBank] = useState(null)

  const [addBankAccount, { isLoading: isAddBankAccountLoading }] = useAddBankAccountMutation()

  useEffect(() => {
    let mounted = true
    const fetchBanks = async () => {
      try {
        setLoadingBanks(true)
        setErrorBanks('')
        const res = await getBanks()
        // API shape: { code, desc, data: [] }
        const list = Array.isArray(res?.data?.data) ? res.data.data : []
        if (mounted) setBanks(list)
      } catch {
        if (mounted) setErrorBanks('Không thể tải danh sách ngân hàng')
      } finally {
        if (mounted) setLoadingBanks(false)
      }
    }
    fetchBanks()
    return () => {
      mounted = false
    }
  }, [])

  const ValidationSchema = Yup.object({
    providerName: Yup.string().required('Vui lòng chọn ngân hàng'),
    bankAccountNumber: Yup.string()
      .required('Vui lòng nhập số tài khoản')
      .matches(/^\d+$/, 'Chỉ gồm chữ số')
      .min(6, 'Tối thiểu 6 chữ số'),
    accountHolderName: Yup.string().required('Vui lòng nhập tên chủ tài khoản').min(2, 'Ít nhất 2 ký tự'),
    expirationDate: Yup.string().required('Vui lòng chọn ngày hết hạn'),
    default: Yup.boolean(),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Thêm tài khoản ngân hàng">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm tài khoản ngân hàng</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            providerName: '',
            bankAccountNumber: '',
            accountHolderName: '',
            expirationDate: '',
            default: false,
          }}
          validationSchema={ValidationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await addBankAccount({
                ...values,
                accountHolderName: values.accountHolderName.toUpperCase(),
                expirationDate: values.expirationDate.split('-')[1] + '/' + values.expirationDate.split('-')[0].slice(-2),
              }).unwrap()
              toast.success('Đã thêm tài khoản ngân hàng')
              resetForm()
              setSelectedBank(null)
              setOpen(false)
            } catch {
              toast.error('Thêm tài khoản thất bại')
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Bank combobox */}
              <div>
                <Label className="mb-1 block">Ngân hàng</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      disabled={loadingBanks}
                    >
                      {selectedBank ? selectedBank.shortName : (loadingBanks ? 'Đang tải...' : 'Chọn ngân hàng')}
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-[400px] w-full p-0">
                    <Command>
                      <CommandInput placeholder="Tìm theo tên ngân hàng..." className="h-9" />
                      <CommandList className="pointer-events-auto">
                        {errorBanks ? (
                          <CommandEmpty>{errorBanks}</CommandEmpty>
                        ) : (
                          <>
                            <CommandEmpty>Không tìm thấy.</CommandEmpty>
                            <CommandGroup>
                              {banks.map((b) => (
                                <CommandItem
                                  key={b.code}
                                  value={b.shortName}
                                  onSelect={() => {
                                    setSelectedBank(b)
                                    setFieldValue('providerName', b.shortName)
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <img src={b.logo} alt={b.shortName} className="h-10 w-10 rounded-sm object-contain" />
                                    <div className="flex flex-col text-left">
                                      <span className="font-medium">{b.shortName}</span>
                                      <span className="text-xs text-muted-foreground">{b.name}</span>
                                    </div>
                                  </div>
                                  <Check className={cn('ml-auto', selectedBank?.code === b.code ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {touched.providerName && errors.providerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>
                )}
              </div>

              {/* Account number */}
              <div>
                <Label htmlFor="bankAccountNumber" className="mb-1 block">Số tài khoản</Label>
                <Field as={Input} id="bankAccountNumber" name="bankAccountNumber" placeholder="Nhập số tài khoản" />
                {touched.bankAccountNumber && errors.bankAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankAccountNumber}</p>
                )}
              </div>

              {/* Account holder name */}
              <div>
                <Label htmlFor="accountHolderName" className="mb-1 block">Tên chủ tài khoản</Label>
                <Field className="uppercase" as={Input} id="accountHolderName" name="accountHolderName" placeholder="Nhập tên chủ tài khoản" />
                {touched.accountHolderName && errors.accountHolderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>
                )}
              </div>

              {/* Expiration date */}
              <div>
                <Label htmlFor="expirationDate" className="mb-1 block">Ngày hết hạn</Label>
                <Field as={Input} id="expirationDate" name="expirationDate" type="month" />
                {touched.expirationDate && errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>
                )}
              </div>

              {/* Default checkbox (avoid form submit) */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="default"
                  checked={values.default}
                  onCheckedChange={(checked) => setFieldValue('default', !!checked)}
                  type="button"
                  aria-label="Đặt làm mặc định"
                />
                <Label htmlFor="default">Đặt làm mặc định</Label>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Đóng</Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || isAddBankAccountLoading}
                >
                  {isSubmitting || isAddBankAccountLoading ? 'Đang thêm...' : 'Thêm'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddBankAccountDialog