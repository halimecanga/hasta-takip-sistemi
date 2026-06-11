export const cardClass = 'rounded-2xl border border-[#edf0f3] bg-white shadow-[0_10px_30px_rgba(17,24,39,.06)]'

export const paddedCardClass = `${cardClass} p-5 max-[640px]:p-4`

const buttonFocusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2'

export const primaryButtonClass = `inline-flex items-center justify-center gap-[7px] rounded-[10px] border border-orange-500 bg-orange-500 px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_5px_13px_rgba(249,115,22,.2)] transition duration-200 ease-in-out hover:-translate-y-px hover:border-orange-600 hover:bg-orange-600 max-[640px]:whitespace-nowrap max-[640px]:px-2.5 max-[640px]:py-[9px] max-[640px]:text-[10px] ${buttonFocusClass}`

export const outlineButtonClass = `inline-flex items-center justify-center gap-[7px] rounded-[10px] border border-orange-200 bg-orange-50 px-[13px] py-[9px] text-xs font-semibold text-orange-600 transition duration-200 ease-in-out hover:bg-orange-100 ${buttonFocusClass}`

export const textButtonClass = `inline-flex items-center justify-center gap-[7px] rounded-[10px] border-0 bg-transparent px-[7px] py-[5px] text-xs font-semibold text-orange-600 transition duration-200 ease-in-out hover:bg-orange-50 ${buttonFocusClass}`

export const mutedTextButtonClass = `${textButtonClass} text-gray-500`

export const linkButtonClass = textButtonClass

export const cardHeaderClass = 'mb-[18px] flex items-center justify-between gap-3'

export const sectionTitleClass = 'mb-5 flex items-center justify-start gap-3 border-b border-[#f1f3f5] pb-[15px] [&>svg]:shrink-0 [&>svg]:text-orange-500'

export const sectionHeadingClass = 'm-0 text-sm'

export const mutedSmallTextClass = 'mt-1.5 text-xs text-gray-500'

export const formGridClass = 'grid grid-cols-2 gap-3.5 max-[640px]:grid-cols-1'

export const singleColumnFormGridClass = 'grid grid-cols-1 gap-3.5'

export const formLabelClass = 'flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600'

export const formInputClass = 'w-full rounded-[10px] border border-gray-200 bg-white px-[11px] py-2.5 text-xs text-gray-700 outline-0 transition duration-200 ease-in-out placeholder:text-gray-400 focus:border-orange-300 focus:shadow-[0_0_0_3px_#fff7ed] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400'

export const textareaClass = `${formInputClass} min-h-20 resize-y`

export const fullFieldClass = 'col-span-full max-[640px]:col-auto'

export const departmentTagClass = 'inline-block rounded-[7px] bg-orange-50 px-2 py-[5px] text-[10px] font-semibold text-orange-800'
