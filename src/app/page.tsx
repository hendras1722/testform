'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/lib'
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { moneyRupiah } from '@/utils/moneyRupiah'
import ArrayMap from '@/components/atoms/ArrayMap'

const FormSchema = z.object({
  negara: z.string({
    required_error: 'Please select a country.',
  }),
  port: z.string({
    required_error: 'Please select a port.',
  }),
  items: z.string({
    required_error: 'Please select a items.',
  }),
  discount: z.string(),
  price: z.string(),
  total: z.string(),
})

interface Country {
  id_negara: number
  kode_negara: string
  nama_negara: string
}

interface Port {
  id_pelabuhan: string
  nama_pelabuhan: string
  id_negara: string
}

interface Items {
  id_barang: number
  nama_barang: string
  id_pelabuhan: number
  description: string
  diskon: number
  harga: number
}

export default function InputForm() {
  const [open, setOpen] = useState(false)
  const [openPort, setOpenPort] = useState(false)
  const [openItem, setOpenItem] = useState(false)
  const [country, setCountry] = useState<Country[]>([])
  const [port, setPort] = useState<Port[]>([])
  const [items, setitems] = useState<Items[]>([])
  const [count, setCount] = useState({
    negara: '',
    port: '',
    items: '',
    description: '',
    discount: '',
    price: '',
    total: '',
  })
  const [disabled, setDisabled] = useState(true)
  const [data, setData] = useState<any>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      discount: '',
      price: '',
      total: '',
    },
  })

  const watchedDiscount = form.watch('discount')
  const watchedPrice = form.watch('price')
  const watchedNegara = form.watch('negara')
  const watchedPort = form.watch('port')
  const watchedItems = form.watch('items')

  const getCountry = async () => {
    const result = await fetch('/v1/negaras').then((res) => res.json())
    setCountry(result)
  }

  const getPort = async (e: string) => {
    const result = await fetch('/v1/pelabuhans?id_negara=' + e).then((res) =>
      res.json()
    )
    setPort(result)
  }

  const getItems = async (e: string) => {
    const result = await fetch('/v1/barangs?barangs=' + e).then((res) =>
      res.json()
    )
    setitems(result)
  }

  const calculateTotal = (discount: string, price: string) => {
    const discountNum = Number(discount?.replace(/[.,]/g, '') || '0')
    const priceNum = Number(price?.replace(/[.,]/g, '') || '0')
    const total = discountNum * priceNum
    return moneyRupiah(String(total))
  }

  useEffect(() => {
    if (watchedNegara) {
      const result = country.find(
        (item) => String(item.id_negara) === String(watchedNegara)
      )?.nama_negara
      setCount((prevState) => ({
        ...prevState,
        negara: result ?? '',
      }))
      getPort(watchedNegara)
      form.setValue('port', '')
      form.setValue('items', '')
    }
  }, [watchedNegara, country])

  useEffect(() => {
    if (watchedPort) {
      const result = port.find(
        (item) => String(item.id_pelabuhan) === String(watchedPort)
      )?.nama_pelabuhan
      setCount((prevState) => ({
        ...prevState,
        port: result ?? '',
      }))
      getItems(watchedPort)
      form.setValue('items', '')
    }
  }, [watchedPort, port])

  useEffect(() => {
    if (watchedItems) {
      setDisabled(false)
      const selectedItem = items.find(
        (item) => String(item.id_barang) === String(watchedItems)
      )

      if (selectedItem) {
        const { nama_barang, description, diskon, harga } = selectedItem

        setCount((prevState) => ({
          ...prevState,
          items: nama_barang ?? '',
          description: description ?? '',
          discount:
            diskon !== undefined && diskon !== null ? String(diskon) : '',
          price: harga !== undefined && harga !== null ? String(harga) : '',
        }))

        const formattedDiscount = moneyRupiah(String(diskon || '0'))
        const formattedPrice = moneyRupiah(String(harga || '0'))
        String(
          Number(String(formattedPrice).replace(/[^\d.-]/g, '')).toLocaleString(
            'id-ID'
          )
        )
        form.setValue(
          'discount',
          String(
            Number(
              String(formattedDiscount).replace(/[^\d.-]/g, '')
            ).toLocaleString('id-ID')
          )
        )
        form.setValue(
          'price',
          String(
            Number(
              String(formattedPrice).replace(/[^\d.-]/g, '')
            ).toLocaleString('id-ID')
          )
        )

        const total = calculateTotal(formattedDiscount, formattedPrice)
        setCount((prevState) => ({
          ...count,
          total: total,
          description: description ?? '',
        }))

        form.setValue(
          'total',
          String(
            Number(String(total).replace(/[^\d.-]/g, '')).toLocaleString(
              'id-ID'
            )
          )
        )
      }
    }
  }, [watchedItems, items])

  useEffect(() => {
    if (watchedDiscount !== undefined && watchedPrice !== undefined) {
      const total = calculateTotal(watchedDiscount, watchedPrice)
      form.setValue(
        'total',
        String(
          Number(String(total).replace(/[^\d.-]/g, '')).toLocaleString('id-ID')
        )
      )
      setCount((prevState) => ({
        ...count,
        total: total,
      }))
    }
  }, [watchedDiscount, watchedPrice])

  useEffect(() => {
    getCountry()
  }, [])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(count)
    console.log(data)
    setData((prevState) => [...prevState, count])
    setCount({
      negara: '',
      port: '',
      items: '',
      description: '',
      discount: '',
      price: '',
      total: '',
    })

    form.reset({
      discount: '',
      price: '',
      total: '',
    })
  }

  return (
    <>
      <div className="py-10 overflow-auto mb-5">
        <div className="mx-[20px] shadow-lg p-5 rounded-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="negara"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Negara</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? country.find(
                                  (language) =>
                                    String(language.id_negara) ===
                                    String(field.value)
                                )?.kode_negara +
                                ' - ' +
                                country.find(
                                  (language) =>
                                    String(language.id_negara) ===
                                    String(field.value)
                                )?.nama_negara
                              : 'Select Country'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search country..."
                            className="h-9"
                          />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {country.map((item) => (
                                <CommandItem
                                  value={String(item.id_negara)}
                                  key={item.id_negara}
                                  onSelect={() => {
                                    field.onChange(String(item.id_negara))
                                    setOpen(false)
                                  }}
                                >
                                  {item.kode_negara} - {item.nama_negara}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Pelabuhan</FormLabel>
                    <Popover open={openPort} onOpenChange={setOpenPort}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPort}
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? port.find(
                                  (item) =>
                                    String(item.id_pelabuhan) ===
                                    String(field.value)
                                )?.nama_pelabuhan
                              : 'Select Port'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search port..."
                            className="h-9"
                          />
                          <CommandEmpty>No port found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {port.map((item) => (
                                <CommandItem
                                  value={String(item.id_pelabuhan)}
                                  key={item.id_pelabuhan}
                                  onSelect={() => {
                                    field.onChange(String(item.id_pelabuhan))
                                    setOpenPort(false)
                                  }}
                                >
                                  {item.nama_pelabuhan}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="items"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Barang</FormLabel>
                    <Popover open={openItem} onOpenChange={setOpenItem}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openItem}
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? items.find(
                                  (language) =>
                                    String(language.id_barang) ===
                                    String(field.value)
                                )?.nama_barang
                              : 'Select items'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search items..."
                            className="h-9"
                          />
                          <CommandEmpty>No item found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {items.map((item) => (
                                <CommandItem
                                  value={String(item.id_barang)}
                                  key={item.id_barang}
                                  onSelect={() => {
                                    field.onChange(String(item.id_barang))
                                    setOpenItem(false)
                                  }}
                                >
                                  {item.nama_barang}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Textarea
                value={count.description}
                onChange={() => {}}
                placeholder="Description"
                readOnly
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement
                          if (!input.value.match(/^\d+$/gm))
                            return (input.value = '')

                          field.onChange(input.value)
                        }}
                        placeholder="Input discount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement
                          if (!input.value) return (input.value = '')
                          const value = moneyRupiah(input.value)
                          if (value === '') return (input.value = '')
                          input.value = value.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            '.'
                          )
                          field.onChange(input.value)
                        }}
                        placeholder="Input price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Total amount"
                        {...field}
                        readOnly
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement
                          if (!input.value) return (input.value = '')
                          const value = moneyRupiah(input.value)
                          if (value === '') return (input.value = '')
                          input.value = value.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            '.'
                          )
                          field.onChange(input.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
      <div>
        <ArrayMap
          of={data ?? []}
          render={(item: typeof count, index: number) => (
            <div
              key={index}
              className="flex flex-col p-4 border-b w-fit shadow-lg mt-5 ml-5"
            >
              <div>{item.negara}</div>
              <div>{item.description}</div>
              <div>
                {(typeof item.total === 'number'
                  ? item.total
                  : Number(String(item.total).replace(/[^\d.-]/g, ''))
                ).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                })}
              </div>
            </div>
          )}
        />
      </div>
    </>
  )
}
